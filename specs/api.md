# API — Checklist de Rotas e Testes

Checklist das rotas da API do app de controle de candidaturas (ver [overview.md](overview.md)). Cada rota traz método, caminho, payload, resposta esperada e os testes que precisam passar. Marque cada item quando estiver implementado e testado.

## Convenções

- Sem prefixo: as rotas ficam na raiz (ex.: `/applications`)
- Corpo das requisições e respostas em JSON, exceto upload e download de currículo (`multipart/form-data` e `application/pdf`).
- Datas no formato ISO 8601 (`2026-11-02` para datas, `2026-11-02T14:30:00Z` para data/hora).
- Sem autenticação.
- Payloads (`body`) e parâmetros de query rejeitam campos desconhecidos com 400.
- Formato padrão de erro (tratado pelo `errorHandler` da API):

```json
{
  "code": "validation_error",
  "message": "Dados inválidos.",
  "details": { "body.company": "Entrada inválida: esperava um texto, recebeu um valor \"undefined\"" }
}
```

- `details` só aparece em erros de validação: mapeia cada campo que falhou (`body.<campo>`, `params.<campo>` ou `query.<campo>`) para a mensagem do erro.
- `code` identifica o tipo do erro (`validation_error`, `not_found`, `conflict`, `internal_error`). Erros de aplicação lançados sem código usam `bad_request`.
- Erros inesperados retornam 500 com `code` `internal_error` e uma mensagem genérica, sem expor detalhes internos.

| Código | Uso |
| ------ | --- |
| 200 | Sucesso com corpo |
| 201 | Recurso criado |
| 204 | Sucesso sem corpo (exclusão) |
| 400 | Payload ou parâmetros inválidos |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex.: excluir currículo em uso) |
| 500 | Erro interno inesperado |

### Status (lista fixa)

Os status são fixos e definem as colunas do kanban, nesta ordem:

| Valor | Rótulo | Tipo |
| ----- | ------ | ---- |
| `applied` | Inscrito | ativo |
| `screening` | Em análise / Triagem | ativo |
| `interview` | Entrevista | ativo |
| `technical_test` | Teste técnico / Case | ativo |
| `offer` | Proposta | ativo |
| `accepted` | Aprovado / Aceito | encerrado |
| `rejected` | Reprovado | encerrado |
| `withdrawn` | Desisti | encerrado |
| `no_response` | Sem retorno | encerrado |

Qualquer status pode mudar para qualquer outro (o kanban permite arrastar livremente).

### Objeto Candidatura

```json
{
  "id": 1,
  "company": "Acme",
  "role": "Desenvolvedor Backend Sênior",
  "job_url": "https://acme.com/vagas/123",
  "source": "LinkedIn",
  "applied_at": "2026-11-02",
  "status": "applied",
  "resume_id": 3,
  "salary": "R$ 15.000",
  "work_model": "remote",
  "location": "São Paulo, SP",
  "contacts": "Maria (recrutadora) — maria@acme.com",
  "notes": "Vaga indicada pelo João",
  "created_at": "2026-11-02T14:30:00Z",
  "updated_at": "2026-11-02T14:30:00Z"
}
```

- Obrigatórios: `company`, `role`.
- `applied_at`: se não for enviado, usa a data de hoje.
- `status`: se não for enviado na criação, usa `applied`.
- `work_model`: `remote`, `hybrid`, `onsite` ou `null`.
- `resume_id`: opcional; quando enviado, precisa existir.
- Demais campos opcionais (texto livre ou `null`).

### Objeto Evento (histórico)

```json
{
  "id": 10,
  "application_id": 1,
  "type": "status_change",
  "from_status": "applied",
  "to_status": "interview",
  "note": "Entrevista marcada para sexta",
  "occurred_at": "2026-11-05T10:00:00Z",
  "created_at": "2026-11-02T14:30:00Z"
}
```

