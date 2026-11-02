# AGENTS.md — API (`apps/api`)

Padrões de arquitetura da API. Valem junto com o [AGENTS.md](../../AGENTS.md) da raiz: leia a documentação em [specs/](../../specs/) antes de qualquer decisão e nunca presuma nada. Os dois arquivos se somam.

Os exemplos deste documento usam uma entidade genérica chamada `Item` (rota `/items`). Troque pelo nome da entidade real do módulo em que estiver trabalhando.

## Tecnologias

- Express com TypeScript (ESM, `moduleResolution: NodeNext`)
- Zod para validação
- Prisma 7 (7.10.1) com PostgreSQL, usando o driver adapter `@prisma/adapter-pg`
- Swagger para documentar as rotas: documento OpenAPI gerado a partir dos schemas Zod (`@asteasolutions/zod-to-openapi`) e exibido com `swagger-ui-express`
  - UI: `GET /docs`
  - JSON: `GET /openapi.json`

Não troque nem acrescente tecnologias sem confirmação.

## Como tudo se conecta

### Caminho de uma requisição

```
Cliente
  │
  ▼
server.ts ──► app.ts
                │  cors() → express.json()
                ▼
              routes.ts            monta as rotas de todos os módulos
                │
                ▼
              <entity>.routes.ts   liga método + caminho ao controller
                │
                ▼
              <verb><Entity>Controller
                │  1. valida a requisição com Zod (safeParse → `parsed`)
                │  2. instancia o use case com o repositório concreto
                │  3. executa e devolve a resposta campo a campo
                ▼
              <Verb><Entity>UseCase       regra de negócio, só conhece interfaces
                │
                ▼
              <Entity>Repository          interface (domain)
                ▲
                │ implementa
              <Entity>RepositoryImpl      acesso a dados (infrastructure)
```

Qualquer erro lançado no caminho (`throw new AppError(...)` ou um erro inesperado) chega ao `errorHandler`, o último middleware do `app.ts`, que monta a resposta de erro.

### Regra de dependência

```
infrastructure ──► application ──► domain
```

- `domain` não importa nada de fora dele.
- `application` importa só de `domain` (e de `common/domain`, como o `AppError`).
- `infrastructure` pode importar de qualquer camada.
- **Nunca** o contrário: use case não importa Express, Zod, Prisma nem nada de `infrastructure`.

É por isso que o use case só recebe a **interface** do repositório pelo construtor. Quem escolhe a implementação concreta é o controller.

## Estrutura e função de cada pasta

```
apps/api/
├── prisma/schema.prisma
├── prisma7.config.ts
└── src/
    ├── common/
    │   ├── domain/errors/
    │   └── infrastructure/
    │       ├── database/prisma/
    │       └── http/
    └── modules/
        └── <module>/
            ├── domain/{models,repositories}/
            ├── application/usecases/
            └── infrastructure/{http/{controller,routes},repositories}/
```

### `src/common`: o que é compartilhado por todos os módulos

| Pasta                                   | Função                                                                                                      | Conteúdo                                                                                                      |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `common/domain/errors/`                 | Erros de negócio que qualquer camada pode lançar, sem depender de HTTP                                      | `app-error.ts`: `AppError(message, statusCode = 400, code = "bad_request")`                                   |
| `common/infrastructure/database/prisma/`| Conexão com o banco                                                                                         | `index.ts` exporta a instância `prisma`; `generated/` é o cliente gerado (não versionado, nunca edite)         |
| `common/infrastructure/http/`           | Tudo que monta e sobe o servidor Express                                                                    | Arquivos abaixo                                                                                               |

Arquivos de `common/infrastructure/http/`:

| Arquivo                           | Função                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| `server.ts`                       | Ponto de entrada. Lê `PORT` (padrão 3000) e chama `app.listen`                                   |
| `app.ts`                          | Monta o Express: `cors()`, `express.json()`, `/openapi.json`, `/docs`, `routes`, `errorHandler`  |
| `routes.ts`                       | Router raiz. Importa o router de cada módulo e o monta com `routes.use(<entity>Routes)`          |
| `openapi.ts`                      | Registro compartilhado do Swagger (`registry`) e o documento OpenAPI gerado a partir dele        |
| `middlewares/errors.middleware.ts`| `errorHandler`: responde `{ code, message }` para `AppError` e 500 `internal_error` para o resto |

