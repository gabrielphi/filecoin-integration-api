import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Adicione esta configuração para evitar que o Next.js tente fazer bundle dessas libs
  serverExternalPackages: [
    "@filoz/synapse-sdk", 
    "@sentry/node", 
    "@sentry/core", 
    "ethers"
  ],
  /* Suas outras configs (como output: 'standalone') */
  output: "standalone",
};

export default nextConfig;