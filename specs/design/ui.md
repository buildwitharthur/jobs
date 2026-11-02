# UI/UX — Guia de Telas

Guia da interface do app de controle de candidaturas. Foi escrito a partir de [overview.md](../overview.md), [domain.md](../domain.md) e [api.md](../api.md): toda tela aqui consome rotas que já existem na API. A stack do frontend ainda não foi definida; este documento descreve **o que** a interface faz, não **com o que** ela é feita.

O objetivo principal é **fazer as tarefas do dia a dia com o menor número de cliques possível**. Uso pessoal, uma pessoa só, sem login.

---

## Princípios

1. **O kanban é a tela inicial.** Abrir o app já mostra onde cada processo está. Nenhuma tela de boas-vindas.
2. **Detalhe em painel lateral, não em outra página.** Clicar numa candidatura abre um painel sobre a tela atual. O usuário não perde o contexto e fecha com `Esc`. O painel tem URL própria (ex.: `?application=12`), então voltar do navegador e recarregar funcionam.
3. **Edição no lugar.** Clicar num campo já permite editar; ele salva sozinho ao sair do campo ou com `Enter`. Não existe botão "Editar" nem "Salvar".
4. **Só o essencial é obrigatório.** Para criar uma candidatura bastam empresa e cargo. O resto fica em "Mais detalhes", recolhido.
5. **Valores padrão que acertam na maioria das vezes.** Data da candidatura = hoje. Status = Inscrito. Currículo = o último usado.
6. **Arrastar é mudar de status.** Sem confirmação, porque a ação é reversível. Um aviso rápido permite desfazer.
7. **Confirmação só para o que não volta.** Excluir candidatura, evento ou currículo abre um alerta pequeno ("Excluir …?") com **Cancelar** e **Excluir**, com o foco em Cancelar. Trocar o PDF pede confirmação no próprio card, sem alerta.
8. **Teclado como atalho, nunca como obrigação.** Tudo funciona com o mouse; os atalhos só aceleram.
9. **Erros ao lado do campo.** A API devolve `details` com o campo que falhou; a mensagem aparece embaixo do campo certo, e o resto do formulário continua preenchido.

---

## Navegação

Três itens fixos no menu:

| Item           | Rota da tela  | Conteúdo                                     |
| -------------- | ------------- | -------------------------------------------- |
| **Candidaturas** | `/candidaturas` | Kanban, com busca                            |
| **Currículos** | `/curriculos` | Versões do currículo                         |
| **Painel**     | `/painel`     | Resumo geral                                 |

O endereço `/` e qualquer endereço que não exista levam para `/candidaturas`. Essas são as únicas páginas do app: o painel de detalhe e o modal de nova candidatura não têm página própria.

**Parâmetros de URL.** O estado da tela fica na URL, para recarregar e voltar do navegador funcionarem:

| Parâmetro     | Em quais páginas | Valor                                                                 |
| ------------- | ---------------- | --------------------------------------------------------------------- |
| `application` | todas            | `id` da candidatura aberta no painel lateral (ex.: `?application=12`) |
| `q`           | candidaturas     | Busca em empresa e cargo                                              |

Sempre visíveis, em qualquer tela:

- Botão **Nova candidatura** (atalho `N`).
- **Busca** por empresa ou cargo (atalho `/`).

O painel lateral de detalhe da candidatura pode ser aberto de qualquer tela (kanban, currículos, painel).

---

## Módulo Candidaturas

### Tela 1 — Kanban (tela inicial)

Mostra as candidaturas como cards, uma coluna por status.

**Consome**

| Quando                         | Rota                                         |
| ------------------------------ | -------------------------------------------- |
| Ao abrir a tela e ao buscar    | `GET /board` (com `q`)                       |
| Ao abrir o app (rótulos e tipo ativo/encerrado das colunas) | `GET /statuses` |
| Ao soltar um card em outra coluna | `PATCH /applications/:id/status`          |

**Como funciona**

