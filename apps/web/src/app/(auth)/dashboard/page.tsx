'use client';

import { Trophy, Target, TrendingUp, Calendar } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-bold">
          Olá, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Veja como estão seus palpites hoje.</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Posição no Ranking',
            value: '—',
            icon: <Trophy className="h-5 w-5 text-brand-gold" />,
            color: 'text-brand-gold',
          },
          {
            label: 'Pontos Totais',
            value: '0',
            icon: <TrendingUp className="h-5 w-5 text-brand-green" />,
            color: 'text-brand-green',
          },
          {
            label: 'Palpites Pendentes',
            value: '0',
            icon: <Target className="h-5 w-5 text-blue-400" />,
            color: 'text-blue-400',
          },
          {
            label: 'Taxa de Acerto',
            value: '0%',
            icon: <Calendar className="h-5 w-5 text-purple-400" />,
            color: 'text-purple-400',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-card border border-border rounded-xl p-5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">{card.label}</span>
              {card.icon}
            </div>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Próximas partidas placeholder */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Próximas Partidas</h2>
        <div className="text-center py-8 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Nenhuma partida agendada ainda.</p>
          <p className="text-sm mt-1">Entre em um campeonato para começar!</p>
        </div>
      </div>
    </div>
  );
}
