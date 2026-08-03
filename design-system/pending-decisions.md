# Pendências para retomada

Status: **Proposto**
Última revisão: 2026-08-03

## Finalidade

Este arquivo preserva o backlog de decisões e atividades identificado durante o piloto do Design System do Desmonte. Os itens abaixo não representam regras aprovadas e devem ser concluídos pelos responsáveis indicados antes da alteração do status dos documentos relacionados.

## Prioridade 1 — Aprovar o cadastro estruturado em seções

Documento relacionado: [Cadastro estruturado em seções](./source-of-truth/patterns/structured-registration.md).

- [ ] Definir a hierarquia tipográfica definitiva do título da página.
  - Responsáveis: Produto e Design.
  - Conclusão: tipografia, peso, tamanho e comportamento responsivo registrados na fonte da verdade.
- [ ] Definir o posicionamento da navegação contextual entre `768px` e `1024px`.
  - Responsáveis: Produto e Design, com validação de QA.
  - Conclusão: ordem, persistência e comportamento de rolagem documentados para tablet.
- [ ] Definir a navegação entre seções e a persistência das ações no mobile.
  - Responsáveis: Produto e Design, com validação de QA.
  - Conclusão: mecanismo mobile aprovado, incluindo alcance da ação principal e retorno à seção com erro.
- [ ] Confirmar a matriz mínima de estados sistêmicos do padrão.
  - Responsáveis: Produto, Design e QA.
  - Conclusão: estados de carregamento, gravação, validação, desabilitado, permissão, sucesso, erro e vazio possuem comportamento e critério de aceite.
- [ ] Validar acessibilidade de rótulos, ajuda, erros, foco e navegação por teclado.
  - Responsáveis: Design, QA e Desenvolvimento.
  - Conclusão: requisitos verificáveis registrados e divergências entre Peças v2 e Grupos resolvidas.
- [ ] Aprovar, revisar ou rejeitar o padrão após as decisões anteriores.
  - Responsável pela decisão funcional: Produto.
  - Conclusão: status, vigência, exemplos e decisão correspondente atualizados em conjunto.

## Prioridade 2 — Continuar a reconciliação

Documentos relacionados: [Inventário das fontes](./source-of-truth/source-inventory.md) e [Matriz de reconciliação](./source-of-truth/reconciliation-matrix.md).

- [ ] Reconciliar cor primária, escala de espaçamento, hierarquia tipográfica, tema escuro e larguras de layout.
  - Responsáveis: Produto e Design; tema também requer Desenvolvimento.
- [ ] Delimitar e inventariar uma amostra representativa das telas de Estoque no Desmonte.
  - Responsável funcional: Produto.
- [ ] Selecionar demandas recentes representativas sem promover uma demanda isolada a regra transversal.
  - Responsável funcional: Produto.
- [ ] Confirmar ou revisar os princípios iniciais do Design System.
  - Responsáveis: Produto, Design, QA e Desenvolvimento conforme o tema.
- [ ] Nomear mantenedores, fórum de aprovação e responsável pela publicação das versões.
  - Responsável inicial: Produto.

## Prioridade 3 — Preparar os entregáveis posteriores

- [ ] Planejar a biblioteca visual com foundations, componentes, estados e modelos aprovados.
- [ ] Encaminhar ao Desenvolvimento a definição do contrato técnico e da estratégia de distribuição.
- [ ] Estruturar o contrato de qualidade com checklists, matrizes e critérios de conformidade.
- [ ] Definir formato, distribuição e validação do contexto versionado para IA.

## Ponto seguro de retomada

Retomar pela decisão de responsividade do cadastro estruturado em seções. Comparar as alternativas de Peças v2 e Grupos para tablet e mobile, validar a continuidade das capacidades essenciais e registrar a decisão antes de aprovar o padrão.
