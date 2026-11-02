# AGENTS.md — Web (`apps/web`)

Interface do painel de candidaturas. Vale junto com o [AGENTS.md](../../AGENTS.md) da raiz: leia a documentação em [specs/](../../specs/) antes de qualquer decisão e nunca presuma nada.

**O [protótipo](../../specs/design/prototype/index.html) é a fonte da verdade da interface.** Telas, componentes, textos, placeholders, ícones, cores e interações devem ficar iguais aos dele. O [ui.md](../../specs/design/ui.md) e o [design.md](../../specs/design/design.md) explicam as decisões. Os dados vêm da API (ver [api.md](../../specs/api.md)).

## Tecnologias

- React 19 com TypeScript
- Vite 8 (`vite.config.ts`)
- TanStack Router, só o router (sem TanStack Start), com rotas em arquivos e `autoCodeSplitting`
- Tailwind CSS v4 (`@tailwindcss/vite`), com os tokens do design system
- TanStack Query 5 para buscar e guardar em cache os dados da API
- `tailwind-merge` e `tailwind-variants` para montar as classes dos componentes
- Sonner para os avisos (toasts)
- React Hook Form com Zod (`@hookform/resolvers`) para os formulários
- Axios para as chamadas à API, com os tipos gerados pelo `openapi-typescript` (só os tipos e os `paths`; o `openapi-fetch` não é usado)
- Fonte Inter (Google Fonts, carregada no `index.html`)

Não troque nem acrescente tecnologias sem confirmação.

## Estrutura

```
apps/web/
├── index.html               # HTML de entrada: tema, favicon, manifest, fonte
├── public/                  # arquivos servidos na raiz (/favicon.svg, /logo.svg...)
│   ├── favicon.svg
│   ├── icon-maskable.svg
│   ├── logo.svg / logo-on-dark.svg / logo-mark.svg / logo-mark-mono.svg
│   └── site.webmanifest
├── src/
│   ├── main.tsx             # cria o router e monta o app
│   ├── common/              # o que é compartilhado por todos os módulos
│   │   ├── providers/       # query.provider.tsx (TanStack Query), toast.provider.tsx (Sonner)
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── layouts/
│   │   ├── lib/             # api-client.ts (axios) e api-schema.d.ts (tipos gerados da API)
│   │   └── utils/           # cn.ts (cn e tv)
│   ├── modules/             # um módulo por área do app, como no ui.md
│   │   ├── applications/    # Candidaturas: kanban, lista, detalhe e nova candidatura
│   │   ├── resumes/         # Currículos
│   │   └── dashboard/       # Painel
│   │       # cada módulo tem: http/, hooks/, schemas/, screens/, components/, utils/
│   ├── styles.css           # Tailwind + design tokens (temas escuro e claro)
│   ├── routes/              # uma rota por arquivo (TanStack Router)
│   │   ├── __root.tsx       # layout raiz (<Outlet />) e devtools em desenvolvimento
│   │   └── index.tsx        # rota "/"
│   └── routeTree.gen.ts     # GERADO pelo plugin do router: não edite
└── vite.config.ts
```

- Os módulos seguem os do [ui.md](../../specs/design/ui.md) e usam os mesmos nomes dos módulos da API.

### Pastas de cada módulo (`src/modules/<module>/`)

| Pasta          | Função                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| `http/`        | Chamadas à API usadas pelo módulo, um arquivo por chamada (ver "Chamadas à API") |
| `hooks/`       | Hooks React do módulo: consultas e formulários (ver "Hooks de consulta" e "Formulários") |
| `schemas/`     | Schemas do Zod dos formulários e os tipos deles (`z.infer`)            |
| `screens/`     | As telas do módulo, ligadas às rotas de `src/routes/`                  |
| `components/`  | Componentes usados só por este módulo                                  |
| `utils/`       | Funções auxiliares do módulo                                           |

### Pastas de `src/common/`

| Pasta                   | Função                                                                       |
| ----------------------- | ---------------------------------------------------------------------------- |
| `providers/`            | Providers React usados pelo app inteiro                                      |
| `components/ui/`        | Componentes base do design system, usados por todos os módulos (botão, campo, selo de status...) |
| `components/layouts/`   | Estruturas de página compartilhadas (menu lateral, cabeçalho de tela...)     |
| `lib/`                  | Configuração de bibliotecas externas usadas pelo app inteiro (cliente da API) |
| `utils/`                | Funções auxiliares usadas por mais de um módulo                              |

