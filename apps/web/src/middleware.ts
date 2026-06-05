import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/cadastro', '/recuperar-senha', '/redefinir-senha'];
const AUTH_PATHS = ['/dashboard', '/campeonatos', '/palpites', '/perfil', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica se o path começa com alguma rota protegida
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuthPath) {
    // Verifica a presença do cookie de auth (Next.js não acessa localStorage no middleware)
    // A validação real é feita no client-side com o store Zustand
    // Aqui apenas garantimos o redirecionamento server-side se não houver cookie de sessão
    const hasSession = request.cookies.get('copa-will-auth');
    if (!hasSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
