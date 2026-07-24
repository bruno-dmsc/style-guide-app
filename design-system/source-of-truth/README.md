# Fonte da verdade

Status geral: **em preparação**

## Finalidade

Esta é a referência normativa das decisões de experiência e interface do Desmonte. Ela deve explicar regra, contexto, estados, limites, acessibilidade e exceções — e não funcionar somente como galeria visual.

## Estrutura prevista

```text
source-of-truth/
  principles.md
  source-inventory.md
  reconciliation-matrix.md
  decision-log.md
  foundations/
    colors.md
    typography.md
    spacing.md
    dimensions-and-density.md
    borders-and-elevation.md
    iconography.md
    motion.md
    themes.md
  components/
    actions/
    forms/
    navigation/
    data/
    feedback/
    overlays/
  patterns/
    listing-and-search.md
    long-form.md
    editing.md
    destructive-operations.md
    asynchronous-states.md
    media-upload.md
    responsiveness.md
  content/
    voice-and-tone.md
    terminology.md
    messages.md
  accessibility/
    principles.md
    keyboard-and-focus.md
    semantics.md
    contrast.md
  exceptions/
  glossary.md
```

As pastas serão abertas conforme as decisões forem reconciliadas. A organização poderá ser ajustada, mas a cobertura funcional não deve ser perdida.

## Modelo obrigatório de regra

```markdown
# Nome da regra

Status: Proposto | Aprovado | Em revisão | Descontinuado | Exceção
Versão de vigência:
Responsável:
Última revisão:

## Objetivo
## Quando usar
## Quando não usar
## Anatomia ou composição
## Variações permitidas
## Estados obrigatórios
## Comportamento responsivo
## Acessibilidade
## Conteúdo e terminologia
## Exemplos aprovados
## Antipadrões
## Exceções conhecidas
## Evidências e referências
## Decisões relacionadas
```

## Regras editoriais

- Exemplos não criam regras por si mesmos.
- Toda regra deve possuir status.
- Lacunas não podem ser preenchidas por inferência de uma IA.
- Decisões técnicas devem ser identificadas como responsabilidade do desenvolvimento.
- Mudanças incompatíveis devem registrar impacto e adoção.
- Figma, código e IA devem indicar a versão desta fonte utilizada.
