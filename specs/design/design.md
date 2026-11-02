---
version: 1
name: controle-de-candidaturas
description: Design system do app pessoal de controle de candidaturas. Ferramenta de trabalho, densa e calma, centrada num kanban de 9 status. Tema escuro por padrão (com tema claro como alternativa), uma família tipográfica (Inter), ícones Lucide, botões retangulares, cards com borda fina e a cor reservada para duas funções — o status de cada candidatura e as ações. A estrutura deste documento segue a do design system do Notion. Este arquivo é a fonte da verdade de cores e fontes.

# Este arquivo é a fonte da verdade das cores. `colors` é o tema escuro (padrão); `colors-light` é o tema claro.
# Os dois temas têm exatamente os mesmos nomes de token.
colors:
  bg: "#020617"
  surface: "#1e293b"
  surface-sunken: "#0f172a"
  border: "#334155"
  border-input: "#94a3b8"
  text-primary: "#f1f5f9"
  text-secondary: "#cbd5e1"
  text-muted: "#94a3b8"
  primary: "#4f46e5"
  primary-hover: "#4338ca"
  primary-text: "#a5b4fc"
  primary-subtle: "#1e1b4b"
  primary-subtle-text: "#c7d2fe"
  on-primary: "#ffffff"
  focus: "#818cf8"
  success-bg: "#052e16"
  success-text: "#86efac"
  danger-bg: "#450a0a"
  danger-text: "#fca5a5"
  danger-solid: "#dc2626"
  on-danger: "#ffffff"
  warning-bg: "#451a03"
  warning-text: "#fcd34d"
  info-bg: "#172554"
  info-text: "#93c5fd"
  status-applied-bg: "#172554"
  status-applied-text: "#93c5fd"
  status-applied-accent: "#3b82f6"
  status-screening-bg: "#082f49"
  status-screening-text: "#7dd3fc"
  status-screening-accent: "#0ea5e9"
  status-interview-bg: "#2e1065"
  status-interview-text: "#c4b5fd"
  status-interview-accent: "#8b5cf6"
  status-technical_test-bg: "#451a03"
  status-technical_test-text: "#fcd34d"
  status-technical_test-accent: "#f59e0b"
  status-offer-bg: "#042f2e"
  status-offer-text: "#5eead4"
  status-offer-accent: "#14b8a6"
  status-accepted-bg: "#052e16"
  status-accepted-text: "#86efac"
  status-accepted-accent: "#22c55e"
  status-rejected-bg: "#450a0a"
  status-rejected-text: "#fca5a5"
  status-rejected-accent: "#ef4444"
  status-withdrawn-bg: "#1f2937"
  status-withdrawn-text: "#d1d5db"
  status-withdrawn-accent: "#9ca3af"
  status-no_response-bg: "#292524"
  status-no_response-text: "#d6d3d1"
  status-no_response-accent: "#a8a29e"

colors-light:
  bg: "#f8fafc"
  surface: "#ffffff"
  surface-sunken: "#f1f5f9"
  border: "#e2e8f0"
  border-input: "#64748b"
  text-primary: "#0f172a"
  text-secondary: "#475569"
  text-muted: "#64748b"
  primary: "#4f46e5"
  primary-hover: "#4338ca"
  primary-text: "#4f46e5"
  primary-subtle: "#eef2ff"
  primary-subtle-text: "#4338ca"
  on-primary: "#ffffff"
  focus: "#6366f1"
  success-bg: "#f0fdf4"
  success-text: "#15803d"
  danger-bg: "#fef2f2"
  danger-text: "#b91c1c"
  danger-solid: "#dc2626"
  on-danger: "#ffffff"
  warning-bg: "#fffbeb"
  warning-text: "#b45309"
  info-bg: "#eff6ff"
  info-text: "#1d4ed8"
  status-applied-bg: "#eff6ff"
  status-applied-text: "#1d4ed8"
  status-applied-accent: "#3b82f6"
  status-screening-bg: "#f0f9ff"
  status-screening-text: "#0369a1"
  status-screening-accent: "#0ea5e9"
  status-interview-bg: "#f5f3ff"
  status-interview-text: "#6d28d9"
  status-interview-accent: "#8b5cf6"
  status-technical_test-bg: "#fffbeb"
  status-technical_test-text: "#b45309"
  status-technical_test-accent: "#f59e0b"
  status-offer-bg: "#f0fdfa"
  status-offer-text: "#0f766e"
  status-offer-accent: "#14b8a6"
  status-accepted-bg: "#f0fdf4"
  status-accepted-text: "#15803d"
  status-accepted-accent: "#22c55e"
  status-rejected-bg: "#fef2f2"
  status-rejected-text: "#b91c1c"
  status-rejected-accent: "#ef4444"
  status-withdrawn-bg: "#f3f4f6"
  status-withdrawn-text: "#4b5563"
  status-withdrawn-accent: "#9ca3af"
  status-no_response-bg: "#f5f5f4"
  status-no_response-text: "#57534e"
  status-no_response-accent: "#a8a29e"

typography:
  display:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
  title:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 600
    lineHeight: 28px
  heading:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-strong:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
  number:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: 600
    lineHeight: 36px
    fontVariantNumeric: tabular-nums
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px

size:
  control-sm: 28px
  control-md: 32px
  nav-width: 220px
  drawer-width: 480px
  modal-width: 560px
  column-min-width: 240px
  column-max-width: 320px
  column-collapsed-width: 56px

