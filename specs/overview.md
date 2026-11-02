# Visão Geral — Controle de Candidaturas

## Contexto

Aplicação web pessoal para acompanhar os processos seletivos em que me inscrevo e os currículos que uso em cada um. Hoje essas informações ficam espalhadas entre e-mails, plataformas de vagas e anotações soltas. Com isso fica difícil saber em que etapa cada processo está, quando foi o último contato e qual versão do currículo foi enviada para qual empresa.

O app junta tudo isso num lugar só, onde registro cada candidatura e atualizo o andamento conforme o processo avança.

## Usuário

Uma pessoa só: eu. A ferramenta é de uso pessoal, então:

- **Não tem autenticação**, nem login, cadastro ou controle de permissões.
- Não existe o conceito de múltiplos usuários ou de compartilhamento.
- A interface pode ser direta e prática, pensada para o meu fluxo, sem onboarding.

## Objetivos

1. **Registrar candidaturas**: cadastrar rapidamente cada vaga em que me inscrevi.
2. **Acompanhar o andamento**: saber em que etapa cada processo está e atualizar conforme muda.
3. **Gerenciar currículos**: manter as versões do meu currículo e saber qual foi usada em cada candidatura.
4. **Ter visão geral**: bater o olho e entender quantos processos estão ativos, parados ou encerrados.

## Conceitos principais

### Candidatura

Representa minha inscrição em um processo seletivo. Informações esperadas:

- Empresa
- Cargo / título da vaga
- Link da vaga
- Onde me candidatei (LinkedIn, site da empresa, indicação, etc.)
- Data da candidatura
- Status atual
- Currículo utilizado
- Faixa salarial / pretensão (opcional)
- Modelo de trabalho (remoto, híbrido, presencial) e localização (opcional)
- Contatos (recrutador, e-mail, etc.) (opcional)
- Anotações livres

### Status / Etapas

Cada candidatura passa por etapas ao longo do processo. A lista de status é **fixa** (não configurável pelo app) e cada status corresponde a uma coluna do kanban:

- **Inscrito**: candidatura enviada, aguardando retorno
- **Em análise / Triagem**: houve algum contato inicial
- **Entrevista**: uma ou mais entrevistas em andamento
- **Teste técnico / Case**
- **Proposta**: recebi oferta
- **Aprovado / Aceito**
- **Reprovado**
- **Desisti**
- **Sem retorno**: processo parado, sem resposta

### Histórico da candidatura

Cada atualização de um processo (mudança de status, entrevista marcada, feedback recebido) fica registrada com data e uma nota. Assim dá para ver a linha do tempo completa de cada processo, além do status atual.

### Currículo

As versões do meu currículo (ex.: "Backend Sênior", "Fullstack — Inglês"). Cada currículo tem:

- Nome / identificação da versão
- Arquivo (PDF), guardado numa pasta dentro do próprio projeto
- Descrição ou foco (opcional)
- Data de criação / atualização

Uma candidatura referencia o currículo que foi enviado.

## Funcionalidades esperadas (alto nível)

- **Kanban** como visão principal: uma coluna por status, com cada candidatura em um card. Arrastar um card para outra coluna muda o status e registra o evento no histórico.
- Listar candidaturas com filtro e busca (por status, empresa, data).
- Criar, editar e excluir candidaturas.
- Atualizar o status de uma candidatura e registrar eventos no histórico.
- Ver os detalhes de uma candidatura com sua linha do tempo.
- Cadastrar e gerenciar versões de currículo.
- Ver em quais candidaturas cada currículo foi usado.
- Painel com resumo: total de candidaturas, quantas por status, processos ativos.

## Fora do escopo

- Autenticação, contas de usuário e multiusuário.
- Integração automática com plataformas de vagas (LinkedIn, Gupy, etc.).
- Envio de candidaturas pelo app; ele só registra o que fiz por fora.
- Notificações por e-mail ou push (pode ser reavaliado no futuro).

## Premissas

- O app fica hospedado na minha VPS.
- Os arquivos de currículo ficam numa pasta dentro do projeto.
- Segurança não é preocupação: o foco é a ideia e a utilidade da ferramenta.
- Volume baixo de dados (dezenas a poucas centenas de candidaturas), então performance não é preocupação central.
- Os dados precisam persistir entre sessões.