- `type`: `created` (gerado na criação), `status_change` (gerado na mudança de status) ou `note` (evento manual: entrevista marcada, feedback etc.).
- `from_status` / `to_status`: preenchidos só em `status_change` (e `to_status` em `created`).

### Objeto Currículo

```json
{
  "id": 3,
  "name": "Backend Sênior",
  "description": "Foco em Node e arquitetura",
  "file_name": "backend-senior.pdf",
  "file_url": "/resumes/3/file",
  "applications_count": 4,
  "created_at": "2026-10-01T09:00:00Z",
  "updated_at": "2026-10-15T09:00:00Z"
}
```

- Os arquivos ficam numa pasta dentro do projeto (ex.: `storage/resumes/`).
- Só aceita PDF.

---

## Status

### [ ] `GET /statuses` — Listar status

Retorna a lista fixa de status, na ordem das colunas do kanban.

**Payload:** nenhum

**Resposta 200:**

```json
[
  { "value": "applied", "label": "Inscrito", "type": "active" },
  { "value": "screening", "label": "Em análise / Triagem", "type": "active" }
]
```

**Testes:**

- [ ] Retorna 200 com os 9 status.
- [ ] Os status vêm na ordem definida na tabela de status.
- [ ] Cada item tem `value`, `label` e `type` (`active` ou `closed`).

---

## Candidaturas

### [ ] `POST /applications` — Criar candidatura

**Payload:**

```json
{
  "company": "Acme",
  "role": "Desenvolvedor Backend Sênior",
  "job_url": "https://acme.com/vagas/123",
  "source": "LinkedIn",
  "applied_at": "2026-11-02",
  "status": "applied",
  "resume_id": 3,
  "salary": "R$ 15.000",
  "work_model": "remote",
  "location": "São Paulo, SP",
  "contacts": "Maria — maria@acme.com",
  "notes": "Vaga indicada pelo João"
}
```

**Resposta 201:** objeto Candidatura.

**Testes:**

- [ ] Cria com todos os campos e retorna 201 com o objeto completo, incluindo `id`, `created_at` e `updated_at`.
- [ ] Cria só com `company` e `role`; `status` fica `applied` e `applied_at` fica com a data de hoje.
- [ ] Gera um evento `created` no histórico, com `to_status` igual ao status inicial.
- [ ] Retorna 400 sem `company`.
- [ ] Retorna 400 sem `role`.
- [ ] Retorna 400 com `company` ou `role` vazios (só espaços).
- [ ] Retorna 400 com `status` fora da lista fixa.
- [ ] Retorna 400 com `work_model` fora de `remote`, `hybrid`, `onsite`.
- [ ] Retorna 400 com `applied_at` em formato inválido.
- [ ] Retorna 400 com `resume_id` de currículo que não existe.
- [ ] Retorna 400 com campos desconhecidos no payload.

### [ ] `GET /applications` — Listar candidaturas

**Parâmetros de query (todos opcionais):**

| Parâmetro | Exemplo | Descrição |
| --------- | ------- | --------- |
| `status` | `status=interview,offer` | Filtra por um ou mais status |
| `q` | `q=acme` | Busca por texto em `company` e `role` (sem diferenciar maiúsculas) |
| `from` | `from=2026-10-01` | `applied_at` maior ou igual |
| `to` | `to=2026-10-31` | `applied_at` menor ou igual |
| `resume_id` | `resume_id=3` | Candidaturas que usaram esse currículo |
| `sort` | `sort=-applied_at` | Ordenação por `applied_at`, `updated_at` ou `company`; `-` para decrescente. Padrão: `-applied_at` |

**Payload:** nenhum

**Resposta 200:** lista de objetos Candidatura.

**Testes:**

