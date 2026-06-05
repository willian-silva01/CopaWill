import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-white p-4">
      <Trophy className="h-16 w-16 text-brand-gold mb-6 opacity-50" />
      <h1 className="text-6xl font-black mb-4">404</h1>
      <p className="text-xl text-white/60 mb-8">Essa página não foi encontrada.</p>
      <Link
        href="/"
        className="bg-brand-green hover:bg-brand-green/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