elevation:
  flat: "none"
  raised: "rgba(0, 0, 0, 0.30) 0px 1px 2px 0px"
  dragging: "rgba(0, 0, 0, 0.50) 0px 8px 24px -4px"
  overlay: "rgba(0, 0, 0, 0.50) 0px 16px 48px -8px"
  backdrop: "rgba(2, 6, 23, 0.70)"

elevation-light:
  flat: "none"
  raised: "rgba(15, 23, 42, 0.06) 0px 1px 2px 0px"
  dragging: "rgba(15, 23, 42, 0.12) 0px 8px 24px -4px"
  overlay: "rgba(15, 23, 42, 0.16) 0px 16px 48px -8px"
  backdrop: "rgba(15, 23, 42, 0.40)"

icons:
  library: "Lucide (lucide.dev), licença ISC"
  size: 16px
  size-small: 12px
  strokeWidth: 2
  color: currentColor

motion:
  fast: "120ms ease-out"
  base: "180ms ease-out"
  slow: "240ms ease-out"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: "{size.control-md}"
    padding: "0 {spacing.sm}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: "{size.control-md}"
    padding: "0 {spacing.sm}"
    border: "1px solid {colors.border}"
  button-secondary-hover:
    backgroundColor: "{colors.surface-sunken}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    height: "{size.control-sm}"
    padding: "0 {spacing.xs}"
  button-ghost-hover:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.text-primary}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.danger-text}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: "{size.control-md}"
    padding: "0 {spacing.sm}"
  button-danger-confirm:
    backgroundColor: "{colors.danger-solid}"
    textColor: "{colors.on-danger}"
  button-disabled:
    backgroundColor: "{colors.border}"
    textColor: "{colors.text-muted}"
  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    placeholderColor: "{colors.text-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "{size.control-md}"
    padding: "0 {spacing.sm}"
    border: "1px solid {colors.border-input}"
  text-input-focused:
    border: "1px solid {colors.primary}"
    ring: "2px {colors.focus}"
  text-input-error:
    border: "1px solid {colors.danger-solid}"
    messageColor: "{colors.danger-text}"
    messageTypography: "{typography.caption}"
  inline-field:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    placeholderColor: "{colors.text-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.xs}"
  inline-field-hover:
    backgroundColor: "{colors.surface-sunken}"
  inline-field-editing:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.border-input}"
    ring: "2px {colors.focus}"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    placeholderColor: "{colors.text-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "{size.control-md}"
    border: "1px solid {colors.border}"
  status-badge:
    backgroundColor: "{colors.status-<value>-bg}"
    textColor: "{colors.status-<value>-text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px {spacing.xs}"
  status-dot:
    backgroundColor: "{colors.status-<value>-accent}"
    size: 8px
    rounded: "{rounded.full}"
  kanban-column:
    backgroundColor: "{colors.surface-sunken}"
    rounded: "{rounded.lg}"
    minWidth: "{size.column-min-width}"
    maxWidth: "{size.column-max-width}"
    padding: "{spacing.xs}"
  kanban-column-header:
    textColor: "{colors.text-primary}"
    typography: "{typography.heading}"
    countColor: "{colors.text-secondary}"
    countTypography: "{typography.caption}"
    padding: "{spacing.xs} {spacing.xs} {spacing.sm}"
  kanban-column-collapsed:
    backgroundColor: "{colors.surface-sunken}"
    rounded: "{rounded.lg}"
    width: "{size.column-collapsed-width}"
    textColor: "{colors.status-<value>-text}"
  application-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
    border: "1px solid {colors.border}"
    accentBorder: "3px solid {colors.status-<value>-accent} (esquerda)"
    shadow: "{elevation.flat}"
  application-card-hover:
    shadow: "{elevation.raised}"
  application-card-dragging:
    shadow: "{elevation.dragging}"
    rotate: 2deg
  application-card-highlight:
    backgroundColor: "{colors.primary-subtle}"
  drawer:
    backgroundColor: "{colors.surface}"
    width: "{size.drawer-width}"
    padding: "{spacing.xl}"
    borderLeft: "1px solid {colors.border}"
    shadow: "{elevation.overlay}"
  modal:
    backgroundColor: "{colors.surface}"
    width: "{size.modal-width}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    shadow: "{elevation.overlay}"
    backdrop: "{elevation.backdrop}"
  timeline-item:
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    metaColor: "{colors.text-muted}"
    metaTypography: "{typography.caption}"
    lineColor: "{colors.border}"
    padding: "{spacing.xs} 0"
  note-composer:
    backgroundColor: "{colors.surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.border-input}"
    padding: "{spacing.xs} {spacing.sm}"
  resume-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    border: "1px solid {colors.border}"
  dropzone:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    border: "1px dashed {colors.border-input}"
    padding: "{spacing.xxl}"
  dropzone-active:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary-subtle-text}"
    border: "2px dashed {colors.primary}"
  stat-tile:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    border: "1px solid {colors.border}"
    valueTypography: "{typography.number}"
    labelColor: "{colors.text-secondary}"
    labelTypography: "{typography.body}"
  status-bar:
    trackColor: "{colors.surface-sunken}"
    fillColor: "{colors.status-<value>-accent}"
    height: 8px
    rounded: "{rounded.full}"
  toast:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.border}"
    shadow: "{elevation.overlay}"
  tooltip:
    backgroundColor: "{colors.text-primary}"
    textColor: "{colors.surface}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.xs}"
  nav:
    backgroundColor: "{colors.surface}"
    width: "{size.nav-width}"
    borderRight: "1px solid {colors.border}"
    padding: "{spacing.md} {spacing.xs}"
  nav-item:
    textColor: "{colors.text-secondary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    height: "{size.control-md}"
    padding: "0 {spacing.sm}"
  nav-item-active:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary-subtle-text}"
  skeleton:
    backgroundColor: "{colors.surface-sunken}"
    rounded: "{rounded.sm}"
  empty-state:
    textColor: "{colors.text-secondary}"
    titleColor: "{colors.text-primary}"
    titleTypography: "{typography.heading}"
    typography: "{typography.body}"
    padding: "{spacing.xxxl}"