### `src/modules/<module>`: um módulo por seção do [api.md](../../specs/api.md)

Módulos: `statuses`, `applications`, `events`, `board`, `resumes`, `dashboard`. Cada módulo é independente e tem as mesmas três camadas.

| Pasta                                      | Função                                                                    | O que entra                                                                                   | Não pode ter                   |
| ------------------------------------------ | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------ |
| `domain/models/`                           | O vocabulário do módulo                                                   | Interfaces e tipos: entidade e enums                                                          | Express, Prisma, Zod, classes com acesso a dados |
| `domain/repositories/`                     | O contrato de acesso a dados                                              | Uma interface por entidade, descrevendo o que o use case precisa                              | Implementação, qualquer stack  |
| `application/usecases/`                    | As regras de negócio                                                      | Uma classe por arquivo, com um método `execute()`, e os tipos `Input` e `Output` do use case  | Express, Prisma, Zod           |
| `infrastructure/http/controller/`          | A borda HTTP de cada rota                                                 | Uma arrow function por rota: valida, chama o use case, responde. Também o `registerPath` do Swagger | Regra de negócio               |
| `infrastructure/http/routes/`              | Liga método + caminho ao controller                                       | Um `Router` exportado como `<entity>Routes`                                                   | Lógica                         |
| `infrastructure/repositories/`             | A implementação concreta do repositório                                   | Classe `<Entity>RepositoryImpl` que implementa a interface de `domain/repositories`          | Regra de negócio               |

Exemplo de árvore (módulo `items`):

```
modules/items/
├── domain/
│   ├── models/item.model.ts
│   └── repositories/item.repository.ts
├── application/
│   └── usecases/
│       ├── create-item.usecase.ts
│       └── get-item.usecase.ts
└── infrastructure/
    ├── http/
    │   ├── controller/item.controller.ts
    │   └── routes/item.routes.ts
    └── repositories/item.repository.ts
```

## Padrões de código, camada por camada

### Model (`domain/models/item.model.ts`)

Interfaces puras da entidade e dos enums. Os campos usam os mesmos nomes (`snake_case`) do [domain.md](../../specs/domain.md). Os tipos de entrada e saída dos use cases **não** ficam aqui: ficam no arquivo de cada use case.

```ts
export interface Item {
  id: number;
  name: string;
  description: string | null;
}
```

### Repository, interface (`domain/repositories/item.repository.ts`)

Todos os métodos são assíncronos. Retorna `null` quando não encontra; quem decide que isso é erro 404 é o use case. O repositório pertence ao `domain` e por isso **não** importa os tipos `Input`/`Output` dos use cases (que ficam em `application`): ele usa o model (ex.: `Omit<Item, "id">`).

```ts
import type { Item } from "../models/item.model.js";

export interface ItemRepository {
  findAll(): Promise<Item[]>;
  findById(id: number): Promise<Item | null>;
  create(data: Omit<Item, "id">): Promise<Item>;
}
```

### Use case (`application/usecases/get-item.usecase.ts`)

Um use case por arquivo. Cada arquivo exporta, acima da classe, os tipos que descrevem o contrato do use case:

- `<Verb><Entity>Input`: o que o `execute()` recebe. É `void` quando o use case não recebe nada.
- `<Verb><Entity>Output`: o que o `execute()` devolve.

A classe recebe a **interface** do repositório pelo construtor e usa esses tipos na assinatura do `execute()`: `execute(input: <X>Input): Promise<<X>Output>`. Regra de negócio e erros de negócio (`AppError`) ficam aqui.

```ts
import { AppError } from "../../../../common/domain/errors/app-error.js";
import type { Item } from "../../domain/models/item.model.js";
import type { ItemRepository } from "../../domain/repositories/item.repository.js";

export type GetItemInput = { id: number };
export type GetItemOutput = Item;

export class GetItemUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute({ id }: GetItemInput): Promise<GetItemOutput> {
    const item = await this.itemRepository.findById(id);

    if (!item) {
      throw new AppError("Item não encontrado.", 404, "not_found");
    }

    return item;
  }
}
```

Use case sem entrada (`Input` é `void`, o `execute()` não recebe parâmetro) e que devolve uma lista:

