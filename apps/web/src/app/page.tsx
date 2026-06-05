import Link from 'next/link';
import { Trophy, Users, Target, ChevronRight, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-brand-dark/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-7 w-7 text-brand-gold" />
            <span className="text-xl font-bold">Copa Will</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="text-sm bg-brand-green hover:bg-brand-green/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 via-transparent to-brand-gold/10 pointer-events-none" />
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-green/20 text-brand-green border border-brand-green/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Star className="h-3.5 w-3.5" />
            Temporada 2026 aberta
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            O bolão que
            <br />
            <span className="text-brand-gold">une amigos</span>
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Faça seus palpites, dispute o ranking e viva a emoção dos campeonatos junto com quem
            você gosta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              Participar Agora
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors"
            >
              Como funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Users className="h-8 w-8" />,
                title: 'Crie sua conta',
                desc: 'Cadastre-se gratuitamente e entre no campeonato que seu grupo está participando.',
              },
              {
                step: '02',
                icon: <Target className="h-8 w-8" />,
                title: 'Faça seus palpites',
                desc: 'Antes de cada partida, informe o placar que você acredita que vai acontecer.',
              },
              {
                step: '03',
                icon: <Trophy className="h-8 w-8" />,
                title: 'Dispute o ranking',
                desc: 'Acumule pontos com seus acertos e suba no ranking para ganhar a Copa Will!',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-brand-green/50 transition-colors"
              >
                <div className="text-6xl font-black text-white/5 absolute top-4 right-4">
                  {item.step}
                </div>
                <div className="text-brand-green mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-brand-green/20 to-brand-gold/10 border border-white/10 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Pronto para jogar?</h2>
            <p className="text-white/60 mb-8 text-lg">
              Junte-se a centenas de amigos que já estão no bolão.
            </p>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              Criar conta grátis
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-brand-gold" />
            <span>Copa Will © 2026</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70 transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Termos
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