---

# Design System — Controle de Candidaturas

O design system do app. É a fonte da verdade de cores, fontes e componentes; as telas e os comportamentos estão no [ui.md](ui.md). A estrutura deste documento segue a de um design system público (Notion), adaptada a uma ferramenta de trabalho: aqui não há páginas de marketing, só as telas do app.

## Visão geral

O app é uma ferramenta pessoal, usada no computador, para acompanhar processos seletivos. A tela principal é um **kanban com 9 colunas de status**, cheio de cards. O visual serve a isso:

- **Escuro, calmo e denso.** Tema escuro por padrão: fundo quase preto (`{colors.bg}`), colunas um tom acima (`{colors.surface-sunken}`) e cards mais claros (`{colors.surface}`), com borda fina (`{colors.border}`) e texto de 14px. No escuro, o que está mais perto do usuário é mais claro. O tema claro existe como alternativa, com os mesmos tokens.
- **A cor tem duas funções e só duas.** A **cor do status**, que identifica em que etapa cada candidatura está, e a **cor primária** (`{colors.primary}`, índigo), que marca o que é ação. O resto é cinza.
- **Geometria sóbria.** Botões e campos retangulares com cantos de 8px (`{rounded.md}`), cards de 8px e contêineres de 12px (`{rounded.lg}`). Nada em formato de pílula, a não ser pontos e barras.
- **Profundidade só quando algo está por cima.** Tudo é plano com borda; sombra aparece em card sendo arrastado, painel lateral, modal, menus e avisos.
- **Uma fonte, Inter**, com a hierarquia feita por tamanho e peso.

**Características principais**

- Kanban com colunas em `{colors.surface-sunken}` e cards brancos marcados por uma borda esquerda na cor do status.
- Colunas encerradas recolhidas numa faixa estreita, com o ponto e a contagem.
- Painel lateral de detalhe (`drawer`) que abre por cima da tela, sem trocar de página.
- Campos editáveis no lugar (`inline-field`): parecem texto até serem clicados.
- Botão primário índigo, um por tela.

## Cores

Dois temas com os **mesmos nomes de token**: `colors` (escuro, padrão) e `colors-light` (claro). Componente nenhum escolhe cor de tema; ele usa o token e o tema decide o valor. O tema escolhido pela pessoa fica salvo no navegador.

Todo par de texto e fundo abaixo foi conferido e tem contraste de pelo menos **4,5:1** (WCAG AA); bordas de campo e anel de foco têm pelo menos **3:1**.

### Superfícies e texto

| Token                 | Escuro    | Claro     | Uso                                                                 |
| --------------------- | --------- | --------- | ------------------------------------------------------------------- |
| `bg`                  | `#020617` | `#f8fafc` | Fundo da aplicação                                                  |
| `surface-sunken`      | `#0f172a` | `#f1f5f9` | Colunas do kanban, área de soltar, carregamento, hover              |
| `surface`             | `#1e293b` | `#ffffff` | Cards, painel lateral, modal, menu                                  |
| `border`              | `#334155` | `#e2e8f0` | Bordas decorativas e divisórias                                     |
| `border-input`        | `#94a3b8` | `#64748b` | Contorno de campos (o único contorno que precisa de contraste)      |
| `text-primary`        | `#f1f5f9` | `#0f172a` | Texto principal: empresa, títulos, valores                          |
| `text-secondary`      | `#cbd5e1` | `#475569` | Texto de apoio: cargo, rótulos, itens do menu                       |
| `text-muted`          | `#94a3b8` | `#64748b` | Metadados e placeholders: "há 3 dias", datas, contagens             |

Contrastes no escuro, sobre `surface`: `text-primary` 13,35:1, `text-secondary` 9,85:1, `text-muted` 5,71:1, `border-input` 5,71:1. Sobre `surface-sunken`, `text-muted` tem 6,96:1.

Contrastes no claro, sobre `surface`: `text-primary` 17,85:1, `text-secondary` 7,58:1, `text-muted` 4,76:1, `border-input` 4,76:1. **No tema claro, não use `text-muted` sobre `surface-sunken`** (4,34:1); ali use `text-secondary`.

### Ação

| Token                  | Escuro    | Claro     | Uso                                                        |
| ---------------------- | --------- | --------- | ---------------------------------------------------------- |
| `primary`              | `#4f46e5` | `#4f46e5` | Fundo do botão principal, borda da área de soltar ativa    |
| `primary-hover`        | `#4338ca` | `#4338ca` | Botão principal com o mouse em cima                        |
| `on-primary`           | `#ffffff` | `#ffffff` | Texto e ícone sobre `primary` (6,29:1)                     |
| `primary-text`         | `#a5b4fc` | `#4f46e5` | Primária usada como **texto**: links, botões de link       |
| `primary-subtle`       | `#1e1b4b` | `#eef2ff` | Item de menu ativo, item selecionado, card recém-criado    |
| `primary-subtle-text`  | `#c7d2fe` | `#4338ca` | Texto sobre `primary-subtle` (10,72:1 no escuro, 7,07:1 no claro) |
| `focus`                | `#818cf8` | `#6366f1` | Anel de foco do teclado (2px)                              |