```ts
import type { Item } from "../../domain/models/item.model.js";
import type { ItemRepository } from "../../domain/repositories/item.repository.js";

export type ListItemsInput = void;
export type ListItemsOutput = Item[];

export class ListItemsUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(): Promise<ListItemsOutput> {
    return this.itemRepository.findAll();
  }
}
```

Regras:

- Os tipos `Input` e `Output` são sempre exportados, mesmo quando `void`, para o contrato de todo use case ter a mesma forma.
- Os tipos pertencem ao use case e ficam no arquivo dele. Não os coloque em `domain/models`.
- Quem chama o use case (o controller) pode importar esses tipos para tipar o que monta para o `execute()`.
- Não use `namespace`: a regra `@typescript-eslint/no-namespace` do ESLint proíbe, e o padrão é exportar os tipos soltos no arquivo.

### Repository, implementação (`infrastructure/repositories/item.repository.ts`)

Implementa a interface do domínio. É o único lugar do módulo que fala com o banco (ou com qualquer fonte de dados). Converte o que vem de fora para o model do domínio.

```ts
import type { Item } from "../../domain/models/item.model.js";
import type { ItemRepository } from "../../domain/repositories/item.repository.js";

export class ItemRepositoryImpl implements ItemRepository {
  async findById(id: number): Promise<Item | null> {
    // consulta ao banco, devolvendo o model do domínio ou null
  }

  // ...demais métodos da interface
}
```

### Controller (`infrastructure/http/controller/item.controller.ts`)

Uma arrow function por rota, mais o schema Zod e o registro no Swagger da própria rota. Passos, sempre nesta ordem:

1. Validar com Zod usando `safeParse`; se falhar, lançar `AppError(message, 400, "validation_error")`.
2. Instanciar o use case com a implementação concreta do repositório.
3. Executar o use case.
4. Responder montando cada campo explicitamente (desestruturado), sem devolver o objeto do use case inteiro.

```ts
import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../../../../../common/domain/errors/app-error.js";
import { registry } from "../../../../../common/infrastructure/http/openapi.js";
import { CreateItemUseCase } from "../../../application/usecases/create-item.usecase.js";
import { ItemRepositoryImpl } from "../../repositories/item.repository.js";

const itemResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
});

const createItemRequestSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
    description: z.string().nullish(),
  }),
});

registry.registerPath({
  method: "post",
  path: "/items",
  tags: ["Items"],
  summary: "Criar item",
  request: {
    body: { content: { "application/json": { schema: createItemRequestSchema.shape.body } } },
  },
  responses: {
    201: {
      description: "Item criado",
      content: { "application/json": { schema: itemResponseSchema } },
    },
    400: { description: "Payload inválido" },
  },
});

export const createItemController = async (req: Request, res: Response) => {
  const parsed = createItemRequestSchema.safeParse({ body: req.body });

  if (!parsed.success) {
    throw new AppError("Payload inválido.", 400, "validation_error");
  }

  const createItem = new CreateItemUseCase(new ItemRepositoryImpl());
  const item = await createItem.execute(parsed.data.body); // CreateItemInput

  return res.status(201).json({ id: item.id, name: item.name, description: item.description });
};
```

Regras do controller:

- Valida **tudo** que a rota recebe (`body`, `params`, `query`) num único schema `z.object({ body, params, query })`, com um único `safeParse` cujo resultado se chama `parsed`. Só entram no schema as partes que a rota realmente recebe.
- Parâmetros de rota e query chegam como texto: use `z.coerce` para converter (ex.: `z.coerce.number().int().positive()` para `:id`).
- Rota sem nada a validar (ex.: `GET /statuses`) não usa Zod e não tem `parsed`.
- Controllers async podem lançar erro direto: o Express 5 encaminha a rejeição para o `errorHandler`. Não use `try/catch` só para repassar o erro.
- O controller não tem regra de negócio. Se precisar de um `if` que decide algo do negócio, ele pertence ao use case.

### Swagger

- Cada rota é documentada no próprio controller com `registry.registerPath`, usando os mesmos schemas Zod da validação (`request`) e da resposta (`responses`).
- O `registerPath` roda quando o controller é importado. Por isso o documento OpenAPI só pode ser gerado **depois** que todos os controllers foram importados (ou seja, depois de `routes.ts`). Gerar o documento antes deixa `paths` vazio.
- Parâmetro de caminho no Swagger usa chaves (`/items/{id}`); no Express usa dois-pontos (`/items/:id`).