- [ ] Retorna 200 com lista vazia quando não há candidaturas.
- [ ] Retorna todas as candidaturas sem filtros, ordenadas por `applied_at` decrescente.
- [ ] Filtra por um status.
- [ ] Filtra por vários status separados por vírgula.
- [ ] Busca `q` encontra por empresa e por cargo, sem diferenciar maiúsculas de minúsculas.
- [ ] Filtra pelo intervalo `from` / `to`, incluindo as datas das pontas.
- [ ] Filtra por `resume_id`.
- [ ] Combina filtros (ex.: `status` + `q`).
- [ ] Respeita `sort` crescente e decrescente para cada campo permitido.
- [ ] Retorna 400 com `status` inválido no filtro.
- [ ] Retorna 400 com `from` / `to` em formato inválido.
- [ ] Retorna 400 com `sort` em campo não permitido.

### [ ] `GET /applications/:id` — Detalhar candidatura

Retorna a candidatura com o currículo usado e o histórico completo, para a tela de detalhes.

**Payload:** nenhum

**Resposta 200:**

```json
{
  "id": 1,
  "company": "Acme",
  "role": "Desenvolvedor Backend Sênior",
  "status": "interview",
  "resume": { "id": 3, "name": "Backend Sênior", "file_url": "/resumes/3/file" },
  "events": [
    { "id": 11, "type": "status_change", "from_status": "applied", "to_status": "interview", "note": null, "occurred_at": "2026-11-05T10:00:00Z" },
    { "id": 10, "type": "created", "from_status": null, "to_status": "applied", "note": null, "occurred_at": "2026-11-02T14:30:00Z" }
  ]
}
```

(Demais campos do objeto Candidatura omitidos no exemplo.)

**Testes:**

- [ ] Retorna 200 com todos os campos da candidatura.
- [ ] Inclui `resume` com `id`, `name` e `file_url` quando há currículo vinculado.
- [ ] `resume` vem `null` quando não há currículo vinculado.
- [ ] Inclui `events` ordenados por `occurred_at` decrescente (mais recente primeiro).
- [ ] Retorna 404 para `id` inexistente.
- [ ] Retorna 400 (ou 404) para `id` não numérico.

### [ ] `PATCH /applications/:id` — Editar candidatura

Atualiza parcialmente os dados da candidatura. **Não altera o status**; para isso use `PATCH /applications/:id/status`.

**Payload (qualquer subconjunto dos campos):**

```json
{
  "salary": "R$ 17.000",
  "resume_id": 4,
  "notes": "Recrutadora pediu pretensão atualizada"
}
```

**Resposta 200:** objeto Candidatura atualizado.

**Testes:**

- [ ] Atualiza só os campos enviados e mantém os demais.
- [ ] Atualiza `updated_at`.
- [ ] Permite limpar campos opcionais enviando `null`.
- [ ] Permite trocar e remover (`null`) o `resume_id`.
- [ ] Não gera evento no histórico.
- [ ] Retorna 400 se `status` vier no payload.
- [ ] Retorna 400 ao tentar deixar `company` ou `role` vazios ou `null`.
- [ ] Retorna 400 com `work_model` inválido.
- [ ] Retorna 400 com `applied_at` inválido.
- [ ] Retorna 400 com `resume_id` inexistente.
- [ ] Retorna 404 para `id` inexistente.

### [ ] `PATCH /applications/:id/status` — Mudar status

Usada pelo kanban ao arrastar um card e pela tela de detalhes. Muda o status e registra um evento `status_change`.

**Payload:**

```json
{
  "status": "interview",
  "note": "Entrevista com o tech lead na sexta",
  "occurred_at": "2026-11-05T10:00:00Z"
}
```

- `status`: obrigatório.
- `note`: opcional.
- `occurred_at`: opcional; padrão é agora.

**Resposta 200:**

```json
{
  "application": { "id": 1, "status": "interview", "updated_at": "2026-11-05T10:00:00Z" },
  "event": { "id": 11, "type": "status_change", "from_status": "applied", "to_status": "interview", "note": "Entrevista com o tech lead na sexta", "occurred_at": "2026-11-05T10:00:00Z" }
}
```

(Demais campos da candidatura omitidos no exemplo.)

**Testes:**

