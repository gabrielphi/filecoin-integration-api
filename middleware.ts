// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define quais rotas serão protegidas
export const config = {
  matcher: '/api/:path*',
};

export function middleware(request: NextRequest) {
  // 1. Recupera a chave esperada das variáveis de ambiente
  const serverApiKey = process.env.API_KEY;

  // Segurança: Se a chave não estiver configurada no servidor, bloqueia tudo
  if (!serverApiKey) {
    return NextResponse.json(
      { error: "Erro de configuração do servidor: API_KEY não definida." },
      { status: 500 }
    );
  }

  // 2. Recupera o header enviado pelo cliente
  // O método .get() é case-insensitive (funciona com x-api-key ou X-API-KEY)
  const requestApiKey = request.headers.get('x-api-key');

  // 3. Validação
  if (requestApiKey !== serverApiKey) {
    return NextResponse.json(
      { error: "Acesso Negado: X-API-KEY inválida ou ausente." },
      { status: 401 }
    );
  }

  // 4. Se passou, permite continuar para a rota (upload/download)
  return NextResponse.next();
}