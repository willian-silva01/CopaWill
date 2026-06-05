'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, LogOut, User, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api/client';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
    } catch {}
    logout();
    router.push('/login');
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Trophy className="h-6 w-6 text-brand-gold" />
          Copa Will
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/campeonatos" className="hover:text-foreground transition-colors">
            Campeonatos
          </Link>
          <Link href="/ranking" className="hover:text-foreground transition-colors">
            Ranking
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user && (
            <div className="flex items-center gap-2">
              <Link
                href="/perfil"
                className="flex items-center gap-2 text-sm font-medium hover:text-foreground transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-brand-green/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-brand-green" />
                </div>
                <span className="hidden md:block">{user.name?.split(' ')[0]}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
