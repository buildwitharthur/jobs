# Domínio — Models e Interfaces

Models e interfaces do app de controle de candidaturas (ver [overview.md](overview.md) e [api.md](api.md)). Os tipos estão escritos em notação TypeScript só para descrevê-los com precisão; isso não define a stack. Os nomes dos campos seguem o JSON da API (`snake_case`).

## Visão geral

```
Resume 1 ──── 0..N Application 1 ──── 1..N ApplicationEvent
```

- Uma **Application** (candidatura) usa no máximo um **Resume** (currículo); um currículo pode ser usado por várias candidaturas.
- Uma **Application** tem um ou mais **ApplicationEvent** (histórico). O primeiro é sempre o evento `created`.
- **Status** é uma lista fixa definida no código, não é tabela editável.

---

## Tipos auxiliares

```ts
/** ID numérico gerado pelo banco. */
type ID = number;

/** Data no formato ISO 8601, sem hora. Ex.: "2026-11-02" */
type ISODate = string;

/** Data/hora no formato ISO 8601, em UTC. Ex.: "2026-11-02T14:30:00Z" */
type ISODateTime = string;
```

## Enums

### Status

```ts
type Status =
  | "applied"         // Inscrito
  | "screening"       // Em análise / Triagem
  | "interview"       // Entrevista
  | "technical_test"  // Teste técnico / Case
  | "offer"           // Proposta
  | "accepted"        // Aprovado / Aceito
  | "rejected"        // Reprovado
  | "withdrawn"       // Desisti
  | "no_response";    // Sem retorno

type StatusType = "active" | "closed";

interface StatusDefinition {
  value: Status;
  label: string;
  type: StatusType;
}
```

Lista fixa, na ordem das colunas do kanban:

```ts
const STATUSES: StatusDefinition[] = [
  { value: "applied",        label: "Inscrito",             type: "active" },
  { value: "screening",      label: "Em análise / Triagem", type: "active" },
  { value: "interview",      label: "Entrevista",           type: "active" },
  { value: "technical_test", label: "Teste técnico / Case", type: "active" },
  { value: "offer",          label: "Proposta",             type: "active" },
  { value: "accepted",       label: "Aprovado / Aceito",    type: "closed" },
  { value: "rejected",       label: "Reprovado",            type: "closed" },
  { value: "withdrawn",      label: "Desisti",              type: "closed" },
  { value: "no_response",    label: "Sem retorno",          type: "closed" },
];
```

### WorkModel

```ts
type WorkModel = "remote" | "hybrid" | "onsite";
```

### EventType

```ts
type EventType =
  | "created"        // gerado automaticamente na criação da candidatura
  | "status_change"  // gerado automaticamente na mudança de status
  | "note";          // registrado manualmente (entrevista marcada, feedback etc.)
```

---

## Models (persistidos)

### Application — Candidatura

```ts
interface Application {
  id: ID;
  company: string;              // obrigatório, não vazio
  role: string;                 // obrigatório, não vazio
  job_url: string | null;
  source: string | null;        // LinkedIn, site da empresa, indicação...
  applied_at: ISODate;          // padrão: hoje
  status: Status;               // padrão: "applied"
  resume_id: ID | null;         // FK → Resume.id
  salary: string | null;        // texto livre (faixa ou pretensão)
  work_model: WorkModel | null;
  location: string | null;
  contacts: string | null;      // texto livre (recrutador, e-mail etc.)
  notes: string | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}
```

**Regras:**

- `company` e `role` são obrigatórios e não podem ser vazios nem só espaços.
- `status` só muda pela operação de mudança de status, que sempre gera um `ApplicationEvent` do tipo `status_change`. A edição comum não altera o status.
- Qualquer status pode ir para qualquer outro.
- `updated_at` muda quando a candidatura é editada, quando o status muda e quando um evento é adicionado.
- Ao excluir uma candidatura, todos os seus eventos são excluídos junto. O currículo vinculado não é afetado.

### ApplicationEvent — Evento do histórico

```ts
interface ApplicationEvent {
  id: ID;
  application_id: ID;           // FK → Application.id
  type: EventType;
  from_status: Status | null;   // só em "status_change"
  to_status: Status | null;     // em "status_change" e "created"
  note: string | null;          // obrigatório em "note"
  occurred_at: ISODateTime;     // quando aconteceu; padrão: agora
  created_at: ISODateTime;      // quando foi registrado
}
```

**Regras por tipo:**

| `type` | `from_status` | `to_status` | `note` | Criado por |
| ------ | ------------- | ----------- | ------ | ---------- |
| `created` | `null` | status inicial | opcional | sistema, na criação |
| `status_change` | status anterior | novo status | opcional | sistema, na mudança de status |
| `note` | `null` | `null` | obrigatório | usuário |

- `type`, `from_status` e `to_status` nunca são editados depois de criados; só `note` e `occurred_at`.
- `occurred_at` pode ser no passado (registro retroativo).
- O evento `created` não pode ser excluído.
- Excluir um `status_change` não altera o status atual da candidatura.
- Mudar para o mesmo status atual não gera evento.

