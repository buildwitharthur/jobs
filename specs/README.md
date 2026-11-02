# Documentação do projeto

Índice da documentação do app de controle de candidaturas. Os documentos abaixo são a fonte de verdade para escopo, regras de negócio, contratos da API e interface.

## Arquivos

| Arquivo | Função |
| --- | --- |
| [overview.md](overview.md) | Apresenta o contexto do app, objetivos, conceitos principais, funcionalidades, premissas e itens fora do escopo. Deve ser lido primeiro. |
| [domain.md](domain.md) | Define models, enums, inputs, views e regras de negócio de candidaturas, eventos, currículos, kanban e painel. |
| [api.md](api.md) | Especifica as rotas HTTP, payloads, respostas, códigos de erro e checklists de testes. |
| [design/README.md](design/README.md) | Organiza a documentação visual, os assets e o protótipo da interface. |

## Módulos funcionais

| Módulo | Responsabilidade | Domínio | API | Interface |
| --- | --- | --- | --- | --- |
| `statuses` | Disponibilizar a lista fixa e ordenada de status ativos e encerrados. | `Status`, `StatusType` e `StatusDefinition` em [domain.md](domain.md#status) | `GET /statuses` em [api.md](api.md#status) | Colunas e rótulos descritos em [design/ui.md](design/ui.md) |
| `applications` | Criar, consultar, editar, excluir e alterar o status das candidaturas. | `Application` e seus inputs/views em [domain.md](domain.md) | Rotas de candidaturas em [api.md](api.md#candidaturas) | Kanban, detalhe e criação em [design/ui.md](design/ui.md#modulo-candidaturas) |
| `events` | Manter o histórico de criação, mudanças de status e notas manuais. | `ApplicationEvent` e regras por tipo em [domain.md](domain.md) | Rotas de histórico em [api.md](api.md#historico-eventos) | Linha do tempo no detalhe da candidatura em [design/ui.md](design/ui.md) |
| `board` | Montar as nove colunas do kanban e seus cards, respeitando filtros e ordenação. | `Board`, `BoardColumn` e `BoardCard` em [domain.md](domain.md) | `GET /board` em [api.md](api.md#kanban) | Tela Kanban em [design/ui.md](design/ui.md) |
| `resumes` | Gerenciar metadados e arquivos PDF dos currículos e seus vínculos com candidaturas. | `Resume`, inputs e views em [domain.md](domain.md) | Rotas de currículos em [api.md](api.md#curriculos) | Tela Currículos em [design/ui.md](design/ui.md#modulo-curriculos) |
| `dashboard` | Consolidar totais, contagens por status e eventos recentes. | `Dashboard` e `RecentEvent` em [domain.md](domain.md) | `GET /dashboard` em [api.md](api.md#painel) | Tela Painel em [design/ui.md](design/ui.md#modulo-painel) |

## Ordem de leitura

1. [overview.md](overview.md)
2. [domain.md](domain.md)
3. [api.md](api.md)
4. [design/README.md](design/README.md)