`primary-text` existe porque o índigo do botão fica ilegível como texto sobre fundo escuro (2,6:1). Link no escuro usa `#a5b4fc` (7,34:1 sobre `surface`).

### Status

Cada status tem `bg` (selo e cabeçalho), `text` (texto do selo) e `accent` (ponto, borda esquerda do card, barra do painel). Nos componentes, `<value>` é o `value` do status vindo da API. O `accent` é decorativo: sempre aparece junto com o nome do status.

| Status (`value`)   | Rótulo               | Escuro `bg` / `text` | Contraste | Claro `bg` / `text` | Contraste | `accent` (os dois) |
| ------------------ | -------------------- | -------------------- | --------- | ------------------- | --------- | ----------------- |
| `applied`          | Inscrito             | `#172554` / `#93c5fd` | 8,15:1    | `#eff6ff` / `#1d4ed8` | 6,16:1    | `#3b82f6`         |
| `screening`        | Em análise / Triagem | `#082f49` / `#7dd3fc` | 8,32:1    | `#f0f9ff` / `#0369a1` | 5,57:1    | `#0ea5e9`         |
| `interview`        | Entrevista           | `#2e1065` / `#c4b5fd` | 8,25:1    | `#f5f3ff` / `#6d28d9` | 6,48:1    | `#8b5cf6`         |
| `technical_test`   | Teste técnico / Case | `#451a03` / `#fcd34d` | 10,39:1   | `#fffbeb` / `#b45309` | 4,84:1    | `#f59e0b`         |
| `offer`            | Proposta             | `#042f2e` / `#5eead4` | 9,78:1    | `#f0fdfa` / `#0f766e` | 5,25:1    | `#14b8a6`         |
| `accepted`         | Aprovado / Aceito    | `#052e16` / `#86efac` | 10,62:1   | `#f0fdf4` / `#15803d` | 4,79:1    | `#22c55e`         |
| `rejected`         | Reprovado            | `#450a0a` / `#fca5a5` | 8,51:1    | `#fef2f2` / `#b91c1c` | 5,91:1    | `#ef4444`         |
| `withdrawn`        | Desisti              | `#1f2937` / `#d1d5db` | 9,96:1    | `#f3f4f6` / `#4b5563` | 6,87:1    | `#9ca3af`         |
| `no_response`      | Sem retorno          | `#292524` / `#d6d3d1` | 10,18:1   | `#f5f5f4` / `#57534e` | 6,99:1    | `#a8a29e`         |

Ativos (Inscrito a Proposta) têm cores vivas e distintas; encerrados recuam (verde, vermelho e dois neutros). A cor do status é ligada ao `value` da API, nunca ao rótulo. Nas colunas encerradas recolhidas, o nome usa `status-<value>-text` sobre `surface-sunken` (pelo menos 9,41:1 no escuro).

### Feedback

| Token          | Escuro    | Claro     | Uso                                                         |
| -------------- | --------- | --------- | ----------------------------------------------------------- |
| `success-bg`   | `#052e16` | `#f0fdf4` | Fundo do sinal de "salvo"                                   |
| `success-text` | `#86efac` | `#15803d` | Texto e ícone de sucesso                                    |
| `danger-bg`    | `#450a0a` | `#fef2f2` | Fundo de erro, hover de exclusão                            |
| `danger-text`  | `#fca5a5` | `#b91c1c` | Mensagem de erro do campo, texto de exclusão (7,71:1 no escuro sobre `surface`) |
| `danger-solid` | `#dc2626` | `#dc2626` | Botão de exclusão confirmando, borda de campo com erro      |
| `on-danger`    | `#ffffff` | `#ffffff` | Texto sobre `danger-solid` (4,83:1)                         |
| `warning-bg`   | `#451a03` | `#fffbeb` | Fundo de aviso de atenção                                   |
| `warning-text` | `#fcd34d` | `#b45309` | Texto de atenção                                            |
| `info-bg`      | `#172554` | `#eff6ff` | Fundo de aviso neutro                                       |
| `info-text`    | `#93c5fd` | `#1d4ed8` | Texto de aviso neutro                                       |

Os tons de feedback coincidem com alguns status (verde = Aprovado, vermelho = Reprovado), porque o sentido é o mesmo. Um aviso nunca parece um selo: ele tem ícone e fica no canto da tela.

## Tipografia

### Família

