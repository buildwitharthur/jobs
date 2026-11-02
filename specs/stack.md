# Stack

Decisões de tecnologia do projeto. Só entra aqui o que foi decidido.

## Monorepo

- pnpm (workspaces) + Turborepo
- Workspaces: `apps/*`
- Raiz: ESLint (com typescript-eslint), Prettier (com prettier-plugin-tailwindcss) e EditorConfig, compartilhados pelos apps

## API (`apps/api`)

- Express com TypeScript
- Zod para validação
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