- [ ] Muda o status e retorna 200 com a candidatura e o evento criado.
- [ ] O evento tem `type` `status_change`, `from_status` igual ao status anterior e `to_status` igual ao novo.
- [ ] Salva `note` e `occurred_at` quando enviados.
- [ ] Usa a data/hora atual quando `occurred_at` não é enviado.
- [ ] Atualiza `updated_at` da candidatura.
- [ ] Permite mudar para qualquer status (ex.: de `rejected` de volta para `interview`).
- [ ] Mudar para o mesmo status atual não gera evento e retorna 200 com `event: null`.
- [ ] Retorna 400 sem `status`.
- [ ] Retorna 400 com `status` fora da lista fixa.
- [ ] Retorna 400 com `occurred_at` inválido.
- [ ] Retorna 404 para `id` inexistente.

### [ ] `DELETE /applications/:id` — Excluir candidatura

**Payload:** nenhum

**Resposta 204:** sem corpo.

**Testes:**

- [ ] Exclui e retorna 204.
- [ ] A candidatura some da listagem e do kanban.
- [ ] `GET /applications/:id` retorna 404 depois da exclusão.
- [ ] Exclui junto todos os eventos do histórico da candidatura.
- [ ] Não exclui o currículo vinculado.
- [ ] Retorna 404 para `id` inexistente.

---

## Histórico (eventos)

### [ ] `GET /applications/:id/events` — Listar histórico

**Payload:** nenhum

**Resposta 200:** lista de objetos Evento, do mais recente para o mais antigo.

**Testes:**

- [ ] Retorna 200 com os eventos da candidatura, ordenados por `occurred_at` decrescente.
- [ ] Toda candidatura recém-criada tem pelo menos o evento `created`.
- [ ] Não retorna eventos de outras candidaturas.
- [ ] Retorna 404 para candidatura inexistente.

### [ ] `POST /applications/:id/events` — Adicionar evento manual

Registra algo que aconteceu no processo sem mudar o status (entrevista marcada, feedback recebido, follow-up enviado).

**Payload:**

```json
{
  "note": "Recebi feedback positivo da primeira etapa",
  "occurred_at": "2026-11-04T16:00:00Z"
}
```

- `note`: obrigatório.
- `occurred_at`: opcional; padrão é agora.

**Resposta 201:** objeto Evento com `type` `note`.

**Testes:**

- [ ] Cria o evento com `type` `note` e retorna 201.
- [ ] Usa a data/hora atual quando `occurred_at` não é enviado.
- [ ] Aceita `occurred_at` no passado (registro retroativo).
- [ ] Não altera o status da candidatura.
- [ ] Atualiza `updated_at` da candidatura.
- [ ] Retorna 400 sem `note` ou com `note` vazia.
- [ ] Retorna 400 com `occurred_at` inválido.
- [ ] Retorna 400 se tentar enviar `type`, `from_status` ou `to_status`.
- [ ] Retorna 404 para candidatura inexistente.

### [ ] `PATCH /applications/:id/events/:eventId` — Editar evento

Corrige a nota ou a data de um evento.

**Payload:**

```json
{
  "note": "Feedback positivo, próxima etapa é o case",
  "occurred_at": "2026-11-04T17:00:00Z"
}
```

**Resposta 200:** objeto Evento atualizado.

**Testes:**

- [ ] Atualiza `note` e `occurred_at`.
- [ ] Funciona para eventos `note` e `status_change`.
- [ ] Não permite alterar `type`, `from_status` ou `to_status` (retorna 400).
- [ ] Retorna 400 com `occurred_at` inválido.
- [ ] Retorna 404 para candidatura inexistente.
- [ ] Retorna 404 para evento inexistente.
- [ ] Retorna 404 se o evento pertence a outra candidatura.

### [ ] `DELETE /applications/:id/events/:eventId` — Excluir evento

Remove um evento registrado por engano. Não altera o status atual da candidatura.

**Payload:** nenhum

**Resposta 204:** sem corpo.

**Testes:**

