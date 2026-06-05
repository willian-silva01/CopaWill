# Como iniciar o projeto Copa Will

## 1. Instalar pré-requisitos

- **Node.js 20 LTS** → https://nodejs.org
- **pnpm** → após instalar o Node: `npm install -g pnpm`
- **Docker Desktop** → https://www.docker.com/products/docker-desktop

---

## 2. Clonar / configurar o projeto

```bash
# Na pasta do projeto, copiar os arquivos de ambiente
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

---

## 3. Subir o banco e Redis com Docker

```bash
# Subir apenas PostgreSQL e Redis (deixar rodando)
docker compose -f docker/docker-compose.yml up -d
```

Aguarde alguns segundos até o Postgres estar pronto (pode verificar com `docker ps`).

---

## 4. Instalar dependências

```bash
# Na raiz do projeto
pnpm install
```

---

## 5. Configurar o banco de dados

```bash
# Criar as tabelas
pnpm db:migrate

# Popular com dados de teste (admin + times)
pnpm db:seed
```

**Credenciais criadas pelo seed:**
- Admin: `admin@copawill.com` / `admin123`
- Usuário: `teste@copawill.com` / `user123`

---

## 6. Rodar o projeto

```bash
# Rodar API + Web juntos (modo desenvolvimento)
pnpm dev
```

Ou em terminais separados:
```bash
# Terminal 1 — Backend
pnpm --filter api dev
# Disponível em: http://localhost:3001
# Docs Swagger: http://localhost:3001/docs

# Terminal 2 — Frontend
pnpm --filter web dev
# Disponível em: http://localhost:3000
```

---

## 7. Estrutura de portas

| Serviço    | Porta  |
|------------|--------|
| Frontend   | 3000   |
| Backend    | 3001   |
| PostgreSQL | 5432   |
| Redis      | 6379   |
| Prisma Studio | 5555 |

---

## 8. Comandos úteis

```bash
# Ver banco visualmente
pnpm db:studio

# Rodar testes
pnpm test

# Build de produção
pnpm build

# Adicionar nova migration
pnpm --filter api prisma migrate dev --name nome-da-migration
```

---

## 9. Variáveis de ambiente importantes

Edite `apps/api/.env` antes de rodar:

```env
# Altere para valores seguros em produção!
JWT_SECRET=mude-isso-para-algo-muito-secreto
REFRESH_TOKEN_SECRET=outro-segredo-forte-aqui

# Configure seu provedor de e-mail para testes
SMTP_HOST=smtp.gmail.com
SMTP_USER=seu@email.com
SMTP_PASS=sua-senha-de-app
```
