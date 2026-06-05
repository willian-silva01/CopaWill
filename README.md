# Copa Will — Documento de Especificação Técnica

> **Versão:** 1.0.0
> **Data:** Junho 2026
> **Status:** Em Planejamento
> **Autor:** Willian

---

## Sumário

1. [Visão do Produto](#1-visão-do-produto)
2. [Perfis de Usuário e Permissões](#2-perfis-de-usuário-e-permissões)
3. [Funcionalidades do Sistema](#3-funcionalidades-do-sistema)
4. [Regras de Negócio](#4-regras-de-negócio)
5. [Arquitetura do Sistema](#5-arquitetura-do-sistema)
6. [Stack Tecnológica](#6-stack-tecnológica)
7. [Modelagem de Dados](#7-modelagem-de-dados)
8. [Histórias de Usuário](#8-histórias-de-usuário)
9. [Telas e Fluxos de Navegação](#9-telas-e-fluxos-de-navegação)
10. [Estrutura de Pastas](#10-estrutura-de-pastas)
11. [Padrões de Código](#11-padrões-de-código)
12. [Estratégia de Testes](#12-estratégia-de-testes)
13. [Estratégia de Deploy](#13-estratégia-de-deploy)
14. [Roadmap de Desenvolvimento](#14-roadmap-de-desenvolvimento)
15. [Requisitos Não Funcionais](#15-requisitos-não-funcionais)
16. [Glossário](#16-glossário)

---

## 1. Visão do Produto

### 1.1 Descrição Geral

**Copa Will** é uma plataforma web de bolão esportivo online com foco inicial em torneios de futebol. O sistema permite que grupos de amigos e comunidades realizem palpites sobre partidas, compitam entre si através de rankings dinâmicos e vivenciem a emoção dos campeonatos de forma interativa e social.

O projeto tem caráter recreativo e social, com identidade visual inspirada nas principais plataformas esportivas do mercado (FIFA, ESPN, SofaScore, OneFootball), priorizando uma experiência moderna, intuitiva e emocionalmente envolvente.

### 1.2 Problema que Resolve

- Grupos de amigos que fazem bolões manualmente em planilhas ou no WhatsApp
- Falta de uma plataforma centralizada, bonita e fácil de usar para bolões informais
- Ausência de rankings automáticos e transparentes
- Dificuldade em acompanhar resultados e posições em tempo real

### 1.3 Proposta de Valor

| Para | O problema é | Copa Will oferece |
|------|-------------|------------------|
| Grupos de amigos | Bolões desorganizados em planilhas | Plataforma centralizada e automatizada |
| Fãs de futebol | Falta de engajamento durante campeonatos | Rankings, palpites e estatísticas em tempo real |
| Organizadores | Gestão manual de resultados e pontos | Painel admin completo com recalculo automático |

### 1.4 Objetivos de Negócio

- Criar uma experiência de bolão digital de alta qualidade para uso entre amigos
- Suportar múltiplos campeonatos simultâneos
- Permitir compartilhamento social da posição no ranking
- Ser escalável para acomodar campanhas virais e picos de acesso

### 1.5 Métricas de Sucesso

- Número de usuários cadastrados por campeonato
- Taxa de palpites realizados por usuário ativo
- Tempo médio de sessão na plataforma
- Compartilhamentos nas redes sociais
- Taxa de retorno (DAU/MAU)

---

## 2. Perfis de Usuário e Permissões

### 2.1 Administrador

Usuário com acesso total ao sistema. Responsável pela configuração e operação do bolão.

| Módulo | Permissão |
|--------|-----------|
| Campeonatos | Criar, editar, arquivar, excluir |
| Fases | Criar, editar, reordenar, excluir |
| Partidas | Criar, editar, inserir resultado, excluir |
| Equipes | Criar, editar, upload de escudo/bandeira, excluir |
| Palpites | Abrir e fechar período de palpites por partida/rodada |
| Resultados | Corrigir resultados após publicação |
| Pontuação | Recalcular pontuações manualmente |
| Usuários | Listar, bloquear, promover a admin, resetar senha |
| Rankings | Visualizar, recalcular, exportar |
| Configurações | Definir regras de pontuação por campeonato |

### 2.2 Usuário Comum

Usuário registrado com acesso às funcionalidades do bolão.

| Módulo | Permissão |
|--------|-----------|
| Conta | Cadastrar, fazer login, recuperar senha, editar perfil |
| Campeonatos | Visualizar campeonatos disponíveis |
| Partidas | Visualizar partidas, resultados e status |
| Palpites | Realizar e editar palpites (dentro do prazo) |
| Ranking | Consultar ranking geral, por rodada, por fase |
| Estatísticas | Visualizar histórico de palpites e desempenho pessoal |
| Social | Compartilhar posição no ranking nas redes sociais |

### 2.3 Visitante (Não Autenticado)

| Módulo | Permissão |
|--------|-----------|
| Landing Page | Visualizar apresentação, ranking público e próximos jogos |
| Cadastro | Criar nova conta |
| Login | Autenticar-se |

---

## 3. Funcionalidades do Sistema

### 3.1 Autenticação e Conta

#### 3.1.1 Cadastro
- Formulário com: nome completo, username, e-mail, senha, confirmação de senha
- Validação de unicidade de e-mail e username
- Envio de e-mail de confirmação de conta
- Conta inativa até confirmação por e-mail

#### 3.1.2 Login
- Autenticação via e-mail + senha
- Geração de Access Token (JWT, 15 min) e Refresh Token (30 dias)
- Persistência segura via cookie httpOnly
- Proteção contra brute force (rate limiting)

#### 3.1.3 Recuperação de Senha
- Solicitação via e-mail cadastrado
- Link de redefinição com expiração de 1 hora
- Token de uso único (invalidado após uso)

#### 3.1.4 Perfil do Usuário
- Edição de nome, username, avatar
- Upload de foto de perfil (armazenado no S3)
- Histórico de palpites
- Estatísticas pessoais (% de acerto, pontos por campeonato)

### 3.2 Campeonatos

- Cada campeonato possui: nome, descrição, logo, país/região, temporada, status
- Status possíveis: `RASCUNHO`, `ABERTO`, `EM_ANDAMENTO`, `ENCERRADO`, `ARQUIVADO`
- Um usuário pode participar de múltiplos campeonatos
- Cada campeonato pode ter configurações de pontuação independentes

#### Campeonatos Suportados (exemplos iniciais)
- Copa do Mundo FIFA
- Copa Libertadores
- UEFA Champions League
- Brasileirão Série A
- Copa Will (campeonato personalizado)

### 3.3 Estrutura de Fases

#### 3.3.1 Fase de Grupos
- Grupos identificados por letras (A, B, C, ...)
- Cada grupo contém N times
- Partidas organizadas em rodadas
- Tabela de classificação por grupo (pts, J, V, E, D, GP, GC, SG)

#### 3.3.2 Fase de Mata-Mata
- Oitavas de final
- Quartas de final
- Semifinal
- Disputa de terceiro lugar
- Final
- Chaveamento visual estilo "bracket"
- Suporte a prorrogação e pênaltis (informativo)

### 3.4 Partidas

Cada partida contém:
- Campeonato e fase
- Time mandante e visitante
- Data e horário (com fuso horário)
- Status: `AGENDADA`, `AO_VIVO`, `ENCERRADA`, `ADIADA`, `CANCELADA`
- Resultado: placar mandante / placar visitante
- Período de palpites: aberto/fechado
- Rodada (para fase de grupos)

### 3.5 Palpites

- O usuário informa o placar que espera para cada partida (mandante X visitante)
- O palpite só pode ser feito/editado enquanto o período de palpites estiver aberto
- Após o fechamento, o palpite fica bloqueado
- Após o resultado ser inserido, a pontuação é calculada automaticamente
- Um usuário faz exatamente um palpite por partida

### 3.6 Sistema de Pontuação

O sistema de pontuação é configurável por campeonato. A configuração padrão é:

| Situação | Pontos |
|----------|--------|
| Placar exato | +5 |
| Acertou o vencedor (mas não o placar exato) | +3 |
| Acertou o empate (mas não o placar exato) | +3 |
| Errou o resultado | +0 |

#### Regras de Cálculo
1. Verificar se o placar do palpite é idêntico ao resultado final → +5 pts
2. Se não for exato, verificar se ambos concordam em vencedor (ou ambos indicam empate) → +3 pts
3. Caso contrário → +0 pts

#### Recálculo
- O admin pode disparar o recálculo de pontuações de uma partida/rodada/fase a qualquer momento
- Útil para correção de resultados inseridos incorretamente

### 3.7 Ranking

#### 3.7.1 Ranking Geral do Campeonato
- Posição, avatar, nome, pontuação total, variação de posição
- Atualizado após cada partida encerrada

#### 3.7.2 Ranking por Rodada
- Posição, nome, pontos obtidos naquela rodada específica
- Permite ver quem foi melhor em cada rodada

#### 3.7.3 Ranking por Fase
- Posição, nome, pontos obtidos em toda a fase (grupos, oitavas, etc.)

#### 3.7.4 Ranking ao Vivo (futuro)
- Atualização em tempo real via WebSocket durante partidas

---

## 4. Regras de Negócio

### 4.1 Regras de Palpite

| ID | Regra |
|----|-------|
| RN-001 | Um usuário só pode realizar um palpite por partida |
| RN-002 | Palpites só podem ser feitos/editados com o período aberto |
| RN-003 | O período de palpites fecha automaticamente quando a partida inicia (ou manualmente pelo admin) |
| RN-004 | Palpites não podem ser excluídos, apenas editados dentro do prazo |
| RN-005 | Usuário deve estar em um campeonato para poder palpitar em suas partidas |

### 4.2 Regras de Pontuação

| ID | Regra |
|----|-------|
| RN-006 | A pontuação só é calculada após o admin inserir o resultado final da partida |
| RN-007 | Se o resultado for corrigido, a pontuação é recalculada automaticamente |
| RN-008 | Partidas adiadas ou canceladas não geram pontuação |
| RN-009 | Usuário que não palpitou recebe 0 pontos para aquela partida |
| RN-010 | A configuração de pontuação é definida por campeonato e não pode ser alterada retroativamente sem recálculo |

### 4.3 Regras de Campeonato

| ID | Regra |
|----|-------|
| RN-011 | Um campeonato deve estar com status `ABERTO` para receber inscrições |
| RN-012 | Um campeonato encerrado pode ser visualizado, mas não aceita novos palpites |
| RN-013 | Partidas só podem ser criadas em campeonatos com status `RASCUNHO` ou `EM_ANDAMENTO` |

### 4.4 Regras de Usuário

| ID | Regra |
|----|-------|
| RN-014 | O e-mail deve ser confirmado para que o usuário possa palpitar |
| RN-015 | Username deve ser único e alfanumérico (sem espaços) |
| RN-016 | Um usuário bloqueado não pode fazer login |
| RN-017 | Somente admins podem promover outros usuários a admin |

---

## 5. Arquitetura do Sistema

### 5.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
│                    Next.js + React + TypeScript                  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS / REST / WebSocket
┌──────────────────────────────▼──────────────────────────────────┐
│                          API GATEWAY                             │
│                     (Nginx Reverse Proxy)                        │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                       BACKEND (NestJS)                           │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │   Auth   │  │  Users   │  │  Champs  │  │   Rankings    │  │
│  │ Module   │  │  Module  │  │  Module  │  │    Module     │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Matches  │  │ Guesses  │  │  Scores  │  │  Notification │  │
│  │  Module  │  │  Module  │  │  Module  │  │    Module     │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘  │
└───────────┬──────────────────────────┬──────────────────────────┘
            │                          │
┌───────────▼──────────┐  ┌────────────▼────────────┐
│     PostgreSQL        │  │         Redis            │
│  (Banco Principal)    │  │  (Cache + Sessions +     │
│                       │  │   Rate Limiting)         │
└───────────────────────┘  └─────────────────────────┘
            │
┌───────────▼──────────┐
│    AWS S3 / R2        │
│  (Imagens, Escudos,   │
│   Fotos de Perfil)    │
└───────────────────────┘
```

### 5.2 Padrão Arquitetural

**Frontend:** Next.js com App Router (Server Components + Client Components)
- SSR para Landing Page e páginas públicas (SEO)
- CSR para Dashboard e páginas autenticadas
- Server Actions para mutações simples

**Backend:** NestJS com arquitetura modular em camadas
- Controllers → Services → Repositories → Database
- Princípios SOLID
- Injeção de dependência nativa do NestJS

**Banco de Dados:** PostgreSQL com Prisma ORM
- Migrations versionadas
- Seeds para dados iniciais
- Soft delete para entidades principais

### 5.3 Comunicação

| Protocolo | Uso |
|-----------|-----|
| REST/HTTP | Operações CRUD padrão |
| WebSocket (Socket.IO) | Rankings em tempo real, notificações ao vivo |
| Server-Sent Events | Atualizações de placar em tempo real (alternativa leve ao WS) |

### 5.4 Segurança

- HTTPS obrigatório em produção (Let's Encrypt)
- JWT com rotação de Refresh Token
- Access Token armazenado em memória (não em localStorage)
- Refresh Token em cookie httpOnly + Secure + SameSite=Strict
- Rate limiting por IP e por usuário (Redis)
- Helmet.js para headers HTTP de segurança
- CORS configurado por domínio
- Validação de inputs com class-validator (NestJS)
- Sanitização de dados em todas as entradas
- Proteção CSRF em formulários

---

## 6. Stack Tecnológica

### 6.1 Frontend

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Next.js** | 14+ | Framework React com SSR/SSG nativo, App Router, excelente SEO, performance e DX. Ideal para páginas públicas (Landing, Ranking) com SSR e páginas privadas com CSR. |
| **React** | 18+ | Biblioteca UI padrão de mercado, ecossistema maduro. |
| **TypeScript** | 5+ | Tipagem estática que reduz bugs em runtime, melhora DX e documentação viva do código. |
| **Tailwind CSS** | 3+ | Estilização utility-first, consistência de design system, bundle pequeno, facilita responsividade. |
| **Shadcn/UI** | Latest | Componentes acessíveis baseados em Radix UI, totalmente customizáveis, sem lock-in de dependência. |
| **Zustand** | Latest | Gerenciamento de estado global leve, simples e performático. Alternativa enxuta ao Redux. |
| **React Query (TanStack)** | Latest | Cache de dados server-side, refetch automático, loading/error states, sincronização de dados. |
| **React Hook Form** | Latest | Formulários performáticos com validação via Zod. |
| **Zod** | Latest | Validação de schemas no frontend (compartilhável com backend). |
| **Framer Motion** | Latest | Animações suaves e profissionais para transições e micro-interações. |
| **Recharts** | Latest | Gráficos para estatísticas e desempenho do usuário. |

### 6.2 Backend

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **NestJS** | 10+ | Framework Node.js empresarial com arquitetura modular, DI nativa, decorators, suporte nativo a TypeScript. Excelente para projetos que precisam escalar com organização. |
| **Prisma** | 5+ | ORM moderno com geração de tipos TypeScript automática, migrations simples, excelente DX e suporte nativo ao PostgreSQL. |
| **Passport.js** | Latest | Integração de estratégias de autenticação (JWT, Local) de forma padronizada no NestJS. |
| **class-validator** | Latest | Validação declarativa de DTOs com decorators. |
| **class-transformer** | Latest | Serialização/deserialização de objetos. |
| **Nodemailer** | Latest | Envio de e-mails transacionais (confirmação, recuperação de senha). |
| **Bull/BullMQ** | Latest | Filas de processamento assíncrono (e-mails, recálculo de pontuações, notificações). |
| **Socket.IO** | Latest | Rankings em tempo real e notificações ao vivo. |
| **Swagger (OpenAPI)** | Latest | Documentação automática da API. |

### 6.3 Banco de Dados e Cache

| Tecnologia | Uso | Justificativa |
|------------|-----|---------------|
| **PostgreSQL 15+** | Banco principal | Banco relacional robusto, ACID, suporte a JSONB para configurações flexíveis, excelente performance com índices. |
| **Redis 7+** | Cache, sessões, filas, rate limiting | In-memory store ultrarrápido. Usado para cache de rankings, rate limiting, sessões de refresh token, filas Bull. |

### 6.4 Storage

| Tecnologia | Uso | Justificativa |
|------------|-----|---------------|
| **AWS S3** (ou Cloudflare R2) | Upload de imagens (escudos, bandeiras, avatares) | Storage escalável, CDN nativo, custo por uso. R2 como alternativa sem custo de egresso. |

### 6.5 Infraestrutura e Deploy

| Tecnologia | Uso | Justificativa |
|------------|-----|---------------|
| **Docker + Docker Compose** | Containerização | Ambiente reproduzível, facilita dev local e deploy. |
| **GitHub Actions** | CI/CD | Automação de testes, build e deploy diretamente do repositório. |
| **VPS (Hetzner/DigitalOcean)** | Servidor de produção | Custo controlado, controle total, ideal para MVPs e projetos em crescimento. |
| **Nginx** | Reverse proxy, SSL, static files | Performance, SSL termination, load balancing. |
| **Certbot (Let's Encrypt)** | Certificado SSL gratuito | HTTPS automático e renovação automática. |

### 6.6 Monitoramento

| Tecnologia | Uso |
|------------|-----|
| **Prometheus** | Coleta de métricas da aplicação (requests, latência, erros) |
| **Grafana** | Dashboards visuais de monitoramento |
| **Loki** | Agregação de logs |
| **Sentry** | Rastreamento de erros em produção (frontend e backend) |

---

## 7. Modelagem de Dados

### 7.1 Diagrama Entidade-Relacionamento (Simplificado)

```
users
  id, name, username, email, password_hash, avatar_url,
  role, is_active, email_verified_at, created_at, updated_at

  1──N  guesses
  1──N  user_championships (N──N com championships)

championships
  id, name, description, logo_url, country, season,
  status, scoring_config (JSONB), created_at, updated_at

  1──N  phases
  1──N  teams_championships (N──N com teams)
  1──N  user_championships

phases
  id, championship_id, name, type (GROUP|KNOCKOUT),
  order, created_at

  1──N  rounds (opcional, para fase de grupos)
  1──N  matches

rounds
  id, phase_id, name, number, created_at

teams
  id, name, short_name, country, logo_url, created_at

  N──N  championships (via teams_championships)
  N──N  phases/groups (via group_teams)

groups (fase de grupos)
  id, phase_id, name (A, B, C...), created_at

  N──N  teams (via group_teams)
  1──N  matches

matches
  id, championship_id, phase_id, round_id, group_id,
  home_team_id, away_team_id,
  home_score, away_score,
  match_date, status, guess_open,
  created_at, updated_at

  1──N  guesses

guesses
  id, user_id, match_id,
  home_score_guess, away_score_guess,
  points, created_at, updated_at

rankings (view materializada ou tabela atualizada)
  id, user_id, championship_id, phase_id, round_id,
  total_points, position, created_at, updated_at

password_reset_tokens
  id, user_id, token_hash, expires_at, used_at, created_at

email_verification_tokens
  id, user_id, token_hash, expires_at, used_at, created_at

refresh_tokens
  id, user_id, token_hash, expires_at, revoked_at, created_at
```

### 7.2 Entidades Detalhadas

#### users
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  username      VARCHAR(30) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url    VARCHAR(500),
  role          VARCHAR(20) NOT NULL DEFAULT 'USER', -- USER | ADMIN
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### championships
```sql
CREATE TABLE championships (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(100) NOT NULL,
  description     TEXT,
  logo_url        VARCHAR(500),
  country         VARCHAR(100),
  season          VARCHAR(10), -- ex: "2026"
  status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  -- DRAFT | OPEN | IN_PROGRESS | FINISHED | ARCHIVED
  scoring_config  JSONB NOT NULL DEFAULT '{
    "exact_score": 5,
    "correct_winner": 3,
    "correct_draw": 3,
    "wrong": 0
  }',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### user_championships (participação)
```sql
CREATE TABLE user_championships (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  championship_id   UUID NOT NULL REFERENCES championships(id),
  joined_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, championship_id)
);
```

#### teams
```sql
CREATE TABLE teams (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  short_name  VARCHAR(10),
  country     VARCHAR(100),
  logo_url    VARCHAR(500),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### phases
```sql
CREATE TABLE phases (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  championship_id   UUID NOT NULL REFERENCES championships(id),
  name              VARCHAR(100) NOT NULL,
  type              VARCHAR(20) NOT NULL,
  -- GROUP_STAGE | ROUND_OF_16 | QUARTER_FINAL | SEMI_FINAL | THIRD_PLACE | FINAL
  phase_order       INTEGER NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### groups (fase de grupos)
```sql
CREATE TABLE groups (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id  UUID NOT NULL REFERENCES phases(id),
  name      VARCHAR(10) NOT NULL, -- A, B, C...
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE group_teams (
  group_id  UUID NOT NULL REFERENCES groups(id),
  team_id   UUID NOT NULL REFERENCES teams(id),
  PRIMARY KEY (group_id, team_id)
);
```

#### rounds
```sql
CREATE TABLE rounds (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id  UUID NOT NULL REFERENCES phases(id),
  name      VARCHAR(50) NOT NULL,
  number    INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### matches
```sql
CREATE TABLE matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  championship_id UUID NOT NULL REFERENCES championships(id),
  phase_id        UUID NOT NULL REFERENCES phases(id),
  round_id        UUID REFERENCES rounds(id),
  group_id        UUID REFERENCES groups(id),
  home_team_id    UUID NOT NULL REFERENCES teams(id),
  away_team_id    UUID NOT NULL REFERENCES teams(id),
  home_score      INTEGER,
  away_score      INTEGER,
  match_date      TIMESTAMPTZ NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
  -- SCHEDULED | LIVE | FINISHED | POSTPONED | CANCELLED
  guess_open      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (home_team_id <> away_team_id)
);
```

#### guesses
```sql
CREATE TABLE guesses (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id),
  match_id            UUID NOT NULL REFERENCES matches(id),
  home_score_guess    INTEGER NOT NULL CHECK (home_score_guess >= 0),
  away_score_guess    INTEGER NOT NULL CHECK (away_score_guess >= 0),
  points              INTEGER,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, match_id)
);
```

#### rankings (tabela desnormalizada para performance)
```sql
CREATE TABLE rankings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  championship_id   UUID NOT NULL REFERENCES championships(id),
  phase_id          UUID REFERENCES phases(id),
  round_id          UUID REFERENCES rounds(id),
  total_points      INTEGER NOT NULL DEFAULT 0,
  position          INTEGER,
  exact_scores      INTEGER NOT NULL DEFAULT 0,
  correct_winners   INTEGER NOT NULL DEFAULT 0,
  wrong_guesses     INTEGER NOT NULL DEFAULT 0,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, championship_id, phase_id, round_id)
);
```

#### Tokens de Segurança
```sql
CREATE TABLE password_reset_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  token_hash  VARCHAR(255) NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  token_hash  VARCHAR(255) NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 7.3 Índices Importantes

```sql
-- Performance em consultas de palpites por usuário e partida
CREATE INDEX idx_guesses_user_id ON guesses(user_id);
CREATE INDEX idx_guesses_match_id ON guesses(match_id);

-- Partidas por campeonato e status
CREATE INDEX idx_matches_championship_status ON matches(championship_id, status);
CREATE INDEX idx_matches_date ON matches(match_date);

-- Rankings por campeonato
CREATE INDEX idx_rankings_championship ON rankings(championship_id, total_points DESC);

-- Usuários por email/username (já cobertos pelo UNIQUE, mas documentado)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

---

## 8. Histórias de Usuário

### 8.1 Autenticação

| ID | História | Critérios de Aceite |
|----|----------|---------------------|
| US-001 | Como **visitante**, quero **me cadastrar na plataforma** para **participar de bolões** | - Formulário com nome, username, email, senha <br> - Validação de campos obrigatórios <br> - E-mail de confirmação enviado <br> - Feedback visual de sucesso/erro |
| US-002 | Como **usuário cadastrado**, quero **fazer login** para **acessar minha conta** | - Login com email + senha <br> - Token JWT gerado <br> - Redirecionamento para dashboard <br> - Mensagem de erro em credenciais inválidas |
| US-003 | Como **usuário**, quero **recuperar minha senha** para **acessar minha conta caso esqueça** | - Input de email <br> - E-mail com link enviado em até 1 min <br> - Link expira em 1h <br> - Link de uso único |
| US-004 | Como **usuário**, quero **editar meu perfil** para **personalizar minha identidade** | - Editar nome, username, foto <br> - Upload de avatar <br> - Validação de unicidade do username <br> - Feedback de sucesso |
| US-005 | Como **usuário**, quero **confirmar meu e-mail** para **poder realizar palpites** | - E-mail de confirmação enviado no cadastro <br> - Página de confirmação acessível pelo link <br> - Conta ativada após confirmação |

### 8.2 Campeonatos

| ID | História | Critérios de Aceite |
|----|----------|---------------------|
| US-006 | Como **usuário**, quero **ver os campeonatos disponíveis** para **escolher em qual participar** | - Lista de campeonatos com logo, nome, status <br> - Filtro por status <br> - Link para detalhes do campeonato |
| US-007 | Como **usuário**, quero **entrar em um campeonato** para **poder realizar palpites** | - Botão de entrada em campeonatos abertos <br> - Confirmação de participação <br> - Acesso imediato às partidas |
| US-008 | Como **admin**, quero **criar um campeonato** para **organizar o bolão** | - Formulário com nome, logo, temporada <br> - Upload de logo <br> - Definição de regras de pontuação <br> - Campeonato criado com status RASCUNHO |
| US-009 | Como **admin**, quero **gerenciar fases do campeonato** para **estruturar a competição** | - Criar fase de grupos com N grupos <br> - Criar fase de mata-mata <br> - Definir ordem das fases <br> - Adicionar times aos grupos |

### 8.3 Palpites

| ID | História | Critérios de Aceite |
|----|----------|---------------------|
| US-010 | Como **usuário participante**, quero **ver as partidas disponíveis para palpitar** para **não perder nenhum jogo** | - Lista de partidas por fase/rodada <br> - Destaque em partidas com prazo próximo <br> - Indicação visual de jogos com palpite feito |
| US-011 | Como **usuário participante**, quero **fazer meu palpite para uma partida** para **concorrer a pontos** | - Input de placar mandante e visitante <br> - Validação de números não negativos <br> - Confirmação antes de salvar <br> - Palpite bloqueado após fechamento |
| US-012 | Como **usuário participante**, quero **editar meu palpite antes do fechamento** para **corrigir minha previsão** | - Botão de edição visível enquanto aberto <br> - Formulário pré-preenchido com palpite atual <br> - Confirmação da edição |
| US-013 | Como **usuário participante**, quero **ver o resultado dos meus palpites** para **saber quantos pontos ganhei** | - Comparação visual entre meu palpite e resultado real <br> - Pontuação obtida exibida claramente <br> - Cor verde (acerto), vermelho (erro), laranja (vencedor) |
| US-014 | Como **admin**, quero **abrir o período de palpites de uma rodada** para **permitir que usuários palpitem** | - Toggle de abrir/fechar por partida ou por rodada <br> - Confirmação da ação <br> - Notificação visual do status |
| US-015 | Como **admin**, quero **inserir o resultado de uma partida** para **que as pontuações sejam calculadas** | - Input de placar final <br> - Confirmação antes de salvar <br> - Cálculo automático de pontuações <br> - Ranking atualizado |

### 8.4 Ranking

| ID | História | Critérios de Aceite |
|----|----------|---------------------|
| US-016 | Como **usuário**, quero **ver o ranking geral do campeonato** para **saber minha posição** | - Tabela com posição, avatar, nome, pontos <br> - Minha posição destacada <br> - Paginação ou scroll infinito |
| US-017 | Como **usuário**, quero **ver o ranking da rodada atual** para **saber quem se deu melhor** | - Filtro por rodada <br> - Pontos da rodada selecionada <br> - Diferencial em relação ao ranking geral |
| US-018 | Como **usuário**, quero **compartilhar minha posição no ranking** para **mostrar aos amigos** | - Botão de compartilhar <br> - Imagem gerada com posição, nome e pontos <br> - Links para Twitter, WhatsApp, Instagram |
| US-019 | Como **admin**, quero **recalcular o ranking** para **corrigir erros de pontuação** | - Botão de recálculo por partida/fase/campeonato <br> - Log de recálculo <br> - Confirmação antes de executar |

### 8.5 Administração

| ID | História | Critérios de Aceite |
|----|----------|---------------------|
| US-020 | Como **admin**, quero **gerenciar times** para **ter um cadastro completo de equipes** | - CRUD de times com nome, país, escudo <br> - Upload de escudo/bandeira <br> - Busca por nome |
| US-021 | Como **admin**, quero **gerenciar usuários** para **moderar a plataforma** | - Listagem de usuários <br> - Bloquear/desbloquear conta <br> - Visualizar estatísticas do usuário |
| US-022 | Como **admin**, quero **configurar as regras de pontuação** para **personalizar o bolão** | - Formulário de pontos por resultado <br> - Preview do impacto da mudança <br> - Alerta sobre recálculo necessário |

---

## 9. Telas e Fluxos de Navegação

### 9.1 Mapa de Telas

```
/ (Landing Page)
├── /login
├── /cadastro
├── /recuperar-senha
│   └── /redefinir-senha/[token]
├── /confirmar-email/[token]
│
├── /dashboard (autenticado)
│   ├── /campeonatos
│   │   ├── /campeonatos/[id]
│   │   │   ├── /campeonatos/[id]/partidas
│   │   │   ├── /campeonatos/[id]/ranking
│   │   │   └── /campeonatos/[id]/estatisticas
│   ├── /palpites
│   └── /perfil
│
└── /admin (autenticado + role ADMIN)
    ├── /admin/campeonatos
    │   ├── /admin/campeonatos/novo
    │   └── /admin/campeonatos/[id]/editar
    ├── /admin/times
    ├── /admin/partidas
    ├── /admin/usuarios
    └── /admin/configuracoes
```

### 9.2 Layout Base

**Header:** Logo Copa Will | Nav principal | Avatar/menu do usuário | Toggle dark mode
**Sidebar (admin):** Menu de administração colapsável
**Footer:** Links legais, redes sociais

### 9.3 Landing Page (`/`)

**Seções:**
1. **Hero:** Nome do projeto, tagline, CTA "Participar Agora"
2. **Campeonatos Ativos:** Cards dos campeonatos com status e CTA
3. **Ranking ao Vivo:** Top 10 do ranking atual (público)
4. **Próximos Jogos:** Cards das próximas partidas com data/hora
5. **Como Funciona:** 3 passos: Cadastre-se → Palpite → Concorra
6. **Footer:** Links e redes sociais

### 9.4 Dashboard (`/dashboard`)

**Cards de Resumo:**
- Minha posição no ranking
- Pontos totais
- Palpites pendentes
- Taxa de acerto

**Próximas Partidas:** Lista de partidas com palpite aberto
**Últimos Resultados:** Resultado + meu palpite + pontos ganhos
**Ranking (mini):** Top 5 + minha posição

### 9.5 Tela de Partidas (`/campeonatos/[id]/partidas`)

**Filtros:** Fase | Rodada | Status
**Agrupamento:** Por fase e rodada
**Card de Partida:**
- Escudos dos times
- Data/hora
- Status (ao vivo / encerrada / agendada)
- Resultado (se encerrada)
- Input de palpite (se aberto) ou palpite feito
- Pontuação obtida (se encerrada)

### 9.6 Tela de Ranking (`/campeonatos/[id]/ranking`)

**Abas:** Geral | Por Fase | Por Rodada
**Tabela:**
- # Posição (com seta de variação)
- Avatar + Nome
- Pontos
- Exatos | Vencedores | Erros
- Minha linha destacada com cor diferente

---

## 10. Estrutura de Pastas

### 10.1 Monorepo (recomendado)

```
copa-will/
├── apps/
│   ├── web/                    # Next.js Frontend
│   └── api/                    # NestJS Backend
├── packages/
│   ├── shared/                 # DTOs, types e validações compartilhadas
│   └── ui/                     # Componentes reutilizáveis (futuro)
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── nginx/
│       └── nginx.conf
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── .env.example
├── turbo.json                  # Turborepo (gerenciador de monorepo)
└── package.json
```

### 10.2 Frontend (`apps/web/`)

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Rotas públicas (sem auth)
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── login/
│   │   │   └── cadastro/
│   │   ├── (auth)/             # Rotas autenticadas
│   │   │   ├── layout.tsx      # Layout com verificação de auth
│   │   │   ├── dashboard/
│   │   │   ├── campeonatos/
│   │   │   ├── palpites/
│   │   │   └── perfil/
│   │   ├── (admin)/            # Rotas administrativas
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # Shadcn/UI base components
│   │   ├── layout/             # Header, Footer, Sidebar
│   │   ├── championships/      # Componentes de campeonato
│   │   ├── matches/            # Componentes de partidas
│   │   ├── guesses/            # Componentes de palpites
│   │   ├── rankings/           # Componentes de ranking
│   │   └── shared/             # Componentes genéricos reutilizáveis
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── api/                # API client (Axios/fetch wrapper)
│   │   ├── auth/               # Utilitários de autenticação
│   │   └── utils/              # Helpers gerais
│   ├── stores/                 # Zustand stores
│   ├── types/                  # Types TypeScript
│   └── config/                 # Configurações da aplicação
├── public/
│   ├── images/
│   └── icons/
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 10.3 Backend (`apps/api/`)

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   └── dto/
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   └── dto/
│   │   ├── championships/
│   │   ├── teams/
│   │   ├── phases/
│   │   ├── matches/
│   │   ├── guesses/
│   │   ├── rankings/
│   │   ├── notifications/
│   │   └── storage/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/            # Exception filters
│   │   ├── interceptors/       # Logging, transform response
│   │   ├── guards/
│   │   ├── pipes/              # Validation pipe
│   │   └── types/
│   ├── config/                 # Configurações (Env, DB, etc.)
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── prisma.service.ts
│   ├── queues/                 # Bull queues (e-mail, scoring)
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 11. Padrões de Código

### 11.1 Convenções Gerais

- **Idioma:** Código em inglês (variáveis, funções, classes, comentários técnicos). UI e mensagens de usuário em português.
- **Formatação:** Prettier com configuração padrão
- **Linting:** ESLint com regras TypeScript recomendadas
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`)
- **Branches:** `main` (produção), `develop` (integração), `feature/nome`, `fix/nome`, `hotfix/nome`

### 11.2 Padrões do Backend (NestJS)

#### Estrutura de um Módulo
```typescript
// Módulo
@Module({
  imports: [PrismaModule],
  controllers: [ChampionshipsController],
  providers: [ChampionshipsService, ChampionshipsRepository],
  exports: [ChampionshipsService],
})
export class ChampionshipsModule {}

// Controller — somente roteamento e validação de entrada
@Controller('championships')
@UseGuards(JwtAuthGuard)
export class ChampionshipsController {
  constructor(private readonly service: ChampionshipsService) {}

  @Get()
  findAll(@Query() query: FindChampionshipsDto) {
    return this.service.findAll(query);
  }
}

// Service — regras de negócio
@Injectable()
export class ChampionshipsService {
  constructor(private readonly repository: ChampionshipsRepository) {}

  async findAll(query: FindChampionshipsDto) {
    return this.repository.findMany(query);
  }
}

// Repository — acesso a dados
@Injectable()
export class ChampionshipsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: FindChampionshipsDto) {
    return this.prisma.championship.findMany({ where: { status: query.status } });
  }
}
```

#### DTOs e Validação
```typescript
export class CreateGuessDto {
  @IsUUID()
  matchId: string;

  @IsInt()
  @Min(0)
  @Max(99)
  homeScoreGuess: number;

  @IsInt()
  @Min(0)
  @Max(99)
  awayScoreGuess: number;
}
```

#### Resposta Padronizada da API
```typescript
// Sucesso
{
  "data": { ... },
  "meta": { "total": 100, "page": 1, "perPage": 20 }  // paginação (opcional)
}

// Erro
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["homeScoreGuess must not be less than 0"]
}
```

### 11.3 Padrões do Frontend (Next.js)

#### Componentes
```typescript
// Componente com tipagem explícita
interface MatchCardProps {
  match: Match;
  guess?: Guess;
  onGuessSubmit: (guess: CreateGuessDto) => Promise<void>;
}

export function MatchCard({ match, guess, onGuessSubmit }: MatchCardProps) {
  // ...
}
```

#### Chamadas de API com React Query
```typescript
export function useChampionships() {
  return useQuery({
    queryKey: ['championships'],
    queryFn: () => api.get<Championship[]>('/championships'),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useCreateGuess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateGuessDto) => api.post('/guesses', dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['matches'] }),
  });
}
```

#### Nomenclatura
- Componentes: PascalCase (`MatchCard`, `RankingTable`)
- Hooks: camelCase com prefixo `use` (`useChampionships`, `useCreateGuess`)
- Utilitários: camelCase (`formatDate`, `calculatePoints`)
- Constantes: UPPER_SNAKE_CASE (`MAX_SCORE`, `DEFAULT_POINTS`)
- Arquivos de componentes: kebab-case (`match-card.tsx`, `ranking-table.tsx`)

### 11.4 Variáveis de Ambiente

#### Backend (`.env`)
```env
# App
NODE_ENV=development
PORT=3001
APP_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/copawill

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@copawill.com
SMTP_PASS=your-smtp-password
EMAIL_FROM="Copa Will <noreply@copawill.com>"

# Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=copa-will-assets
AWS_REGION=us-east-1

# Frontend URL (para CORS e e-mails)
FRONTEND_URL=http://localhost:3000
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 12. Estratégia de Testes

### 12.1 Pirâmide de Testes

```
         /\
        /E2E\        ← Playwright — Fluxos críticos completos
       /------\
      /Integra-\     ← Supertest — API endpoints
     / ção      \
    /------------\
   / Unitários    \  ← Jest — Services, utils, cálculos
  /______________  \
```

### 12.2 Testes Unitários (Jest)

**O que testar:**
- Serviços de negócio (cálculo de pontuação, validações)
- Utilitários e helpers
- Guards e interceptors

**Exemplo — Serviço de Pontuação:**
```typescript
describe('ScoringService', () => {
  describe('calculatePoints', () => {
    it('deve retornar 5 pontos para placar exato', () => {
      expect(calculatePoints({ home: 2, away: 1 }, { home: 2, away: 1 }, config)).toBe(5);
    });

    it('deve retornar 3 pontos para acerto do vencedor', () => {
      expect(calculatePoints({ home: 3, away: 1 }, { home: 2, away: 1 }, config)).toBe(3);
    });

    it('deve retornar 3 pontos para acerto de empate', () => {
      expect(calculatePoints({ home: 1, away: 1 }, { home: 0, away: 0 }, config)).toBe(3);
    });

    it('deve retornar 0 pontos para resultado errado', () => {
      expect(calculatePoints({ home: 2, away: 0 }, { home: 1, away: 2 }, config)).toBe(0);
    });
  });
});
```

**Cobertura mínima:** 80% nos services de negócio

### 12.3 Testes de Integração (Supertest + Jest)

**O que testar:**
- Endpoints da API (fluxo controller → service → banco)
- Autenticação e autorização
- Regras de negócio em cenários completos

**Configuração:** Banco de dados de teste dedicado (`DATABASE_URL_TEST`), resetado entre suítes com `prisma migrate reset`

**Exemplo:**
```typescript
describe('POST /guesses', () => {
  it('deve criar um palpite válido', async () => {
    const response = await request(app.getHttpServer())
      .post('/guesses')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ matchId: openMatch.id, homeScoreGuess: 2, awayScoreGuess: 1 })
      .expect(201);

    expect(response.body.data).toMatchObject({
      homeScoreGuess: 2,
      awayScoreGuess: 1,
      points: null,
    });
  });

  it('deve rejeitar palpite com período fechado', async () => {
    await request(app.getHttpServer())
      .post('/guesses')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ matchId: closedMatch.id, homeScoreGuess: 1, awayScoreGuess: 0 })
      .expect(403);
  });
});
```

### 12.4 Testes E2E (Playwright)

**Fluxos críticos cobertos:**
1. Cadastro → Confirmação de e-mail → Login → Fazer palpite
2. Admin cria campeonato → Cria partida → Abre palpites → Insere resultado → Ranking atualizado
3. Usuário visualiza ranking e compartilha posição
4. Recuperação de senha (fluxo completo)

**Exemplo:**
```typescript
test('usuário realiza palpite completo', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'teste@copawill.com');
  await page.fill('[name=password]', 'senha123');
  await page.click('button[type=submit]');

  await page.goto('/campeonatos/1/partidas');
  await expect(page.locator('[data-testid=match-card]').first()).toBeVisible();

  await page.fill('[data-testid=home-score-input]', '2');
  await page.fill('[data-testid=away-score-input]', '1');
  await page.click('[data-testid=submit-guess]');

  await expect(page.locator('[data-testid=guess-confirmed]')).toBeVisible();
});
```

### 12.5 Testes de Carga (k6)

**Cenários:**
- 1.000 usuários simultâneos consultando o ranking
- 500 usuários fazendo palpites ao mesmo tempo (abertura de rodada)
- 200 usuários recebendo atualizações via WebSocket

**Metas de performance:**
- Tempo de resposta P95 < 300ms para leituras
- Tempo de resposta P95 < 500ms para escritas
- Taxa de erro < 0.1% sob carga normal

### 12.6 Comandos de Teste

```bash
# Unitários
pnpm test

# Unitários com watch
pnpm test:watch

# Cobertura
pnpm test:cov

# Integração
pnpm test:integration

# E2E
pnpm test:e2e

# Carga
k6 run tests/load/ranking.js
```

---

## 13. Estratégia de Deploy

### 13.1 Ambientes

| Ambiente | Branch | URL | Finalidade |
|----------|--------|-----|------------|
| Development | feature/* | localhost | Desenvolvimento local |
| Staging | develop | staging.copawill.com | Testes antes de produção |
| Production | main | copawill.com | Ambiente de produção |

### 13.2 Docker

#### `docker-compose.yml` (desenvolvimento local)
```yaml
version: '3.9'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: copawill
      POSTGRES_USER: copawill
      POSTGRES_PASSWORD: copawill
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    volumes:
      - ./apps/api:/app
      - /app/node_modules
    env_file: ./apps/api/.env
    depends_on:
      - postgres
      - redis

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    env_file: ./apps/web/.env.local

volumes:
  postgres_data:
```

#### Dockerfile do Backend (produção)
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npx prisma generate

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main"]
```

### 13.3 CI/CD com GitHub Actions

#### `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-api:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: copawill_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
        working-directory: apps/api
      - run: npx prisma migrate deploy
        working-directory: apps/api
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/copawill_test
      - run: npm test
        working-directory: apps/api

  test-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
        working-directory: apps/web
      - run: npm run build
        working-directory: apps/web
      - run: npm run lint
        working-directory: apps/web
```

#### `.github/workflows/deploy.yml`
```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and push Docker images
        run: |
          docker build -t copawill-api ./apps/api
          docker build -t copawill-web ./apps/web
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/copa-will
            git pull origin main
            docker compose -f docker-compose.prod.yml up -d --build
            docker compose exec api npx prisma migrate deploy
```

### 13.4 Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name copawill.com www.copawill.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name copawill.com;

    ssl_certificate /etc/letsencrypt/live/copawill.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/copawill.com/privkey.pem;

    # Frontend (Next.js)
    location / {
        proxy_pass http://web:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend (NestJS)
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://api:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://api:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 13.5 Monitoramento em Produção

```yaml
# Adicionado ao docker-compose.prod.yml

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    ports:
      - "3100:3000"
    volumes:
      - grafana_data:/var/lib/grafana

  loki:
    image: grafana/loki:latest
    ports:
      - "3200:3100"
```

**Dashboards Grafana:**
- Requisições por segundo (RPS)
- Latência P50/P95/P99
- Taxa de erros
- Uso de CPU/Memória/Disco
- Conexões ativas no banco
- Filas pendentes (Bull)

---

## 14. Roadmap de Desenvolvimento

### Fase 1 — Fundação do Projeto (Semana 1-2)

- [ ] Criação do repositório e configuração do monorepo (Turborepo)
- [ ] Setup do Docker Compose com PostgreSQL e Redis
- [ ] Configuração do NestJS com Prisma
- [ ] Configuração do Next.js com TypeScript e Tailwind
- [ ] Schema inicial do banco de dados + migrations
- [ ] Configuração do ESLint, Prettier, Husky + lint-staged
- [ ] Configuração do GitHub Actions (CI básico)
- [ ] Variáveis de ambiente documentadas

**Entregável:** Ambiente de desenvolvimento 100% funcional e replicável

---

### Fase 2 — Autenticação (Semana 3-4)

- [ ] Endpoint de cadastro com validações
- [ ] Confirmação de e-mail (token + envio via Nodemailer)
- [ ] Endpoint de login (JWT + Refresh Token)
- [ ] Endpoint de refresh token
- [ ] Endpoint de logout (revogação do refresh token)
- [ ] Recuperação de senha (solicitar + redefinir)
- [ ] Guards e decorators de autenticação/autorização
- [ ] Telas de Login, Cadastro, Recuperação de Senha (frontend)
- [ ] Middleware de autenticação no frontend (Next.js middleware)

**Entregável:** Sistema de autenticação completo e seguro

---

### Fase 3 — Campeonatos e Times (Semana 5-6)

- [ ] CRUD de Times (backend + admin frontend)
- [ ] Upload de escudos/bandeiras para S3
- [ ] CRUD de Campeonatos (backend + admin frontend)
- [ ] Criação e gerenciamento de Fases
- [ ] Criação de Grupos e vinculação de times
- [ ] Tela de listagem de campeonatos (público)
- [ ] Tela de detalhe do campeonato
- [ ] Participação do usuário em campeonato

**Entregável:** Estrutura de campeonatos operacional

---

### Fase 4 — Partidas e Palpites (Semana 7-9)

- [ ] CRUD de Partidas (admin)
- [ ] Abertura/fechamento de período de palpites
- [ ] Inserção de resultados pelo admin
- [ ] API de palpites (criar/editar)
- [ ] Cálculo automático de pontuação ao inserir resultado
- [ ] Tela de partidas com inputs de palpite (frontend)
- [ ] Feedback visual após palpite (resultado vs. palpite)
- [ ] Validações de prazo e status

**Entregável:** Fluxo completo de palpites funcionando

---

### Fase 5 — Ranking (Semana 10-11)

- [ ] Cálculo e persistência de rankings
- [ ] Ranking geral do campeonato
- [ ] Ranking por rodada
- [ ] Ranking por fase
- [ ] Endpoint de recálculo (admin)
- [ ] Tela de ranking com posição destacada do usuário
- [ ] Compartilhamento social (geração de imagem com posição)

**Entregável:** Sistema de ranking completo

---

### Fase 6 — Painel Administrativo (Semana 12-13)

- [ ] Dashboard admin com visão geral
- [ ] Gerenciamento completo de usuários
- [ ] Gerenciamento de campeonatos (fluxo completo)
- [ ] Inserção e correção de resultados
- [ ] Recálculo manual de pontuações
- [ ] Configuração de regras de pontuação
- [ ] Log de ações administrativas

**Entregável:** Admin funcional e completo

---

### Fase 7 — UX/UI e Polimento (Semana 14-15)

- [ ] Design system consolidado (cores, tipografia, espaçamentos)
- [ ] Modo claro / Modo escuro
- [ ] Animações e transições (Framer Motion)
- [ ] Landing page com design final
- [ ] Responsividade mobile completa (mobile first)
- [ ] Acessibilidade (ARIA labels, contraste, navegação por teclado)
- [ ] Loading states e Skeleton screens
- [ ] Error boundaries e páginas de erro (404, 500)
- [ ] Tela de perfil com estatísticas

**Entregável:** Interface polida e responsiva

---

### Fase 8 — Testes (Semana 16)

- [ ] Cobertura de testes unitários ≥ 80% nos services
- [ ] Testes de integração dos endpoints críticos
- [ ] Testes E2E dos fluxos principais (Playwright)
- [ ] Testes de carga básicos (k6)
- [ ] Revisão e correção de bugs encontrados

**Entregável:** Suite de testes consolidada

---

### Fase 9 — Deploy e Lançamento (Semana 17-18)

- [ ] Provisionamento do servidor VPS
- [ ] Configuração do Nginx + SSL (Certbot)
- [ ] Deploy em ambiente de staging
- [ ] Configuração do Prometheus + Grafana
- [ ] Configuração do Sentry
- [ ] Pipeline de CI/CD completo (GitHub Actions)
- [ ] Testes finais em staging
- [ ] Deploy em produção
- [ ] Monitoramento pós-deploy (primeiras 48h)
- [ ] Documentação de operação e runbook

**Entregável:** Sistema em produção, estável e monitorado

---

## 15. Requisitos Não Funcionais

### 15.1 Performance

| Métrica | Meta |
|---------|------|
| Tempo de carregamento inicial (LCP) | < 2.5 segundos |
| Time to Interactive (TTI) | < 3.5 segundos |
| P95 de tempo de resposta da API | < 300ms |
| Score Lighthouse (Performance) | ≥ 85 |

### 15.2 Segurança

- Autenticação JWT com Refresh Token rotativo
- Senhas hashadas com bcrypt (salt rounds: 12)
- Rate limiting em endpoints de autenticação (5 tentativas / 15 min)
- Validação e sanitização de todos os inputs
- Headers de segurança HTTP via Helmet.js
- HTTPS obrigatório em produção
- Dados sensíveis nunca logados
- Auditoria de ações administrativas

### 15.3 Escalabilidade

- Stateless API (pronta para horizontal scaling)
- Cache agressivo de rankings e dados estáticos (Redis)
- Índices de banco de dados para queries frequentes
- Upload de imagens direto para S3 (sem passar pelo servidor)
- Filas para processamento assíncrono (pontuações, e-mails)

### 15.4 SEO

- SSR para Landing Page e páginas públicas
- Meta tags e Open Graph configurados
- Sitemap XML gerado automaticamente
- Robots.txt configurado
- URLs semânticas e amigáveis

### 15.5 Acessibilidade

- Contraste de cores conforme WCAG 2.1 AA
- Navegação completa por teclado
- Leitores de tela suportados (aria-labels, roles)
- Textos alternativos em imagens
- Foco visível em elementos interativos

### 15.6 LGPD

- Política de privacidade clara e acessível
- Dados coletados limitados ao necessário
- Usuário pode solicitar exclusão de conta e dados
- Consentimento explícito no cadastro
- Dados de menores: plataforma requer +16 anos
- Logs com expiração configurada (máx. 90 dias)

---

## 16. Glossário

| Termo | Definição |
|-------|-----------|
| **Bolão** | Competição informal onde participantes fazem palpites sobre resultados esportivos |
| **Palpite** | Previsão de placar feita por um usuário para uma partida específica |
| **Placar exato** | Palpite onde mandante e visitante foram acertados exatamente |
| **Acerto de vencedor** | Palpite que acertou qual time venceu (ou empate), mas não o placar exato |
| **Fase de grupos** | Etapa inicial de um campeonato onde times jogam entre si em grupos |
| **Mata-mata** | Fase eliminatória onde o time perdedor é eliminado do campeonato |
| **Rodada** | Conjunto de partidas de uma fase realizadas em um período próximo |
| **Ranking** | Classificação dos participantes por pontuação acumulada |
| **Access Token** | Token JWT de curta duração usado para autenticar requisições |
| **Refresh Token** | Token de longa duração usado para obter novos Access Tokens |
| **SSR** | Server-Side Rendering — renderização de páginas no servidor |
| **CSR** | Client-Side Rendering — renderização de páginas no navegador |
| **ORM** | Object-Relational Mapping — abstração de acesso ao banco de dados |
| **CDN** | Content Delivery Network — rede de distribuição de conteúdo estático |
| **CI/CD** | Integração Contínua / Entrega Contínua — automação de testes e deploy |

---

*Documento gerado em Junho de 2026. Versão 1.0.0.*
*Este documento deve ser atualizado conforme o projeto evolui.*