- [ ] Exclui evento `note` e retorna 204.
- [ ] Exclui evento `status_change` sem alterar o status atual da candidatura.
- [ ] Retorna 400 ao tentar excluir o evento `created`.
- [ ] Retorna 404 para candidatura inexistente.
- [ ] Retorna 404 para evento inexistente.
- [ ] Retorna 404 se o evento pertence a outra candidatura.

---

## Kanban

### [ ] `GET /board` — Dados do kanban

Retorna as candidaturas agrupadas por status, uma coluna por status, na ordem fixa. Aceita os mesmos filtros `q`, `from`, `to` e `resume_id` da listagem.

**Payload:** nenhum

**Resposta 200:**

```json
{
  "columns": [
    {
      "status": "applied",
      "label": "Inscrito",
      "count": 2,
      "cards": [
        {
          "id": 1,
          "company": "Acme",
          "role": "Desenvolvedor Backend Sênior",
          "applied_at": "2026-11-02",
          "work_model": "remote",
          "resume_name": "Backend Sênior",
          "last_event_at": "2026-11-02T14:30:00Z"
        }
      ]
    }
  ]
}
```

**Testes:**

- [ ] Retorna sempre as 9 colunas, na ordem fixa, mesmo as vazias.
- [ ] Colunas vazias vêm com `count` 0 e `cards` vazio.
- [ ] Cada candidatura aparece em uma única coluna, a do seu status atual.
- [ ] `count` bate com o número de cards da coluna.
- [ ] Cards ordenados por `last_event_at` decrescente dentro da coluna.
- [ ] Cada card traz `id`, `company`, `role`, `applied_at`, `work_model`, `resume_name` e `last_event_at`.
- [ ] Depois de `PATCH /applications/:id/status`, o card aparece na nova coluna.
- [ ] Filtros `q`, `from`, `to` e `resume_id` reduzem os cards e mantêm todas as colunas.

---

## Currículos

### [ ] `POST /resumes` — Cadastrar currículo

**Payload (`multipart/form-data`):**

| Campo | Tipo | Obrigatório |
| ----- | ---- | ----------- |
| `name` | texto | sim |
| `description` | texto | não |
| `file` | arquivo PDF | sim |

**Resposta 201:** objeto Currículo.

**Testes:**

- [ ] Cria o currículo, salva o PDF na pasta de currículos do projeto e retorna 201.
- [ ] O arquivo salvo existe no disco e tem o mesmo conteúdo do enviado.
- [ ] Dois uploads com o mesmo nome de arquivo não se sobrescrevem.
- [ ] `applications_count` começa em 0.
- [ ] Retorna 400 sem `name`.
- [ ] Retorna 400 sem `file`.
- [ ] Retorna 400 com arquivo que não é PDF.
- [ ] Não deixa arquivo no disco quando a validação falha.

### [ ] `GET /resumes` — Listar currículos

**Payload:** nenhum

**Resposta 200:** lista de objetos Currículo, do mais recente para o mais antigo.

**Testes:**

- [ ] Retorna 200 com lista vazia quando não há currículos.
- [ ] Retorna todos os currículos ordenados por `updated_at` decrescente.
- [ ] `applications_count` mostra quantas candidaturas usam cada currículo.

### [ ] `GET /resumes/:id` — Detalhar currículo

**Payload:** nenhum

**Resposta 200:** objeto Currículo.

**Testes:**

- [ ] Retorna 200 com todos os campos.
- [ ] Retorna 404 para `id` inexistente.

### [ ] `GET /resumes/:id/file` — Baixar/visualizar PDF

**Payload:** nenhum

**Resposta 200:** o arquivo PDF, com `Content-Type: application/pdf` e `Content-Disposition: inline; filename="<file_name>"`.

**Testes:**

- [ ] Retorna 200 com o conteúdo do PDF.
- [ ] Envia `Content-Type: application/pdf`.
- [ ] Envia `Content-Disposition` com o nome original do arquivo.
- [ ] Retorna 404 para `id` inexistente.
- [ ] Retorna 404 se o registro existe mas o arquivo sumiu do disco.