- As 9 colunas vêm do `GET /board`, na ordem fixa. Os rótulos vêm da API, nunca do código do frontend.
- As colunas **ativas** (Inscrito até Proposta) ficam abertas. As **encerradas** (Aprovado, Reprovado, Desisti, Sem retorno) ficam estreitas, mostrando só o nome e a contagem; um clique abre a coluna. Assim o quadro precisa de menos rolagem lateral (em telas a partir de cerca de 1800px de largura, não precisa de nenhuma; ver [design.md](design.md)).
- O card mostra: empresa, cargo, modelo de trabalho (ícone), nome do currículo e há quanto tempo foi o último evento ("há 3 dias", a partir de `last_event_at`).
- **Arrastar** um card para outra coluna muda o status na hora (o card já aparece na nova coluna antes da resposta da API). Aparece um aviso por alguns segundos com dois botões: **Desfazer** e **Adicionar nota**. Se a API falhar, o card volta para a coluna original e o erro aparece no aviso.
- **Clicar no card** abre o painel de detalhe (Tela 2).
- A única forma de criar uma candidatura é o botão **Nova candidatura** (ou o atalho `N`), que abre o modal (Tela 3). As colunas não têm botão de criar.
- A tela é limpa: só o título, a busca e o botão **Nova candidatura** acima do quadro. Não há outra visualização (lista) nem filtros de período, currículo ou status.
- A busca filtra enquanto se digita, sem botão, e fica guardada na URL.

**Critérios de aceite**

- [ ] O app abre direto no kanban, com as 9 colunas na ordem da API, inclusive as vazias.
- [ ] Colunas vazias mostram a contagem 0 e o texto "Arraste um card para cá".
- [ ] Mudar o status de uma candidatura leva **1 ação** (arrastar e soltar).
- [ ] O card aparece na nova coluna imediatamente e volta para a original se a API devolver erro.
- [ ] "Desfazer" devolve o card à coluna anterior.
- [ ] A busca filtra os cards e mantém todas as colunas.
- [ ] Recarregar a página mantém a busca (está na URL).
- [ ] Soltar o card na mesma coluna não chama a API.

### Tela 2 — Detalhe da candidatura (painel lateral)

Tudo sobre um processo, com edição no lugar e a linha do tempo.

**Consome**

| Quando                         | Rota                                         |
| ------------------------------ | -------------------------------------------- |
| Ao abrir                       | `GET /applications/:id` (já traz currículo e histórico) |
| Ao editar um campo             | `PATCH /applications/:id`                    |
| Ao trocar o status             | `PATCH /applications/:id/status`             |
| Ao adicionar uma nota          | `POST /applications/:id/events`              |
| Ao editar uma nota ou data de evento | `PATCH /applications/:id/events/:eventId` |
| Ao excluir um evento           | `DELETE /applications/:id/events/:eventId`   |
| Ao excluir a candidatura       | `DELETE /applications/:id`                   |
| Opções de currículo            | `GET /resumes`                               |
| Ao abrir o PDF do currículo    | `GET /resumes/:id/file` (em nova aba)        |

**Como funciona**

- **Topo**: empresa e cargo em destaque, editáveis com um clique. Ao lado, o **status** como seletor: escolher um novo status já salva.
- **Dados**: link da vaga (abre em nova aba), onde se candidatou, data, currículo, salário, modelo de trabalho, localização, contatos e anotações. Todos editáveis no lugar; campo vazio mostra um texto de exemplo em cinza, clicável.
- **Currículo**: seletor com as versões e um link para abrir o PDF.
- **Linha do tempo**: eventos do mais recente para o mais antigo, com ícone por tipo (criação, mudança de status, nota). No topo dela, um campo **"Adicionar nota"** sempre visível: escrever e `Enter` salva com a data de agora. Um link discreto "agora" ao lado permite escolher outra data (registro retroativo).
- Passar o mouse sobre um evento mostra **editar** (nota e data) e **excluir**. O evento de criação não tem excluir.
- **Excluir candidatura** fica no rodapé do painel, com o alerta de confirmação. Depois de excluir, o painel fecha e o card some do kanban.
- Fechar: `Esc`, o "X" ou clicar fora do painel.

**Critérios de aceite**

- [ ] Abrir o detalhe leva **1 clique** no card.
- [ ] Editar qualquer campo leva **clicar, digitar e sair do campo**; não há botão de salvar.
- [ ] Trocar o status pelo painel leva **2 cliques** (abrir o seletor e escolher).
- [ ] Adicionar uma nota leva **digitar e `Enter`**.
- [ ] O histórico aparece do mais recente para o mais antigo e é atualizado logo após cada mudança de status ou nota.
- [ ] O evento de criação não pode ser excluído (o botão não aparece).
- [ ] Empresa e cargo vazios não são salvos: o campo mostra o erro e volta ao valor anterior ao apertar `Esc`.
- [ ] Se a candidatura não existir mais (404), o painel fecha e um aviso informa.
- [ ] As mudanças feitas no painel aparecem no kanban sem recarregar a página.

