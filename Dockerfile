# --- Estágio 1: Dependências (Deps) ---
# Instala apenas as dependências necessárias para o build
FROM node:20-alpine AS deps
# libc6-compat é necessário para algumas bibliotecas nativas (como as do SDK/Filecoin)
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copia arquivos de definição de pacote
COPY package.json package-lock.json* ./

# Instala dependências (ci é mais rápido e seguro para CI/CD/Docker)
RUN npm install

# --- Estágio 2: Builder ---
# Constrói o código Next.js
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilita telemetria para velocidade e privacidade
ENV NEXT_TELEMETRY_DISABLED=1

# Executa o build (gera a pasta .next/standalone)
RUN npm run build

# --- Estágio 3: Runner (Produção) ---
# A imagem final que vai rodar de verdade
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Cria usuário não-root por segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia apenas os arquivos necessários do estágio 'builder'
COPY --from=builder /app/public ./public

# Configura permissões para o cache do Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copia o output otimizado 'standalone' do Next.js
# Nota: Você precisa ter 'output: "standalone"' no next.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Define usuário
USER nextjs

# Expõe porta padrão
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando de inicialização
CMD ["node", "server.js"]