**Inter** em todo o app, com as fontes de interface do sistema como alternativa (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`). Números que se comparam (contagens, números do painel) usam algarismos de largura fixa (`tabular-nums`).

### Hierarquia

| Token                     | Tamanho | Peso | Altura da linha | Uso                                                       |
| ------------------------- | ------- | ---- | --------------- | --------------------------------------------------------- |
| `{typography.display}`    | 24px    | 600  | 32px            | Título de tela ("Currículos", "Painel")                   |
| `{typography.title}`      | 18px    | 600  | 28px            | Empresa no painel de detalhe, título do modal             |
| `{typography.heading}`    | 16px    | 600  | 24px            | Nome da coluna, títulos de seção, título de estado vazio  |
| `{typography.body}`       | 14px    | 400  | 20px            | Texto padrão: cargo, campos, notas                        |
| `{typography.body-strong}`| 14px    | 500  | 20px            | Empresa no card, itens do menu                            |
| `{typography.button}`     | 14px    | 500  | 20px            | Rótulo de botão                                           |
| `{typography.label}`      | 12px    | 500  | 16px            | Rótulo de campo, selo de status                           |
| `{typography.caption}`    | 12px    | 400  | 16px            | "há 3 dias", datas, contagens, mensagem de erro           |
| `{typography.number}`     | 30px    | 600  | 36px            | Números em destaque do painel                             |

### Princípios

- Nada menor que 12px e nada em maiúsculas.
- Peso 600 só em títulos e números de destaque; 500 para o que é clicável ou é rótulo; 400 para o resto.
- Sem espaçamento negativo entre letras: os títulos do app são pequenos.

## Layout

### Espaçamento

Base de **4px**, com incremento principal de 8px: `{spacing.xxs}` (4px) até `{spacing.xxxl}` (40px).

- Dentro de componentes (card, campo): `xxs` a `sm`.
- Entre componentes (cards na coluna, campos no painel): `xs` a `md`.
- Margens de tela e de painel: `xl`.

### Estrutura das telas

```
┌──────────┬──────────────────────────────────────────────────────┐
│  nav     │  cabeçalho: título · busca · [Nova candidatura]       │
│  220px   ├──────────────────────────────────────────────────────┤
│          │  conteúdo (kanban, currículos, painel)                │
│          │                                          ┌───────────┤
│          │                                          │  drawer   │
│          │                                          │  480px    │
└──────────┴──────────────────────────────────────────┴───────────┘
```

- **Menu lateral** fixo à esquerda (`{size.nav-width}`), com os três itens do [ui.md](ui.md).
- **Cabeçalho** de cada tela com título, busca e o botão primário. Não há barra de filtros.
- **Kanban**: colunas lado a lado, com `{spacing.sm}` entre elas, que dividem o espaço disponível entre `{size.column-min-width}` e `{size.column-max-width}` de largura; encerradas recolhidas em `{size.column-collapsed-width}`. Cada coluna rola sozinha na vertical.
- **Barras de rolagem** ficam escondidas em todo o app. A rolagem continua funcionando (roda do mouse, trackpad, teclado); só a barra não aparece.
- **Painel lateral** (`{size.drawer-width}`) desliza da direita por cima do conteúdo; o conteúdo atrás continua visível.
- Telas sem kanban (currículos, painel) têm largura máxima de 1200px.

## Elevação

| Nível                 | Escuro (padrão)                             | Claro                                        | Uso                                      |
| --------------------- | ------------------------------------------- | -------------------------------------------- | ---------------------------------------- |
| `{elevation.flat}`    | nenhuma, só borda `{colors.border}`         | igual                                        | Cards, colunas, tudo em repouso          |
| `{elevation.raised}`  | `rgba(0, 0, 0, 0.30) 0px 1px 2px 0px`       | `rgba(15, 23, 42, 0.06) 0px 1px 2px 0px`     | Card com o mouse em cima                 |
| `{elevation.dragging}`| `rgba(0, 0, 0, 0.50) 0px 8px 24px -4px`     | `rgba(15, 23, 42, 0.12) 0px 8px 24px -4px`   | Card sendo arrastado                     |
| `{elevation.overlay}` | `rgba(0, 0, 0, 0.50) 0px 16px 48px -8px`    | `rgba(15, 23, 42, 0.16) 0px 16px 48px -8px`  | Painel lateral, modal, menus, avisos     |
| `{elevation.backdrop}`| `rgba(2, 6, 23, 0.70)` (fundo)              | `rgba(15, 23, 42, 0.40)` (fundo)             | Atrás do modal                           |

No escuro, sombra quase não aparece; por isso o que está por cima também é **mais claro** (`surface` sobre `surface-sunken` sobre `bg`). As sombras usam preto ou o tom de `text-primary` do tema claro com transparência, sem introduzir cor nova. O painel lateral não escurece o fundo (o usuário continua vendo o kanban); só o modal usa `backdrop`.

## Formas

| Token           | Valor  | Uso                                                   |
| --------------- | ------ | ----------------------------------------------------- |
| `{rounded.xs}`  | 4px    | Esqueleto de carregamento de texto                    |
| `{rounded.sm}`  | 6px    | Selo de status, botão fantasma, campo no lugar, tooltip |
| `{rounded.md}`  | 8px    | Botões, campos, card de candidatura, aviso, item de menu |
| `{rounded.lg}`  | 12px   | Coluna do kanban, modal, card de currículo, painel |
| `{rounded.full}`| 9999px | Ponto de status e barra do painel                     |

## Movimento

- `{motion.fast}` (120ms): hover, foco, troca de cor.
- `{motion.base}` (180ms): abrir menus, avisos, card mudando de coluna.
- `{motion.slow}` (240ms): painel lateral e modal entrando e saindo.
- Com a preferência do sistema por menos movimento, as transições viram troca imediata.

## Componentes

### Botões

**`button-primary`**: a ação principal da tela, no máximo um por tela ("Nova candidatura", "Salvar" do modal, "Enviar PDF").
- Fundo `{colors.primary}`, texto `{colors.on-primary}`, `{typography.button}`, altura `{size.control-md}`, cantos `{rounded.md}`. Hover em `{colors.primary-hover}`.

**`button-secondary`**: ações comuns ao lado da primária ("Cancelar").
- Fundo `{colors.surface}`, borda `1px {colors.border}`, texto `{colors.text-primary}`. Hover em `{colors.surface-sunken}`.

**`button-ghost`**: ações de ícone e ações discretas (recolher coluna, "X" do painel, editar e excluir evento).
- Sem fundo, texto `{colors.text-secondary}`, altura `{size.control-sm}`, cantos `{rounded.sm}`. Hover em `{colors.surface-sunken}` com texto `{colors.text-primary}`.

**`button-danger`** e **`button-danger-confirm`**: exclusão com confirmação em dois cliques.
- Primeiro estado: sem fundo, texto `{colors.danger-text}` ("Excluir candidatura").
- Segundo estado, depois do primeiro clique: fundo `{colors.danger-solid}`, texto `{colors.on-danger}` ("Confirmar exclusão?"). Volta ao primeiro estado em 4 segundos ou ao clicar fora.

**`button-disabled`**: fundo `{colors.border}` e texto `{colors.text-muted}` (3,86:1; estado desabilitado dispensado da exigência de contraste). Sempre com tooltip explicando o motivo (ex.: excluir currículo em uso).

### Campos

**`text-input`**: campos do modal de nova candidatura e a busca.
- Fundo `{colors.surface}`, borda `1px {colors.border-input}`, texto `{typography.body}` em `{colors.text-primary}`, exemplo em `{colors.text-muted}`, altura `{size.control-md}`.
- Foco (`text-input-focused`): borda `{colors.primary}` e anel de 2px em `{colors.focus}`.
- Erro (`text-input-error`): borda `{colors.danger-solid}` e mensagem embaixo em `{typography.caption}` + `{colors.danger-text}`, vinda do `details` da API.

**`inline-field`**: os campos do painel de detalhe e de currículos, editados no lugar.
- Em repouso parece texto: sem borda e sem fundo. Vazio, mostra o exemplo em `{colors.text-muted}`.
- Com o mouse em cima, fundo `{colors.surface-sunken}`, indicando que é clicável.
- Editando, vira campo: fundo `{colors.surface}`, borda `{colors.border-input}`, anel `{colors.focus}`.
- Ao salvar, um ícone de confirmação em `{colors.success-text}` aparece ao lado por 1,5 segundo.

**`search-field`**: busca do cabeçalho, com ícone de lupa e o atalho `/` indicado à direita em `{typography.caption}`.

**`note-composer`**: o campo "Adicionar nota" no topo da linha do tempo. Sempre visível, com o link "agora" à direita para escolher outra data.

### Placeholders

**Todo campo tem placeholder.** Ele mostra um exemplo do que escrever, não repete o rótulo, e usa `{colors.text-muted}`.

| Tipo de campo         | Como fica o placeholder                                                              |
| --------------------- | ------------------------------------------------------------------------------------ |
| Texto                 | Um exemplo real: "Ex.: Acme Tecnologia", "Ex.: Desenvolvedora Backend Sênior"        |
| Link                  | "https://..."                                                                        |
| Texto longo           | O que costuma ir ali: "Nome, e-mail ou telefone do recrutador"                       |
| Seleção (`select`)    | Primeira opção vazia com o convite: "Selecione o currículo", "Selecione o modelo"    |
| Data                  | O formato vem do navegador (`dd/mm/aaaa`); o rótulo diz o que é a data              |
| Busca                 | O que dá para buscar: "Buscar empresa ou cargo"                                      |
| Campo no lugar vazio  | O convite para preencher: "Adicionar localização", "Colar o link da vaga"            |

Regras: o placeholder some quando o campo tem valor; nunca é o único rótulo de um campo obrigatório (o rótulo continua visível ou em `aria-label`); e não leva informação que a pessoa precise depois de começar a digitar.

### Ícones

Todos os ícones são do **[Lucide](https://lucide.dev)** (licença ISC): traço de 2px, cantos arredondados, cor `currentColor` (herdam a cor do texto). Tamanho de 16px; 12px nos metadados do card.

| Uso                          | Ícone Lucide       |
| ---------------------------- | ------------------ |
| Menu: Candidaturas / Kanban  | `square-kanban`    |
| Menu: Currículos, currículo  | `file-text`        |
| Menu: Painel                 | `chart-column`     |
| Nova candidatura             | `plus`             |
| Busca                        | `search`           |
| Fechar                       | `x`                |
| Excluir                      | `trash-2`          |
| Editar                       | `pencil`           |
| Mudança de status            | `arrow-right`      |
| Nota                         | `message-square`   |
| Criação                      | `circle-plus`      |
| Salvo, sucesso               | `check`            |
| Abrir link ou PDF            | `external-link`    |
| Remoto / Híbrido / Presencial| `house` / `shuffle` / `building-2` |
| Enviar PDF                   | `upload`           |
| Último evento, data          | `clock`            |
| Abrir / recolher             | `chevron-down` / `chevron-right` |
| Ordenação                    | `arrow-up` / `arrow-down` |
| Aviso neutro / atenção       | `info` / `triangle-alert` |
| Tema escuro / claro          | `moon` / `sun`     |

Ícone sozinho (sem texto) sempre tem `aria-label` e dica (`title`).

### Status

**`status-badge`**: o status em texto, no detalhe e nos eventos.
- Fundo `{colors.status-<value>-bg}`, texto `{colors.status-<value>-text}`, `{typography.label}`, cantos `{rounded.sm}`.

**`status-dot`**: ponto de 8px em `{colors.status-<value>-accent}`, sempre ao lado do nome do status.

O seletor de status do painel de detalhe mostra o `status-badge` do status atual; ao abrir, lista os 9 status com o ponto e o nome.

### Kanban

**`kanban-column`**: fundo `{colors.surface-sunken}`, cantos `{rounded.lg}`, largura flexível entre `{size.column-min-width}` e `{size.column-max-width}`. Cards empilhados com `{spacing.xs}` entre eles.

**`kanban-column-header`**: ponto do status, nome em `{typography.heading}`, contagem em `{typography.caption}` + `{colors.text-secondary}`; nas colunas encerradas, o botão de recolher (`button-ghost`) à direita. Não há botão de criar na coluna.

**`kanban-column-collapsed`**: coluna encerrada recolhida, com `{size.column-collapsed-width}` de largura; mostra o ponto, a contagem e o nome na vertical em `{colors.status-<value>-text}`. Um clique expande.

**`application-card`**
- Fundo `{colors.surface}`, borda `1px {colors.border}`, borda esquerda de 3px em `{colors.status-<value>-accent}`, cantos `{rounded.md}`, espaçamento interno `{spacing.sm}`.
- Conteúdo, de cima para baixo: empresa (`{typography.body-strong}`); cargo (`{typography.body}` + `{colors.text-secondary}`); linha de metadados em `{typography.caption}` + `{colors.text-muted}` com ícone do modelo de trabalho, nome do currículo e "há 3 dias".
- Hover: `{elevation.raised}`. Arrastando: `{elevation.dragging}` e leve rotação. Recém-criado: fundo `{colors.primary-subtle}` por 2 segundos.

### Sobreposições

**`drawer`** (painel lateral de detalhe): `{size.drawer-width}`, fundo `{colors.surface}`, borda esquerda `{colors.border}`, `{elevation.overlay}`. De cima para baixo: empresa (`{typography.title}`) e seletor de status; dados em `inline-field`; seção "Histórico" com `note-composer` e `timeline-item`; `button-danger` no rodapé.

**`modal`** (nova candidatura): `{size.modal-width}`, cantos `{rounded.lg}`, `{elevation.overlay}`, fundo atrás em `{elevation.backdrop}`. Rodapé com `button-secondary` ("Cancelar") e `button-primary` ("Salvar").

**`toast`** (avisos): canto inferior direito, fundo `{colors.surface}`, borda `{colors.border}`, `{elevation.overlay}`. Ícone colorido conforme o tipo (`info`, `success`, `danger`) e até dois botões de ação (`button-ghost`), como "Desfazer" e "Adicionar nota".

**`tooltip`**: fundo `{colors.text-primary}`, texto `{colors.surface}` (17,85:1), `{typography.caption}`.

### Linha do tempo

**`timeline-item`**: ícone por tipo de evento à esquerda, ligado ao próximo por uma linha vertical em `{colors.border}`.
- Criação: ícone de "+" em `{colors.text-muted}`; texto "Candidatura criada" com o `status-badge` inicial.
- Mudança de status: ícone de seta; texto com o `status-badge` de origem e o de destino.
- Nota: ícone de balão; o texto da nota em `{typography.body}`.
- Data em `{typography.caption}` + `{colors.text-muted}`. Editar e excluir (`button-ghost`) aparecem só com o mouse em cima.

### Currículos

**`resume-card`**: fundo `{colors.surface}`, borda `{colors.border}`, cantos `{rounded.lg}`. Nome (`inline-field` em `{typography.body-strong}`), descrição (`inline-field`), nome do arquivo como link em `{colors.primary-text}`, "usado em N candidaturas" como `button-ghost` que expande a lista.

**`dropzone`**: área para soltar o PDF. Em repouso: fundo `{colors.surface-sunken}`, borda tracejada `{colors.border-input}`, texto `{colors.text-secondary}`. Com um arquivo sendo arrastado por cima (`dropzone-active`): fundo `{colors.primary-subtle}`, borda tracejada de 2px em `{colors.primary}`. Quando o arquivo é arrastado sobre a tela inteira, a tela toda vira `dropzone-active`.

### Painel

**`stat-tile`**: número em `{typography.number}` + `{colors.text-primary}` e rótulo em `{typography.body}` + `{colors.text-secondary}`. Quatro lado a lado: total, ativas, encerradas, últimos 30 dias.

**`status-bar`**: uma linha por status com ponto, nome, barra (trilho em `{colors.surface-sunken}`, preenchimento em `{colors.status-<value>-accent}`, 8px de altura, `{rounded.full}`) e contagem. A linha inteira é clicável e leva para a coluna daquele status no kanban.

### Navegação

**`nav`**: menu lateral com fundo `{colors.surface}` e borda direita `{colors.border}`.

**`nav-item`**: ícone + texto em `{typography.body-strong}` + `{colors.text-secondary}`, altura `{size.control-md}`. Ativo (`nav-item-active`): fundo `{colors.primary-subtle}`, texto `{colors.primary-subtle-text}`.

### Estados

**`skeleton`**: blocos em `{colors.surface-sunken}` no formato do conteúdo (cards nas colunas) enquanto carrega.

**`empty-state`**: centralizado, título em `{typography.heading}`, texto em `{typography.body}` + `{colors.text-secondary}` e o botão da ação correspondente.

**Foco**: todo elemento interativo mostra anel de 2px em `{colors.focus}` quando focado pelo teclado (não com clique).

## Logo e favicon

Arquivos em [assets/](assets/). O símbolo é um quadro kanban: três colunas (`{colors.primary-hover}`) com cards brancos (`{colors.on-primary}`) sobre um quadrado `{colors.primary}` de cantos arredondados. As colunas têm 2, 3 e 1 card, como um quadro em uso.

| Arquivo                                       | Uso                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------- |
| [logo.svg](assets/logo.svg)                   | Símbolo + nome "Candidaturas", sobre fundo claro (menu no tema claro) |
| [logo-on-dark.svg](assets/logo-on-dark.svg)   | Mesmo logo com o nome em branco, para fundo escuro (menu no tema escuro, o padrão) |
| [logo-mark.svg](assets/logo-mark.svg)         | Só o símbolo (64×64), quando falta espaço para o nome               |
| [logo-mark-mono.svg](assets/logo-mark-mono.svg) | Símbolo em uma cor (`currentColor`): herda a cor do texto ao redor |
| [favicon.svg](assets/favicon.svg)             | Ícone da aba do navegador, desenhado para 16–32px                   |
| [icon-maskable.svg](assets/icon-maskable.svg) | Ícone de app (512×512) com fundo até a borda e desenho na área segura |

Regras:

- Não mude as cores do símbolo nem recrie o desenho em outras proporções; use o arquivo mais próximo do tamanho necessário.
- Espaço livre em volta do logo de pelo menos metade da altura do símbolo.
- Abaixo de 24px use o `favicon.svg`, não o `logo-mark.svg`.
- O nome no `logo.svg` é texto com a fonte Inter. No navegador, a fonte do app já está carregada; para usar o logo fora dele (imagem, documento), converta o texto em contorno antes.
- Navegadores que não aceitam favicon em SVG precisam de uma versão PNG ou ICO gerada a partir do `favicon.svg`.

## Faça e não faça

### Faça

- Use a cor do status sempre junto com o nome do status, nunca sozinha.
- Use `{colors.primary}` só para ação (botão principal, área de soltar ativa) e `{colors.primary-text}` para links e botões de link.
- Mantenha um único `button-primary` por tela.
- Deixe superfícies em repouso planas, com borda `{colors.border}`; sombra só para o que está por cima.
- Use `inline-field` para editar dados; formulário com botão de salvar só no modal de nova candidatura.
- Pegue a cor de cada status pelo `value` da API.

### Não faça

- Não use a cor de status em botões, links ou fundos de tela.
- Não use `{colors.primary}` em texto corrido nem em grandes áreas de fundo.
- Não coloque `{colors.text-muted}` sobre `{colors.surface-sunken}`.
- Não use botões em formato de pílula.
- Não crie cores fora da seção de cores deste arquivo; cor nova entra nos dois temas, com o contraste conferido.
- Não use modal para confirmar exclusão: use o `button-danger-confirm`.

## Responsividade

O app é pensado para o computador (o uso no celular é uma questão em aberto no [ui.md](ui.md)).

| Largura          | Comportamento                                                                 |
| ---------------- | ----------------------------------------------------------------------------- |
| ≥ 1800px         | Kanban com as 5 colunas ativas abertas e as 4 encerradas recolhidas, sem rolagem lateral; as colunas crescem até `{size.column-max-width}` |
| 1024 – 1799px    | Mesmo layout; o kanban rola na horizontal; o painel lateral cobre o fim do quadro |
| < 1024px         | Não definido (ver questões em aberto)                                         |

- Área clicável mínima de 28px (`{size.control-sm}`) no computador. Se o app for usado no celular, controles sobem para 44px e campos para 16px de texto.

## Como evoluir

1. Mude um componente por vez e referencie tokens pelo nome.
2. Cor nova entra em `colors` e `colors-light` ao mesmo tempo, com o contraste conferido nos dois temas.
3. Componente novo entra como uma entrada nova em `components:` e na seção correspondente.
4. Texto padrão é sempre `{typography.body}`.
5. Antes de criar um componente, confira se um existente com outro estado resolve.

## Protótipo

O [protótipo](prototype/index.html) aplica este design system e as telas do [ui.md](ui.md) em HTML, CSS e JavaScript puros (`index.html`, `index.css`, `main.js`). Abra o `index.html` direto no navegador; não precisa de servidor nem de instalação.

- Os tokens viram variáveis CSS com os mesmos nomes (`--color-text-primary`, `--rounded-md`...), e cada status expõe `--s-bg`, `--s-text` e `--s-accent` a partir do atributo `data-status`.
- Abre no tema escuro. O botão "Usar tema claro", no menu, troca o tema (`data-theme` no `<html>`) e a escolha fica salva no navegador.
- Os ícones são os do Lucide, copiados para o `main.js` a partir do pacote `lucide@0.460.0`; o protótipo não depende de CDN para eles.
- Os dados são de exemplo e ficam só no navegador (`localStorage`). Uma "api" em memória aplica as mesmas regras da API real (evento ao mudar status, currículo em uso não pode ser excluído, só PDF...). "Restaurar dados de exemplo", no menu, volta ao início.
- PDFs enviados funcionam até recarregar a página; os currículos de exemplo não têm arquivo.

## Lacunas conhecidas

- **Celular** (< 1024px): não definido.
- **Nome do app**: não há nome de marca definido; o logo usa "Candidaturas".