### Routes (`infrastructure/http/routes/item.routes.ts`)

```ts
import { Router } from "express";
import { createItemController, getItemController } from "../controller/item.controller.js";

export const itemRoutes = Router();

itemRoutes.post("/items", createItemController);
itemRoutes.get("/items/:id", getItemController);
```

O caminho completo da rota (`/items/:id`) fica aqui, sem prefixo `/api`.

### Registrar um módulo (`common/infrastructure/http/routes.ts`)

```ts
import { Router } from "express";
import { itemRoutes } from "../../../modules/items/infrastructure/http/routes/item.routes.js";

const routes = Router();

routes.use(itemRoutes);

export { routes };
```

### Erros

- Regra de negócio violada: `throw new AppError(message, statusCode, code)` no use case.
- Validação de entrada: `throw new AppError("...", 400, "validation_error")` no controller.
- Códigos usados: `validation_error`, `not_found`, `conflict`, `bad_request` (padrão do `AppError`) e `internal_error` (500, gerado pelo `errorHandler`). Os status HTTP estão no [api.md](../../specs/api.md).
- Resposta de erro: sempre `{ code, message }`.

## Nomes

### Arquivos

Sempre `kebab-case`, no formato `<nome>.<tipo>.ts`.

| Tipo       | Arquivo                                  | Observação                                                          |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------- |
| Model      | `<entity>.model.ts`                      | Entidade no singular (`item.model.ts`)                              |
| Repository | `<entity>.repository.ts`                 | A interface em `domain/repositories`, a implementação em `infrastructure/repositories`. O mesmo nome nas duas pastas é intencional |
| Use case   | `<verb>-<entity>.usecase.ts`             | Nomeado pela ação (`create-item.usecase.ts`, `list-items.usecase.ts`) |
| Controller | `<entity>.controller.ts`                 | Um arquivo por entidade, com um controller por rota dentro          |
| Routes     | `<entity>.routes.ts`                     | Singular, como o controller                                         |
| Middleware | `<nome>.middleware.ts`                   | Em `common/infrastructure/http/middlewares/`                        |
| Pastas     | `kebab-case`, no plural para coleções    | `models`, `repositories`, `usecases`, `controller`, `routes`        |

### Classes, interfaces e tipos: `PascalCase`

| O quê                    | Padrão                    | Exemplo                |
| ------------------------ | ------------------------- | ---------------------- |
| Model                    | `<Entity>`                | `Item`                 |
| Entrada do use case      | `<Verb><Entity>Input`     | `CreateItemInput`      |
| Saída do use case        | `<Verb><Entity>Output`    | `CreateItemOutput`     |
| Interface do repositório | `<Entity>Repository`      | `ItemRepository`       |
| Implementação            | `<Entity>RepositoryImpl`  | `ItemRepositoryImpl`   |
| Use case                 | `<Verb><Entity>UseCase`   | `CreateItemUseCase`    |

Verbos dos use cases: `List`, `Get`, `Create`, `Update`, `Delete` e, para operações específicas, o verbo do negócio (ex.: `Change`). Listas usam o plural (`ListItemsUseCase`, `ListItemsOutput`). Os tipos `Input` e `Output` têm o mesmo prefixo da classe e ficam no arquivo do use case.

### Funções e constantes: `camelCase`

| O quê                     | Padrão                      | Exemplo                                      |
| ------------------------- | --------------------------- | -------------------------------------------- |
| Controller                | `<verb><Entity>Controller`  | `createItemController`                       |
| Router do módulo          | `<entity>Routes`            | `itemRoutes`                                 |
| Schema de requisição      | `<verb><Entity>RequestSchema` | `createItemRequestSchema`                  |
| Schema de resposta        | `<entity>ResponseSchema`    | `itemResponseSchema`                         |
| Método do repositório     | `findAll`, `findById`, `create`, `update`, `delete` | `itemRepository.findById(id)` |

### Variáveis