### Resume — Currículo

```ts
interface Resume {
  id: ID;
  name: string;                 // obrigatório, não vazio. Ex.: "Backend Sênior"
  description: string | null;
  file_name: string;            // nome original do arquivo enviado
  file_path: string;            // caminho interno na pasta do projeto (não exposto na API)
  created_at: ISODateTime;
  updated_at: ISODateTime;
}
```

**Regras:**

- O arquivo precisa ser PDF.
- O PDF fica numa pasta dentro do projeto (ex.: `storage/resumes/`), com um nome único gerado pelo app, para que dois uploads com o mesmo nome não se sobrescrevam.
- Substituir o PDF apaga o arquivo antigo e mantém os vínculos com as candidaturas.
- Um currículo vinculado a alguma candidatura não pode ser excluído.
- Excluir um currículo apaga o PDF do disco.

---

## Interfaces de entrada (inputs)

### Candidaturas

```ts
interface CreateApplicationInput {
  company: string;
  role: string;
  job_url?: string | null;
  source?: string | null;
  applied_at?: ISODate;         // padrão: hoje
  status?: Status;              // padrão: "applied"
  resume_id?: ID | null;
  salary?: string | null;
  work_model?: WorkModel | null;
  location?: string | null;
  contacts?: string | null;
  notes?: string | null;
}

/** Edição parcial. Não aceita `status`. */
type UpdateApplicationInput = Partial<Omit<CreateApplicationInput, "status">>;

interface ChangeStatusInput {
  status: Status;
  note?: string | null;
  occurred_at?: ISODateTime;    // padrão: agora
}

type SortField = "applied_at" | "updated_at" | "company";

interface ApplicationFilters {
  status?: Status[];
  q?: string;                   // busca em company e role, sem diferenciar maiúsculas
  from?: ISODate;               // applied_at >= from
  to?: ISODate;                 // applied_at <= to
  resume_id?: ID;
  sort?: SortField | `-${SortField}`; // padrão: "-applied_at"
}

/** Filtros aceitos pelo kanban (sem status e sem ordenação). */
type BoardFilters = Omit<ApplicationFilters, "status" | "sort">;
```

### Eventos

```ts
interface CreateEventInput {
  note: string;
  occurred_at?: ISODateTime;    // padrão: agora
}

interface UpdateEventInput {
  note?: string | null;
  occurred_at?: ISODateTime;
}
```

### Currículos

```ts
interface CreateResumeInput {
  name: string;
  description?: string | null;
  file: File;                   // PDF, enviado via multipart/form-data
}

interface UpdateResumeInput {
  name?: string;
  description?: string | null;
}

interface ReplaceResumeFileInput {
  file: File;                   // PDF
}
```

---

## Interfaces de saída (views)

### Currículo

```ts
/** Resume como é exposto pela API. */
interface ResumeView extends Omit<Resume, "file_path"> {
  file_url: string;             // "/resumes/:id/file"
  applications_count: number;
}

/** Versão resumida, usada dentro de outras respostas. */
interface ResumeSummary {
  id: ID;
  name: string;
  file_url: string;
}
```

### Candidatura

```ts
/** Detalhe da candidatura com currículo e histórico. */
interface ApplicationDetail extends Omit<Application, "resume_id"> {
  resume: ResumeSummary | null;
  events: ApplicationEvent[];   // ordenados por occurred_at, mais recente primeiro
}

interface ChangeStatusResult {
  application: Application;
  event: ApplicationEvent | null; // null quando o status não mudou
}
```

### Kanban

```ts
interface BoardCard {
  id: ID;
  company: string;
  role: string;
  applied_at: ISODate;
  work_model: WorkModel | null;
  resume_name: string | null;
  last_event_at: ISODateTime;   // occurred_at do evento mais recente
}

interface BoardColumn {
  status: Status;
  label: string;
  count: number;
  cards: BoardCard[];           // ordenados por last_event_at, mais recente primeiro
}

interface Board {
  columns: BoardColumn[];       // sempre as 9 colunas, na ordem de STATUSES
}
```

### Painel

```ts
interface RecentEvent {
  id: ID;
  application_id: ID;
  company: string;
  role: string;
  type: EventType;
  to_status: Status | null;
  occurred_at: ISODateTime;
}

interface Dashboard {
  total: number;
  active: number;               // soma dos status com type "active"
  closed: number;               // soma dos status com type "closed"
  by_status: Record<Status, number>; // sempre os 9 status, inclusive os zerados
  applied_last_30_days: number;
  recent_events: RecentEvent[]; // os 10 mais recentes
}
```

### Erro

```ts
type ErrorCode =
  | "validation_error"
  | "not_found"
  | "conflict"
  | "bad_request"      // padrão de AppError quando nenhum código é informado
  | "internal_error";  // erro inesperado (500)

interface ApiError {
  code: ErrorCode;
  message: string;
  /** Só em erros de validação: campo (`body.x`, `params.x`, `query.x`) → mensagem. */
  details?: Record<string, string>;
}
```
