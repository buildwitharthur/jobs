# Controle de Candidaturas

Aplicação web pessoal para acompanhar os processos seletivos em que me inscrevo e os currículos que uso em cada um. Um kanban mostra em que etapa cada candidatura está, e cada processo guarda o próprio histórico. Uso de uma pessoa só, sem autenticação.

![Kanban de candidaturas, uma coluna por etapa do processo](docs/screenshots/kanban.png)

## Por que existe

Informações de processos seletivos ficam espalhadas entre e-mails, plataformas de vagas e anotações soltas. Fica difícil saber em que etapa cada processo está, quando foi o último contato e qual versão do currículo foi enviada para qual empresa. O app junta tudo num lugar só.

## O que dá para fazer

- **Kanban com uma coluna por etapa**: Inscrito, Em análise / Triagem, Entrevista, Teste técnico / Case, Proposta, Aprovado / Aceito, Reprovado, Desisti e Sem retorno. Arrastar um card muda o status e registra o evento no histórico.
- **Detalhe em painel lateral**: clicar num card abre os dados da candidatura e a linha do tempo, sem sair do kanban. Os campos são editados no lugar e salvam sozinhos.
- **Histórico de cada processo**: mudanças de status e notas manuais (entrevista marcada, feedback), com data.
- **Versões do currículo**: envie o PDF (botão ou arrastando para a tela), troque o arquivo, edite nome e descrição e veja em quais candidaturas cada versão foi usada.
- **Tema escuro e claro**.

|                                         Painel de detalhe                                         |                                           Currículos                                           |
| :-----------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: |
| ![Painel de detalhe de uma candidatura, com os dados e o histórico](docs/screenshots/detalhe.png) | ![Lista de currículos com as candidaturas que usaram cada um](docs/screenshots/curriculos.png) |

![Kanban no tema claro](docs/screenshots/kanban-claro.png)

> As capturas usam dados de exemplo fictícios.

### Em andamento

A tela **Painel** (resumo com totais e contagem por status) ainda não foi construída na interface. A API que a alimenta já está pronta (`GET /dashboard`).

## Tecnologias

| App                  | Stack                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [apps/api](apps/api) | Express e TypeScript, Zod para validação, Prisma 7 com PostgreSQL, Swagger (OpenAPI gerado dos schemas Zod)                           |
| [apps/web](apps/web) | React 19 e TypeScript, Vite, TanStack Router e Query, Tailwind CSS v4, Radix UI, dnd-kit (arrastar os cards), React Hook Form com Zod |

O monorepo usa pnpm (workspaces) e Turborepo. Na raiz ficam ESLint (com typescript-eslint), Prettier (com prettier-plugin-tailwindcss) e EditorConfig, compartilhados pelos apps.

## Como rodar

1. Instale as dependências: `pnpm install`
2. Suba o PostgreSQL (versão 18, banco `jobs`, volume `postgres_data`): `docker compose up -d`
3. Copie `apps/api/.env.example` para `apps/api/.env` (o Compose expõe o Postgres na porta `5433`)
4. Dentro de `apps/api`, aplique as migrations: `pnpm exec prisma migrate deploy --config prisma7.config.ts`
5. Inicie os apps: `pnpm dev` (API na porta `3000`, ou a definida em `PORT`; interface em `http://localhost:5173`)

Com a API no ar, a documentação Swagger fica em `GET /docs` e o JSON em `GET /openapi.json`.

O cliente do Prisma (`apps/api/src/common/infrastructure/database/prisma/generated`) é versionado. Quando o `schema.prisma` mudar, rode `pnpm exec prisma generate --config prisma7.config.ts` dentro de `apps/api` e commite o resultado.

### Com Docker

Cada app tem um `Dockerfile`. O contexto do build é a raiz do repositório (por causa do workspace do pnpm):

```bash
docker build -f apps/api/Dockerfile -t job-api .
docker build -f apps/web/Dockerfile -t job-web --build-arg VITE_API_URL=http://localhost:3000 .

docker run -p 3000:3000 -e DATABASE_URL=postgresql://usuario:senha@host:5432/jobs -v job-storage:/app/apps/api/storage job-api
docker run -p 8080:80 job-web
```

- A imagem da API não aplica as migrations: rode `prisma migrate deploy` no banco antes de subir.
- Os PDFs dos currículos ficam em `/app/apps/api/storage`; o volume do exemplo mantém os arquivos ao recriar o container.
- O endereço da API é definido no build da interface (`VITE_API_URL`), porque é o navegador quem chama a API.

### Scripts da raiz

| Script              | O que faz                               |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Sobe os apps em modo de desenvolvimento |
| `pnpm build`        | Compila os apps                         |
| `pnpm lint`         | ESLint em todos os apps                 |
| `pnpm test`         | Testes de todos os apps                 |
| `pnpm format`       | Formata com o Prettier                  |
| `pnpm format:check` | Checa a formatação                      |

## Documentação

A documentação completa está em [specs/](specs/):

- [overview.md](specs/overview.md): contexto, objetivos, funcionalidades e escopo
- [domain.md](specs/domain.md): models, enums, interfaces e regras de negócio
- [api.md](specs/api.md): checklist das rotas e dos testes
- [design/ui.md](specs/design/ui.md): guia de UI/UX, com as telas, o que cada uma consome e os critérios de aceite
- [design/design.md](specs/design/design.md): design system, com cores (tema escuro por padrão), fontes, ícones, layout, componentes e regras de uso
- [design/prototype/](specs/design/prototype/index.html): protótipo navegável da interface; abra o `index.html` no navegador

A arquitetura da API está em [apps/api/AGENTS.md](apps/api/AGENTS.md) e a da interface em [apps/web/AGENTS.md](apps/web/AGENTS.md).

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
