// app/lib/synapse.ts
import { Synapse, RPC_URLS } from "@filoz/synapse-sdk";

export async function getSynapseClient() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("FATAL: PRIVATE_KEY não definida no ambiente.");
  }

  // Inicializa o SDK conectado à Calibration (Testnet)
  return await Synapse.create({
    privateKey: privateKey,
    rpcURL: RPC_URLS.calibration.http,
  });
}