Algo só vai para `common/` quando é usado por mais de um módulo; enquanto for de um módulo só, fica no módulo.

- Os arquivos de `public/` são cópias de [specs/design/assets](../../specs/design/assets/). Se um asset mudar lá, copie de novo para cá.
- O `routeTree.gen.ts` é gerado ao rodar `dev` ou `build`. Ele fica fora do ESLint e do Prettier.

## Rotas

Todas as rotas do app (o detalhe da candidatura e o modal de nova candidatura não têm rota: o detalhe é o parâmetro `?application=<id>`):

| Caminho          | Arquivo                      | Tela                                    |
| ---------------- | ---------------------------- | --------------------------------------- |
| `/`              | `routes/index.tsx`           | Redireciona para `/candidaturas`        |
| `/candidaturas`  | `routes/candidaturas.tsx`    | `ApplicationsScreen` (kanban e lista)   |
| `/curriculos`    | `routes/curriculos.tsx`      | `ResumesScreen`                         |
| `/painel`        | `routes/painel.tsx`          | `DashboardScreen`                       |
| qualquer outro   | `routes/__root.tsx`          | Redireciona para `/candidaturas`        |

Os parâmetros de URL (filtros, visualização, painel de detalhe) estão em [ui.md](../../specs/design/ui.md#navegação). As rotas ainda não validam nenhum parâmetro.

### Padrão: uma tela por página

- Cada página é um componente em `src/modules/<module>/screens/<pagina>.screen.tsx` (ex.: `applications.screen.tsx` exporta `ApplicationsScreen`).
- O arquivo de rota **só importa a tela e a usa como `component`**. Ele não tem JSX nem lógica de tela.

```tsx
// src/routes/candidaturas.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsScreen } from "../modules/applications/screens/applications.screen";

export const Route = createFileRoute("/candidaturas")({
  component: ApplicationsScreen,
});
```

### Regras das rotas

- Cada arquivo em `src/routes/` é uma rota, criada com `createFileRoute("/caminho")`. O plugin do Vite atualiza o `routeTree.gen.ts` sozinho.
- No `vite.config.ts`, o `tanstackRouter()` vem **antes** do `react()`, como manda a documentação oficial.
- O router é registrado em `main.tsx` (`declare module "@tanstack/react-router"`), para `Link`, `navigate` e parâmetros terem tipos.

## Providers

Os providers ficam em `src/common/providers/` e envolvem o app em `main.tsx`, nesta ordem (de fora para dentro): `QueryProvider` → `ToastProvider` → `App` (que renderiza o `RouterProvider`).

### TanStack Query (`query.provider.tsx`)

O `QueryProvider` cria o `QueryClient` com `useState` (uma vez por montagem do provider) e mostra o devtools só em desenvolvimento. O cache foi ajustado para este app (uma pessoa só, poucos dados, e quem altera os dados é o próprio app):

| Opção                        | Valor      | Padrão do Query | Por quê                                                                 |
| ---------------------------- | ---------- | --------------- | ----------------------------------------------------------------------- |
| `queries.staleTime`          | 1 minuto   | 0               | Navegar entre telas e reabrir o detalhe usa o cache, sem chamar a API   |
| `queries.gcTime`             | 10 minutos | 5 minutos       | Voltar a uma tela já vista é instantâneo                                |
| `queries.refetchOnWindowFocus` | `false`  | `true`          | Os dados só mudam por ações deste app, que invalidam o cache            |
| `queries.retry`              | 1          | 3               | Se a API caiu, o erro aparece sem esperar 3 tentativas                  |
| `mutations.retry`            | 0          | 0               | Criar, editar e excluir não se repetem sozinhos                         |

### O queryClient no contexto do router

O `queryClient` também está no **contexto do router**, para os `loader` das rotas usarem o mesmo cache das telas:

- `routes/__root.tsx` usa `createRootRouteWithContext<RouterContext>()`, com `RouterContext = { queryClient: QueryClient }`. Por isso `context.queryClient` tem tipo em todo `loader`.
- `main.tsx` cria o router com `context: { queryClient: undefined! }` (só um espaço reservado) e o componente `App`, que fica dentro do `QueryProvider`, injeta o cliente real: `<RouterProvider router={router} context={{ queryClient }} />`. É o padrão da documentação do TanStack Router para valores que vêm de hooks.

```tsx
// src/routes/candidaturas.tsx (exemplo de uso no loader)
export const Route = createFileRoute("/candidaturas")({
  loader: ({ context }) => context.queryClient.ensureQueryData(applicationsQueryOptions),
  component: ApplicationsScreen,
});
```

Os `queryOptions` de cada módulo ficam em `modules/<module>/http/`, para o `loader` e a tela usarem exatamente a mesma chave de cache.

### Avisos (`toast.provider.tsx`)

O `ToastProvider` renderiza o `Toaster` do Sonner no visual do design system (canto inferior direito, 5 segundos, ícone colorido por tipo, tema escuro e claro pelos tokens). Para mostrar um aviso, em qualquer lugar: `import { toast } from "sonner"` e `toast.success("...")`, `toast.error("...")`, `toast.warning("...")` ou `toast.info("...", { action: { label: "Desfazer", onClick } })`.

## API: tipos e cliente HTTP

### Tipos gerados do `openapi.json`

Os tipos das rotas da API são gerados do `openapi.json` que a própria API publica (`GET /openapi.json`), com o [openapi-typescript](https://openapi-ts.dev), só como geração de código: ele cria o arquivo `src/common/lib/api-schema.d.ts` com os tipos `paths` e `components`. Esse arquivo é **gerado: não edite** (fica fora do ESLint e do Prettier).

Para regenerar depois de mudar a API, com a API rodando em `http://localhost:3000`:

```bash
pnpm --filter @job/web generate:api
```

Para usar os tipos:

```ts
import type { paths } from "../common/lib/api-schema";

// Resposta 200 de GET /applications
type ListApplicationsResponse =
  paths["/applications"]["get"]["responses"][200]["content"]["application/json"];

// Query de GET /applications
type ListApplicationsQuery = NonNullable<paths["/applications"]["get"]["parameters"]["query"]>;

// Corpo de POST /applications
type CreateApplicationBody = NonNullable<
  paths["/applications"]["post"]["requestBody"]
>["content"]["application/json"];
```

O `openapi.json` só documenta as respostas de sucesso com corpo; as respostas de erro (400, 404, 409) aparecem sem tipo. O formato do erro é o do [api.md](../../specs/api.md): `{ code, message, details? }`.

### Cliente (`src/common/lib/api-client.ts`)

O `apiClient` é uma instância do axios, básica, com `baseURL` vinda de `VITE_API_URL` (padrão `http://localhost:3000`; veja `.env.example`) e **um único interceptor de resposta que rejeita os erros** (`Promise.reject`). Assim todo erro cai no `onError` das mutations e no `error` das queries do TanStack Query. O erro é o `AxiosError` do axios: o corpo da API está em `error.response.data`.

```ts
const { mutate } = useMutation({
  mutationFn: (body: CreateApplicationBody) => apiClient.post("/applications", body),
  onError: (error) => {
    // axios.isAxiosError(error) → error.response?.data.code / .message / .details
  },
});
```

As chamadas ficam em `modules/<module>/http/`, não nas telas.

### Chamadas à API (`modules/<module>/http/`)

Cada chamada à API é **um arquivo**, em `modules/<module>/http/<verbo>-<entidade>.http.ts` (ex.: `list-applications.http.ts`), que usa o `apiClient` e os tipos de `api-schema.d.ts`. Cada arquivo exporta:

- a **função** da chamada, no formato `<verbo><Entidade>` (`listApplications`), que devolve só o corpo da resposta (`data`);
- os **tipos** dela, derivados do `api-schema.d.ts`: `<Nome>Query`, `<Nome>Body`, `<Nome>Response` e `<Nome>Variables` (quando existem).

```ts
// modules/applications/http/list-applications.http.ts
type Operation = paths["/applications"]["get"];

export type ListApplicationsQuery = NonNullable<Operation["parameters"]["query"]>;
export type ListApplicationsResponse = Operation["responses"][200]["content"]["application/json"];

export const listApplications = async (query?: ListApplicationsQuery) => {
  const { data } = await apiClient.get<ListApplicationsResponse>("/applications", { params: query });
  return data;
};
```

Regras:

- **Consultas** (GET) recebem os parâmetros diretamente: `getApplication(id)`, `listApplications(query)`.
- **Mutações** (POST, PATCH, PUT, DELETE) recebem **um único argumento**, que é o que o `mutationFn` do TanStack Query entrega: o corpo (`createApplication(body)`), o `id` (`deleteApplication(id)`) ou um objeto `Variables` quando há `id` e corpo (`updateApplication({ id, body })`, `updateEvent({ applicationId, eventId, body })`).
- Upload de arquivo (`createResume`, `replaceResumeFile`) recebe um `File` e monta o `FormData`. O OpenAPI descreve o arquivo como `string`; o tipo da função usa `File`.
- As funções **não tratam erro**: o interceptor do `apiClient` já rejeita, e o erro (`AxiosError`, com o corpo da API em `error.response.data`) sobe para o `onError` da mutation ou o `error` da query.
- Chamada usada por mais de um módulo fica **uma vez só**, no módulo do recurso, e os outros a importam: `getStatuses` fica em `applications/http` (o painel também a usa) e `listResumes` em `resumes/http` (os filtros e seletores de currículo das candidaturas também a usam).
- Abrir o PDF de um currículo não é uma chamada do axios: `getResumeFileUrl(id)` só monta o endereço (`GET /resumes/:id/file`) com a `baseURL` do `apiClient`, para o navegador abrir.

Chamadas existentes (as que o [ui.md](../../specs/design/ui.md) usa):

| Módulo         | Arquivos em `http/`                                                                                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `applications` | `get-board`, `list-applications`, `get-application`, `create-application`, `update-application`, `change-application-status`, `delete-application`, `create-event`, `update-event`, `delete-event`, `get-statuses` |
| `resumes`      | `list-resumes`, `create-resume`, `update-resume`, `replace-resume-file`, `list-resume-applications`, `delete-resume`, `get-resume-file-url`                                                                         |
| `dashboard`    | `get-dashboard`                                                                                                                                                                                                  |

Rotas da API que o `ui.md` não usa ficaram de fora: `GET /applications/:id/events` (o detalhe da candidatura já traz o histórico) e `GET /resumes/:id`.

### Hooks de consulta (`modules/<module>/hooks/`)

Cada consulta (GET) tem **um hook**, em `modules/<module>/hooks/use-<nome>.ts`, que embrulha a chamada de `http/` com o `useQuery`. O arquivo exporta o hook e a **`queryKey`** dele, juntos:

```ts
// modules/applications/hooks/use-applications.ts
export const applicationsQueryKey = (query?: ListApplicationsQuery) =>
  ["applications", "list", query] as const;

export const useApplications = (query?: ListApplicationsQuery) =>
  useQuery({
    queryKey: applicationsQueryKey(query),
    queryFn: () => listApplications(query),
  });
```

Regras:

- O hook é o mais simples possível: `queryKey` e `queryFn`, sem opções extras, e devolve o resultado do `useQuery` como está. Só há duas exceções: `useStatuses` tem `staleTime: Infinity` (a lista de status é fixa no código da API) e `useApplication` e `useResumeApplications` só buscam quando recebem um `id` (`enabled`).
- A `queryKey` é uma função (`<nome>QueryKey(...)`) exportada para quem precisar invalidar ou ler o cache. Os parâmetros da consulta fazem parte da chave.
- As chaves começam pelo recurso, do mais geral ao mais específico: `["applications", "list", query]`, `["applications", "detail", id]`, `["resumes", "list"]`, `["resumes", "applications", id]`. Assim invalidar `["applications"]` atinge a lista e os detalhes.
- Hook usado por mais de um módulo fica uma vez só, no módulo do recurso (como as chamadas): `useStatuses` em `applications` (o painel também o usa) e `useResumes` em `resumes`.
- **Só consultas por enquanto**: as mutações (`useMutation`) ainda não foram escritas.

| Hook                       | Chamada                | `queryKey`                              | Módulo         |
| -------------------------- | ---------------------- | --------------------------------------- | -------------- |
| `useBoard(query?)`         | `getBoard`             | `["board", query]`                      | `applications` |
| `useApplications(query?)`  | `listApplications`     | `["applications", "list", query]`       | `applications` |
| `useApplication(id)`       | `getApplication`       | `["applications", "detail", id]`        | `applications` |
| `useStatuses()`            | `getStatuses`          | `["statuses"]`                          | `applications` |
| `useResumes()`             | `listResumes`          | `["resumes", "list"]`                   | `resumes`      |
| `useResumeApplications(id)`| `listResumeApplications` | `["resumes", "applications", id]`     | `resumes`      |
| `useDashboard()`           | `getDashboard`         | `["dashboard"]`                         | `dashboard`    |

## Formulários

Toda a lógica de um formulário fica dentro de **um hook**, em `modules/<module>/hooks/use-<nome>-form.ts`. O componente só usa o que o hook devolve. Os schemas do Zod ficam em `modules/<module>/schemas/`.

### Schemas (`modules/<module>/schemas/<nome>.schema.ts`)

Cada formulário tem um arquivo com o **schema do Zod** e o **tipo** dele com `z.infer`, os dois exportados. Os valores dos campos são sempre texto, como nos `<input>`; a conversão para o corpo da API (texto vazio vira `null`, `resume_id` vira número) é feita no hook.

```ts
// modules/applications/schemas/create-event.schema.ts
export const createEventSchema = z.object({
  note: z.string().trim().min(1, "Escreva a nota."),
  occurred_at: z.string(),
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;
```

O Zod só é importado dentro de `schemas/`; os hooks importam o schema e o tipo de lá.

### Hooks de formulário

O hook junta o `useForm` (com `zodResolver`) e o `useMutation`, e devolve **tudo do React Hook Form** (`register`, `control`, `formState`, `setValue`, `reset`...) mais:

- `submit`: o `handleSubmit` já ligado à mutation, com `mutateAsync`. É o que vai no `onSubmit` do `<form>` (`<form onSubmit={submit}>`).
- `isPending`: a mutation está em andamento (para desabilitar o botão e mostrar carregamento).

```tsx
const form = useCreateEventForm(applicationId);

<form onSubmit={form.submit}>
  <input {...form.register("note")} placeholder="Adicionar nota" />
  {form.formState.errors.note && <span>{form.formState.errors.note.message}</span>}
  <button disabled={form.isPending}>Salvar</button>
</form>
```

Regras:

- **Erros de validação dos campos** vêm do `formState.errors`, do schema do Zod. Os erros da **API** não vão para os campos: caem no `onError` da mutation, que mostra um **toast de erro** com a mensagem da API (`handleMutationError`, em `common/utils/api-error.ts`).
- O **`onSuccess`** de cada mutation já está configurado, mas **ainda sem ação** (só um comentário do que virá: atualizar o cache, fechar o modal, limpar o campo, avisar).
- Um `submit` que falha na API não gera erro não tratado: `createSubmit` (`common/utils/submit.ts`) engole o erro repassado pelo `handleSubmit`, que já foi tratado no `onError`.
- **Edição no lugar** (`useUpdateApplicationForm`, `useUpdateResumeForm`): em vez de `submit`, devolvem `saveField(nome)`, que valida e salva **um campo**, só se ele mudou, e se a validação passar. Quem chama é o componente, ao sair do campo (`onBlur`) ou com `Enter`. O hook guarda o último valor salvo de cada campo.
- Funções que montam valores e corpos da requisição (`toApplicationBody`, `applicationFormDefaults`...) ficam em `utils/application-form.ts`.

| Hook                                | Formulário                                         | Mutation          | Módulo         |
| ----------------------------------- | -------------------------------------------------- | ----------------- | -------------- |
| `useCreateApplicationForm()`        | Nova candidatura (modal)                           | `createApplication` | `applications` |
| `useQuickCreateApplicationForm(status)` | "+" da coluna do kanban (empresa e cargo)      | `createApplication` | `applications` |
| `useUpdateApplicationForm(application)` | Edição no lugar no painel de detalhe (`saveField`) | `updateApplication` | `applications` |
| `useCreateEventForm(applicationId)` | "Adicionar nota" do histórico                      | `createEvent`     | `applications` |
| `useUpdateEventForm(applicationId, event)` | Editar nota e data de um evento             | `updateEvent`     | `applications` |
| `useCreateResumeForm()`             | Novo currículo (nome, descrição e PDF)             | `createResume`    | `resumes`      |
| `useUpdateResumeForm(resume)`       | Edição no lugar do nome e da descrição (`saveField`) | `updateResume`    | `resumes`      |

Ainda **sem** hook de mutação ou formulário: mudar o status (arrastar o card e o seletor do painel), excluir (candidatura, evento, currículo) e trocar o PDF de um currículo. Não têm campos de formulário e entram quando forem pedidos.

## Componentes: `cn` e `tv`

As classes dos componentes são montadas com `tailwind-merge` e `tailwind-variants`, pelo arquivo `src/common/utils/cn.ts`:

- **`cn(...classes)`**: junta classes resolvendo conflitos (a última vence): `cn("p-md", "p-xl")` vira `p-xl`. Use para classes condicionais e para aceitar `className` de fora.
- **`tv({ base, variants, defaultVariants })`**: define as variantes de um componente. Passar `class` na chamada também resolve conflitos.
- **`VariantProps`**: tipo para as props de variante do componente.

```tsx
// src/common/components/ui/button.tsx
import { cn, tv, type VariantProps } from "../../utils/cn";

const button = tv({
  base: "inline-flex items-center justify-center rounded-md text-body font-medium",
  variants: {
    variant: {
      primary: "bg-primary text-on-primary hover:bg-primary-hover",
      ghost: "text-text-secondary hover:bg-surface-sunken",
    },
    size: { sm: "h-control-sm px-xs", md: "h-control-md px-sm" },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof button>;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}
```

O `tailwind-merge` não conhece as classes do nosso tema sozinho: sem configuração, `text-display` (tamanho) e `text-text-primary` (cor) seriam tratados como conflito e um apagaria o outro. Por isso o `cn.ts` registra todos os tokens do `styles.css`. **Quando criar um token novo em `styles.css`, acrescente-o também em `cn.ts`.**

## Design tokens no Tailwind

Os tokens do [design.md](../../specs/design/design.md) estão em `src/styles.css`:

- **Valores por tema** em variáveis `--ds-*`: tema escuro em `:root` (padrão) e tema claro em `:root[data-theme="light"]`.
- **`@theme inline`** expõe os tokens ao Tailwind com os mesmos nomes do design.md. As paletas, fontes, tamanhos, raios e sombras padrão do Tailwind foram removidos: só existem os do design system.

| Token do design.md             | Classe do Tailwind                                  |
| ------------------------------ | --------------------------------------------------- |
| `bg`, `surface`, `surface-sunken` | `bg-bg`, `bg-surface`, `bg-surface-sunken`       |
| `border`, `border-input`       | `border-border`, `border-border-input`              |
| `text-primary`, `text-secondary`, `text-muted` | `text-text-primary`, `text-text-secondary`, `text-text-muted` |
| `primary`, `primary-hover`     | `bg-primary`, `hover:bg-primary-hover`              |
| `primary-text` (links)         | `text-primary-text`                                 |
| `primary-subtle` + texto       | `bg-primary-subtle text-primary-subtle-text`        |
| `focus`                        | `ring-focus`, `outline-focus`                       |
| Feedback                       | `bg-danger-bg text-danger-text`, `bg-danger-solid text-on-danger`... |
| Status fixo                    | `bg-status-interview-bg text-status-interview-text` |
| Status dinâmico                | no elemento (ou ancestral) com `data-status="<value>"`: `bg-status-bg`, `text-status-text`, `bg-status-accent`, `border-status-accent` |
| Tipografia                     | `text-display`, `text-title`, `text-heading`, `text-body`, `text-caption`, `text-label`, `text-number` (já trazem altura de linha e peso) |
| Pesos                          | `font-regular`, `font-medium`, `font-semibold`      |
| Cantos                         | `rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full` |
| Sombras                        | `shadow-raised`, `shadow-dragging`, `shadow-overlay` |
| Espaçamento                    | `p-xxs` … `p-xxxl` (4px … 40px), além da escala de 4px do Tailwind (`p-1` = 4px) |
| Tamanhos                       | `h-control-sm`, `h-control-md`, `w-nav`, `w-drawer`, `max-w-modal`, `min-w-column-min`, `max-w-column-max`, `w-column-collapsed` |

Regras:

- Nunca use cor, tamanho de fonte ou sombra fora dessas classes; elas não existem no Tailwind deste app de propósito.
- Para cor de status, prefira `data-status` + `bg-status-bg`/`text-status-text`/`bg-status-accent`: o componente fica igual para os 9 status.
- Movimento: as transições usam `var(--ds-motion-fast)`, `var(--ds-motion-base)` e `var(--ds-motion-slow)`.

## Tema

- O padrão é o escuro (`<html data-theme="dark">`).
- O tema claro é `data-theme="light"` no `<html>`, salvo no `localStorage` com a chave `candidaturas-theme`. Um script no `index.html` aplica o tema salvo antes da página aparecer, para não piscar.

## Scripts

- `dev`: `vite` (porta 5173)
- `build`: `vite build && tsc --noEmit`
- `preview`: serve o build
- `lint`: `eslint .`