### Tela 3 — Nova candidatura (modal)

A única forma de criar uma candidatura.

**Consome**

| Quando              | Rota                    |
| ------------------- | ----------------------- |
| Ao salvar           | `POST /applications`    |
| Opções de currículo | `GET /resumes`          |

**Como funciona**

- Abre pelo botão **Nova candidatura** ou com `N`, de qualquer tela. O cursor já fica no campo empresa.
- Visíveis: **empresa**, **cargo** e **link da vaga**. O resto (onde se candidatou, data, status, currículo, salário, modelo de trabalho, localização, contatos, anotações) fica em **"Mais detalhes"**, recolhido.
- Padrões já preenchidos: data = hoje, status = Inscrito, currículo = o último usado neste navegador.
- `Enter` salva. Ao salvar, o modal fecha e o novo card aparece destacado no kanban.
- Erros de validação aparecem embaixo do campo correspondente, sem apagar o que foi digitado.

**Critérios de aceite**

- [ ] Criar uma candidatura leva **`N`, empresa, cargo, `Enter`**.
- [ ] O modal abre com o foco no campo empresa.
- [ ] Data, status e currículo vêm preenchidos com os padrões e podem ser trocados.
- [ ] Erro devolvido pela API aparece embaixo do campo certo (a partir de `details`), e os dados digitados continuam no formulário.
- [ ] Depois de salvar, a nova candidatura está visível no kanban sem recarregar.

---

## Módulo Currículos

### Tela 4 — Currículos

As versões do currículo e onde cada uma foi usada.

**Consome**

| Quando                                   | Rota                              |
| ---------------------------------------- | --------------------------------- |
| Ao abrir                                 | `GET /resumes`                    |
| Ao enviar um PDF novo                    | `POST /resumes` (`multipart/form-data`) |
| Ao editar nome ou descrição              | `PATCH /resumes/:id`              |
| Ao trocar o PDF                          | `PUT /resumes/:id/file`           |
| Ao abrir o PDF                           | `GET /resumes/:id/file` (em nova aba) |
| Ao expandir "usado em"                   | `GET /resumes/:id/applications`   |
| Ao excluir                               | `DELETE /resumes/:id`             |

**Como funciona**

- Lista de cards, do mais recente para o mais antigo: nome, descrição, nome do arquivo, data de atualização e **"usado em N candidaturas"**.
- **Arrastar um PDF para qualquer lugar da tela** cria um currículo novo. O nome já vem do nome do arquivo (sem `.pdf`) e pode ser editado no lugar logo em seguida. Também há um botão **Enviar PDF** para quem prefere escolher o arquivo.
- Nome e descrição são editáveis no lugar.
- **Arrastar um PDF sobre um card** troca o arquivo daquele currículo, depois de confirmar no próprio card (o arquivo antigo é apagado).
- Clicar no nome do arquivo abre o PDF em nova aba.
- **"Usado em N candidaturas"** expande a lista dessas candidaturas no próprio card; clicar numa delas abre o painel de detalhe (Tela 2).
- **Excluir** fica desabilitado quando o currículo está em uso, com a explicação "Em uso por N candidaturas". Se a API devolver 409 mesmo assim, a mensagem dela aparece.

**Critérios de aceite**

- [ ] Cadastrar um currículo leva **1 ação** (arrastar o PDF para a tela).
- [ ] Arquivo que não é PDF mostra o erro da API e não cria nada.
- [ ] Trocar o PDF de um currículo leva **arrastar o arquivo sobre o card e confirmar**.
- [ ] Abrir o PDF leva **1 clique**.
- [ ] Ver as candidaturas que usaram um currículo leva **1 clique**, sem sair da tela.
- [ ] Não é possível excluir um currículo em uso; o motivo fica visível antes de tentar.
- [ ] Sem currículos, a tela mostra a área para soltar o PDF com o texto "Arraste um PDF aqui".

---

## Módulo Painel

### Tela 5 — Painel

Visão rápida de como estão os processos.

**Consome**

| Quando   | Rota             |
| -------- | ---------------- |
| Ao abrir | `GET /dashboard` |
| Rótulos dos status | `GET /statuses` |

**Como funciona**

- Números em destaque: **total**, **ativas**, **encerradas** e **candidaturas nos últimos 30 dias**.
- **Por status**: uma barra por status (os 9, inclusive os zerados), com a contagem. Clicar numa barra abre o kanban com a coluna daquele status à vista (se for uma coluna encerrada, ela já vem aberta).
- **Eventos recentes**: os 10 últimos, com empresa, cargo, tipo do evento e quando aconteceu. Clicar num evento abre o painel de detalhe da candidatura.

