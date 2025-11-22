// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { TIME_CONSTANTS } from "@filoz/synapse-sdk";
import { getSynapseClient } from "../../lib/synapse";

// Configuração para permitir payloads JSON grandes (necessário para arquivos em Base64)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function POST(req: Request) {
  try {
    // 1. Ler o JSON
    const body = await req.json();
    
    // MUDANÇA AQUI: Extraindo o campo 'file' em vez de 'binary'
    const { file } = body; 

    // Validação
    if (!file || typeof file !== "string") {
      return NextResponse.json(
        { error: "O campo 'file' (string base64) é obrigatório." },
        { status: 400 }
      );
    }

    // 2. Converter Base64 do campo 'file' para Buffer
    const dataBuffer = Buffer.from(file, 'base64');
    const dataUint8 = new Uint8Array(dataBuffer);

    console.log(`Recebido payload no campo 'file'. Tamanho decodificado: ${dataUint8.length} bytes`);

    const synapse = await getSynapseClient();

    // 3. Pagamento
    const depositAmount = ethers.parseUnits("0.1", 18);
    const tx = await synapse.payments.depositWithPermitAndApproveOperator(
      depositAmount,
      synapse.getWarmStorageAddress(),
      ethers.MaxUint256,
      ethers.MaxUint256,
      TIME_CONSTANTS.EPOCHS_PER_MONTH
    );
    await tx.wait();

    // 4. Upload
    const { pieceCid, size } = await synapse.storage.upload(dataUint8);

    return NextResponse.json({
      success: true,
      pieceCid: pieceCid.toString(),
      size: size,
      message: "Upload concluído com sucesso via campo 'file'."
    }, { status: 201 });

  } catch (error: any) {
    console.error("API Upload Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno." },
      { status: 500 }
    );
  }
}