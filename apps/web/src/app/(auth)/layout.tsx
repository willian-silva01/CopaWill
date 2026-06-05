import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';

// Middleware handles actual auth check; this layout is for structure.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
