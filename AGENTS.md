# AGENTS.md

Orientações para agentes de IA trabalhando neste projeto.

## Regra principal

**Leia a documentação antes de qualquer decisão. Nunca presuma nada.**

Antes de escrever código, criar arquivos, sugerir mudanças ou responder dúvidas sobre o projeto, leia os documentos em [specs/](specs/). Se a resposta não estiver na documentação, pergunte. Não invente.

## Documentação

| Documento | Conteúdo |
| --------- | -------- |
| [specs/overview.md](specs/overview.md) | Contexto do app, objetivos, conceitos, funcionalidades, escopo e premissas |
| [specs/domain.md](specs/domain.md) | Models, enums, interfaces de entrada e saída e regras de negócio |
| [specs/stack.md](specs/stack.md) | Tecnologias já decididas para o projeto |
| [specs/api.md](specs/api.md) | Checklist das rotas: método, caminho, payload, resposta e testes |

Leia sempre o `overview.md` primeiro. Depois leia os documentos relacionados à tarefa.

## Como trabalhar

1. **Leia antes de agir.** No início de cada tarefa, leia os documentos relevantes, mesmo que já tenha lido antes. A documentação pode ter mudado.
2. **Siga o que está escrito.** Nomes de campos, rotas, status, regras de negócio e códigos de erro devem ser exatamente os da documentação.
3. **Não presuma.** Se algo não está documentado, está ambíguo ou parece contraditório, pare e pergunte antes de seguir. Não preencha lacunas com suposições, "boas práticas" ou o que "provavelmente" é o esperado.
4. **Não decida sozinho.** Escolhas de stack, bibliotecas, estrutura de pastas, novas rotas, novos campos ou mudanças de regra são decisões minhas. Proponha, explique e espere a confirmação.
5. **Não amplie o escopo.** Implemente só o que foi pedido e o que está documentado. Respeite a seção "Fora do escopo" do `overview.md`.
6. **Mantenha a documentação atualizada.** Quando uma decisão nova for tomada, atualize o documento correspondente em `specs/` junto com o código. A documentação é a fonte da verdade.
7. **Use o checklist da API.** Ao implementar uma rota de [specs/api.md](specs/api.md), implemente também os testes listados e marque o item como concluído (`[x]`) só quando a rota e todos os testes dela estiverem prontos e passando.

## Quando houver conflito

- Se o código e a documentação divergirem, a documentação vale. Aponte a divergência e pergunte como resolver.
- Se dois documentos se contradisserem, não escolha um. Aponte a contradição e pergunte.
