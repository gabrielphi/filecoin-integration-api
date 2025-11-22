// app/api/download/route.ts
import { NextResponse } from "next/server";
import { getSynapseClient } from "@/app/lib/synapse";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cid } = body;

    if (!cid) {
      return NextResponse.json(
        { error: "O campo 'cid' é obrigatório." },
        { status: 400 }
      );
    }

    const synapse = await getSynapseClient();
    
    // 1. Baixa os bytes do Filecoin (Uint8Array)
    const fileBytes = await synapse.storage.download(cid);

    // 2. Converte para Buffer e depois para String Base64
    // Isso permite transportar o binário dentro do JSON com segurança
    const base64String = Buffer.from(fileBytes).toString('base64');

    // 3. Retorna o JSON conforme solicitado
    return NextResponse.json({
      success: true,
      cid: cid,
      size: fileBytes.length,
      download: base64String // <--- O binário codificado está aqui
    }, { status: 200 });

  } catch (error: any) {
    console.error("API Download Error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao recuperar arquivo.", details: error.message },
      { status: 500 }
    );
  }
}