**Critérios de aceite**

- [ ] Os números batem com o `GET /dashboard`.
- [ ] Os 9 status aparecem, inclusive os que têm 0.
- [ ] Ir do painel para a coluna de um status no kanban leva **1 clique**.
- [ ] Ir de um evento recente para o detalhe da candidatura leva **1 clique**.
- [ ] Sem candidaturas, o painel mostra zeros e o botão "Nova candidatura".

---

## Comportamentos globais

### Atalhos de teclado

| Tecla   | Ação                                       |
| ------- | ------------------------------------------ |
| `N`     | Nova candidatura                           |
| `/`     | Ir para a busca                            |
| `Esc`   | Fechar painel, modal ou campo em edição    |
| `Enter` | Salvar o campo ou formulário em edição     |

Os atalhos de uma letra não disparam enquanto o usuário digita num campo.

### Erros

| Resposta da API        | O que a interface faz                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| 400 com `details`      | Mostra cada mensagem embaixo do campo correspondente (`body.company` → campo empresa)    |
| 404                    | Aviso "não encontrado"; se for o painel aberto, ele fecha                                 |
| 409                    | Mostra a `message` da API (ex.: currículo em uso)                                        |
| 500 ou sem conexão     | Aviso "Algo deu errado, tente de novo"; o que foi digitado não se perde                  |

### Avisos (toasts)

- Aparecem num canto, somem sozinhos depois de alguns segundos e não bloqueiam a tela.
- Só aparecem quando acrescentam algo: desfazer, adicionar nota ou um erro. Salvar um campo não gera aviso; o campo mostra um sinal discreto de "salvo".

### Tema

- O app abre no **tema escuro**. Um botão no rodapé do menu troca para o tema claro e de volta; a escolha fica salva no navegador. As cores dos dois temas estão no [design.md](design.md#cores).

### Placeholders

- Todo campo tem placeholder com um exemplo do que escrever ("Ex.: Acme Tecnologia"), e todo seletor começa com uma opção de convite ("Selecione o currículo"). Campos vazios do painel de detalhe mostram o convite para preencher ("Adicionar localização"). As regras estão no [design.md](design.md#placeholders).

### Datas

- Datas no formato `dd/mm/aaaa`. Datas recentes também aparecem relativas ("hoje", "há 3 dias").
- A API recebe e devolve no formato ISO 8601 (ver [api.md](../api.md)); a conversão é do frontend.

### Estados vazios e carregamento

- Toda lista vazia diz o que fazer e oferece o botão da ação (criar candidatura, enviar PDF).
- Durante o carregamento, a tela mostra o formato do conteúdo (cards em cinza), não uma tela em branco.

---

## Metas de cliques

Resumo das tarefas mais comuns e do máximo de interações esperado. Digitar texto não conta como clique.

| Tarefa                                 | Como                                    | Máximo |
| -------------------------------------- | --------------------------------------- | ------ |
| Ver onde estão os processos            | Abrir o app                             | 0      |
| Mudar o status                         | Arrastar o card                         | 1      |
| Mudar o status e anotar o motivo       | Arrastar, "Adicionar nota", digitar, `Enter` | 2  |
| Criar uma candidatura                  | `N` (ou o botão "Nova candidatura"), empresa, cargo, `Enter` | 1 |
| Ver o detalhe de uma candidatura       | Clicar no card                          | 1      |
| Anotar algo numa candidatura           | Abrir o detalhe, digitar, `Enter`       | 1      |
| Editar um campo                        | Abrir o detalhe, clicar no campo, digitar | 2    |
| Abrir o currículo usado numa vaga      | Abrir o detalhe, clicar no currículo    | 2      |
| Cadastrar um currículo                 | Arrastar o PDF para a tela de currículos | 1     |
| Ver as candidaturas de um status       | Painel → clicar na barra do status      | 1      |

---

## Questões em aberto

- **Stack do frontend**: ainda não definida.
- **Celular**: não está documentado se o app precisa funcionar bem em telas pequenas. Este guia assume uso principal no computador.
- **Ordem dos cards dentro da coluna**: a API ordena pelo evento mais recente e não guarda uma ordem manual. Arrastar um card dentro da mesma coluna não muda nada.
- **Desfazer mudança de status**: a API não apaga a mudança; "Desfazer" faz uma nova mudança de volta. O histórico fica com os dois eventos.
