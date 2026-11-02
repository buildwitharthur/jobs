# Controle de Candidaturas

Aplicação web pessoal para acompanhar os processos seletivos em que me inscrevo e os currículos que uso em cada um. Um kanban mostra em que etapa cada candidatura está, e cada processo guarda o próprio histórico. Uso de uma pessoa só, sem autenticação.

A documentação completa está em [specs/](specs/):

- [overview.md](specs/overview.md): contexto, objetivos, funcionalidades e escopo
- [domain.md](specs/domain.md): models, enums, interfaces e regras de negócio
- [api.md](specs/api.md): checklist das rotas e dos testes
- [design/ui.md](specs/design/ui.md): guia de UI/UX, com as telas, o que cada uma consome e os critérios de aceite
- [design/design.md](specs/design/design.md): design system, com cores (tema escuro por padrão), fontes, ícones, layout, componentes e regras de uso
- [design/prototype/](specs/design/prototype/index.html): protótipo navegável da interface; abra o `index.html` no navegador

## Monorepo

pnpm (workspaces) + Turborepo. Hoje só existe um app.

| Pasta                | Conteúdo                                           |
| -------------------- | -------------------------------------------------- |
| [apps/api](apps/api) | API em Express + TypeScript (Zod, Prisma, Swagger) |

Na raiz ficam ESLint (com typescript-eslint), Prettier (com prettier-plugin-tailwindcss) e EditorConfig, compartilhados pelos apps. A arquitetura da API está em [apps/api/AGENTS.md](apps/api/AGENTS.md).

## Como rodar

1. Instale as dependências: `pnpm install`
2. Suba o PostgreSQL (versão 18, banco `jobs`, volume `postgres_data`): `docker compose up -d`
3. Copie `apps/api/.env.example` para `apps/api/.env` (o Compose expõe o Postgres na porta `5433`)
4. Dentro de `apps/api`, aplique as migrations e gere o cliente do Prisma: `pnpm exec prisma migrate deploy --config prisma7.config.ts` e `pnpm exec prisma generate --config prisma7.config.ts`
5. Inicie a API: `pnpm dev` (porta `3000`, ou a definida em `PORT`)

Com a API no ar, a documentação Swagger fica em `GET /docs` e o JSON em `GET /openapi.json`.

### Scripts da raiz

| Script              | O que faz                               |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Sobe os apps em modo de desenvolvimento |
| `pnpm build`        | Compila os apps                         |
| `pnpm lint`         | ESLint em todos os apps                 |
| `pnpm test`         | Testes de todos os apps                 |
| `pnpm format`       | Formata com o Prettier                  |
| `pnpm format:check` | Checa a formatação                      |

## Módulos da API

Ficam em [apps/api/src/modules](apps/api/src/modules), um por seção do [api.md](specs/api.md).

### `statuses` — implementado

Lista fixa dos 9 status, que definem as colunas do kanban: Inscrito, Em análise / Triagem, Entrevista, Teste técnico / Case, Proposta, Aprovado / Aceito, Reprovado, Desisti e Sem retorno. Rota: `GET /statuses`.

### `applications` — implementado

Candidaturas: criar, listar com filtros e busca, detalhar com histórico, editar, mudar de status e excluir. A mudança de status é a operação que o kanban usa ao arrastar um card.

### `events` — implementado

Histórico de cada candidatura: eventos de criação, de mudança de status e notas manuais (entrevista marcada, feedback). Listar, adicionar, editar e excluir.

### `board` — implementado

Dados do kanban: candidaturas agrupadas por status, sempre com as 9 colunas, com os mesmos filtros de busca da listagem.

### `resumes` — implementado

Versões do currículo: upload de PDF guardado numa pasta do projeto, edição, troca do arquivo, download e lista das candidaturas que usaram cada currículo. Um currículo em uso não pode ser excluído.

### `dashboard` — implementado

Painel com o resumo geral: total, ativas e encerradas, contagem por status, candidaturas dos últimos 30 dias e eventos recentes.
