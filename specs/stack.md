# Stack

Decisões de tecnologia do projeto. Só entra aqui o que foi decidido.

## Monorepo

- pnpm (workspaces) + Turborepo
- Workspaces: `apps/*`
- Raiz: ESLint (com typescript-eslint), Prettier (com prettier-plugin-tailwindcss) e EditorConfig, compartilhados pelos apps

## API (`apps/api`)

- Express com TypeScript
- Zod para validação
- Prisma 7 (7.10.1) com PostgreSQL, usando o driver adapter `@prisma/adapter-pg`
- Swagger para documentar as rotas: documento OpenAPI gerado a partir dos schemas Zod (`@asteasolutions/zod-to-openapi`) e exibido com `swagger-ui-express`
  - UI: `GET /docs`
  - JSON: `GET /openapi.json`

### Estrutura

```
apps/api/src/common/
├── domain/errors/app-error.ts            # AppError (message, statusCode, code)
└── infrastructure/http/
    ├── server.ts                         # sobe o servidor (PORT, padrão 3000)
    ├── app.ts                            # Express: cors, json, docs, rotas, errorHandler
    ├── route.ts                          # Router raiz com as rotas da API
    └── middleware/errors.middleware.ts   # errorHandler
```

### Banco de dados (Prisma)

- Schema: `apps/api/prisma/schema.prisma`; configuração do CLI: `apps/api/prisma7.config.ts` (nome usado pelo Prisma 7.10+).
- Cliente gerado em `apps/api/src/database/prisma/generated` (não versionado; gere com `pnpm exec prisma generate --config prisma7.config.ts` dentro de `apps/api`).
- Instância do cliente: `apps/api/src/database/prisma/index.ts`, que exporta `prisma`.
- Conexão pela variável `DATABASE_URL` em `apps/api/.env` (carregada com `dotenv`).
- O Prisma 7 exige driver adapter e não gera o cliente automaticamente em `migrate dev`.

### Comportamento da base

- Ordem dos middlewares em `app.ts`: `cors()`, `express.json()`, `/openapi.json` e `/docs`, `routes`, `errorHandler` (sempre por último).
- CORS liberado para qualquer origem (`cors()` sem opções).
- Rotas na raiz, sem prefixo `/api`.
- Erros: lançar `AppError(message, statusCode, code)`; o `errorHandler` responde `{ code, message }` com o `statusCode`. Qualquer outro erro vira 500 com `internal_error`.

### Scripts (`apps/api`)

- `dev`: `tsx watch` no `server.ts`
- `build`: `tsc -p tsconfig.json` (saída em `dist/`)
- `start`: roda `dist/common/infrastructure/http/server.js`
- `lint`: `eslint .`