| O quê                                  | Nome                               | Exemplo                                             |
| -------------------------------------- | ---------------------------------- | --------------------------------------------------- |
| Resultado do `safeParse` do Zod        | sempre `parsed`                    | `const parsed = createItemRequestSchema.safeParse(...)` |
| Dados validados                        | `parsed.data`                      | `parsed.data.body`, `parsed.data.params.id`         |
| Instância do use case                  | a ação em `camelCase`              | `const createItem = new CreateItemUseCase(...)`     |
| Resultado do use case                  | a entidade (plural em listas)      | `const item = ...`, `const items = ...`             |
| Repositório no construtor              | `<entity>Repository`               | `private readonly itemRepository: ItemRepository`   |
| Parâmetro não usado                    | prefixo `_`                        | `_req`                                              |

Outras regras:

- Campos de models, do banco e do JSON da API: `snake_case` (`applied_at`, `resume_id`). Variáveis soltas no código: `camelCase`.
- Valores de enum e códigos de erro: `snake_case` minúsculo (`technical_test`, `validation_error`).
- Imports relativos sempre terminam em `.js` (exigência do ESM com NodeNext). Tipos usam `import type`.
- Aspas duplas, ponto e vírgula, indentação de 2 espaços (o Prettier e o EditorConfig já aplicam).
- Código e identificadores em inglês. Mensagens de erro e textos do Swagger em português.

## Checklist para criar um módulo novo

1. Ler o [domain.md](../../specs/domain.md) e a seção do módulo no [api.md](../../specs/api.md).
2. `domain/models/<entity>.model.ts`: entidade e enums.
3. `domain/repositories/<entity>.repository.ts`: a interface.
4. `application/usecases/`: um arquivo por use case, cada um exportando `Input` e `Output` e com `execute()`.
5. `infrastructure/repositories/<entity>.repository.ts`: a implementação.
6. `infrastructure/http/controller/<entity>.controller.ts`: um controller por rota, com Zod e `registerPath`.
7. `infrastructure/http/routes/<entity>.routes.ts`: o router do módulo.
8. Montar o router em `common/infrastructure/http/routes.ts`.
9. Rodar `pnpm lint`, `pnpm format:check`, `pnpm build` e `pnpm test` na raiz.
10. Marcar o item no [api.md](../../specs/api.md) só com a rota e os testes dela passando.

## Comportamento da base

- Ordem dos middlewares em `app.ts`: `cors()`, `express.json()`, `/openapi.json` e `/docs`, `routes`, `errorHandler` (sempre por último).
- CORS liberado para qualquer origem (`cors()` sem opções).
- Rotas na raiz, sem prefixo `/api`.
- Erros: o `errorHandler` responde `{ code, message }` com o `statusCode` do `AppError`. Qualquer outro erro vira 500 com `internal_error` e uma mensagem genérica.

## Banco de dados (Prisma)

- Models: `Resume`, `Application` e `ApplicationEvent` (tabelas `resumes`, `applications` e `application_events`), mais os enums `Status`, `WorkModel` e `EventType`. Os campos usam os mesmos nomes (`snake_case`) do [domain.md](../../specs/domain.md). Excluir uma candidatura apaga seus eventos (`Cascade`); um currículo em uso não pode ser excluído (`Restrict`).
- Schema: `prisma/schema.prisma`; configuração do CLI: `prisma7.config.ts` (nome usado pelo Prisma 7.10+).
- Cliente gerado em `src/common/infrastructure/database/prisma/generated` (não versionado; gere com `pnpm exec prisma generate --config prisma7.config.ts`). Só `infrastructure` importa dele.
- Instância do cliente: `src/common/infrastructure/database/prisma/index.ts`, que exporta `prisma`.
- Conexão pela variável `DATABASE_URL` em `.env` (carregada com `dotenv`); exemplo versionado em `.env.example`.
- O Prisma 7 exige driver adapter e não gera o cliente automaticamente em `migrate dev`.

## Scripts

- `dev`: `tsx watch` no `server.ts`
- `build`: `tsc -p tsconfig.json` (saída em `dist/`)
- `start`: roda `dist/common/infrastructure/http/server.js`
- `lint`: `eslint .`

## Ainda não definido

Decisões que o código existente não responde. Não decida sozinho: pergunte.

- Framework de testes (o `pnpm test` ainda não tem o que rodar na API).
- Como um repositório com Prisma recebe o cliente (importar `prisma` direto ou receber por construtor).
- Como devolver ao cliente quais campos falharam na validação do Zod (hoje o erro tem só `code` e `message`).