### [ ] `GET /resumes/:id/applications` — Candidaturas que usaram o currículo

**Payload:** nenhum

**Resposta 200:** lista de objetos Candidatura vinculados ao currículo.

**Testes:**

- [ ] Retorna só as candidaturas com esse `resume_id`.
- [ ] Retorna lista vazia quando o currículo não foi usado.
- [ ] Retorna 404 para currículo inexistente.

### [ ] `PATCH /resumes/:id` — Editar dados do currículo

**Payload:**

```json
{
  "name": "Backend Sênior (v2)",
  "description": "Atualizado com o projeto X"
}
```

**Resposta 200:** objeto Currículo atualizado.

**Testes:**

- [ ] Atualiza `name` e/ou `description` e mantém o resto.
- [ ] Atualiza `updated_at`.
- [ ] Não altera o arquivo.
- [ ] Retorna 400 com `name` vazio ou `null`.
- [ ] Retorna 404 para `id` inexistente.

### [ ] `PUT /resumes/:id/file` — Substituir o PDF

**Payload (`multipart/form-data`):**

| Campo | Tipo | Obrigatório |
| ----- | ---- | ----------- |
| `file` | arquivo PDF | sim |

**Resposta 200:** objeto Currículo atualizado.

**Testes:**

- [ ] Substitui o arquivo e `GET /resumes/:id/file` passa a retornar o novo conteúdo.
- [ ] Remove o arquivo antigo do disco.
- [ ] Atualiza `file_name` e `updated_at`.
- [ ] Mantém os vínculos com as candidaturas.
- [ ] Retorna 400 sem `file`.
- [ ] Retorna 400 com arquivo que não é PDF, e o arquivo antigo continua intacto.
- [ ] Retorna 404 para `id` inexistente.

### [ ] `DELETE /resumes/:id` — Excluir currículo

Só exclui currículos que não estão vinculados a nenhuma candidatura, para não perder a informação de qual currículo foi enviado.

**Payload:** nenhum

**Resposta 204:** sem corpo.

**Testes:**

- [ ] Exclui currículo sem candidaturas vinculadas e retorna 204.
- [ ] Remove o arquivo PDF do disco.
- [ ] Retorna 409 se houver candidaturas usando o currículo, e nada é excluído.
- [ ] A resposta 409 informa quantas candidaturas usam o currículo.
- [ ] Retorna 404 para `id` inexistente.

---

## Painel

### [ ] `GET /dashboard` — Resumo geral

**Payload:** nenhum

**Resposta 200:**

```json
{
  "total": 42,
  "active": 15,
  "closed": 27,
  "by_status": {
    "applied": 8,
    "screening": 3,
    "interview": 2,
    "technical_test": 1,
    "offer": 1,
    "accepted": 0,
    "rejected": 12,
    "withdrawn": 3,
    "no_response": 12
  },
  "applied_last_30_days": 10,
  "recent_events": [
    { "id": 11, "application_id": 1, "company": "Acme", "role": "Desenvolvedor Backend Sênior", "type": "status_change", "to_status": "interview", "occurred_at": "2026-11-05T10:00:00Z" }
  ]
}
```

**Testes:**

- [ ] Retorna zeros (e `by_status` com os 9 status em 0) quando não há candidaturas.
- [ ] `total` é igual ao número de candidaturas.
- [ ] `by_status` traz os 9 status, com a contagem certa de cada um.
- [ ] `active` soma os status do tipo ativo e `closed` soma os do tipo encerrado.
- [ ] `active + closed` é igual a `total`.
- [ ] `applied_last_30_days` conta só candidaturas com `applied_at` nos últimos 30 dias.
- [ ] `recent_events` traz os 10 eventos mais recentes de todas as candidaturas, com empresa e cargo.
- [ ] Os números mudam depois de criar, mudar o status ou excluir uma candidatura.
