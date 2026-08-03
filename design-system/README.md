# Design System do Desmonte

Status: **estrutura inicial**  
Fase atual: **reconciliação das fontes**  
Responsável funcional: **Produto**  
Responsáveis técnicos: **a definir pela equipe de desenvolvimento**

## Objetivo

Consolidar a linguagem de interface do Desmonte em um sistema versionado de decisões, componentes, padrões e critérios de qualidade que oriente produto, prototipação, desenvolvimento, revisão e evolução das telas.

Este repositório contém o protótipo fundador do style guide e passa a hospedar também sua fonte da verdade funcional. A aplicação Angular existente continua sendo uma referência visual e executável, mas seus exemplos somente se tornam normativos depois de reconciliados e aprovados.

## Escopo do produto

- O Design System é normativo somente para o Desmonte e para as telas que serão incorporadas ao Desmonte.
- O e-commerce é um produto separado, com linguagem e comportamento próprios, e não constitui fonte de evidência para este Design System por padrão.
- O ERP legado não será reconciliado nem utilizado como referência futura, pois será migrado para o Desmonte e descontinuado.
- Uma referência externa somente poderá ser incorporada mediante decisão explícita que delimite o elemento compartilhado e seu impacto.

## Base operacional de consolidação

- O conteúdo fundador deste repositório, o Cadastro de Peças v2 e o Cadastro de Grupos de Peças formam a base operacional inicial do Design System.
- Padrões coerentes entre essas fontes podem ser reutilizados em novas demandas durante a consolidação, com identificação da origem e da versão consultada.
- A autorização de uso das fontes não transforma automaticamente cada detalhe local em regra normativa; divergências, lacunas e exceções continuam sujeitas à reconciliação por objeto.

## Resultado final esperado

O design system deverá manter cinco entregáveis conectados:

1. **Fonte da verdade funcional** — princípios, foundations, componentes, padrões, conteúdo, acessibilidade, responsividade, exceções e decisões.
2. **Biblioteca visual** — variáveis, componentes, variantes, estados, composições e modelos de tela.
3. **Contrato técnico** — tokens, temas, assets, componentes de código, documentação técnica e versionamento definidos pelos desenvolvedores.
4. **Contrato de qualidade** — critérios de aceite, checklists e validações de conformidade.
5. **Contexto para IA** — regras e exemplos versionados para agentes de prototipação, desenvolvimento e revisão.

## Responsabilidades

- Produto define problema, comportamento esperado, regras de uso, prioridade e aceite.
- Design materializa e valida a linguagem visual e os comportamentos de experiência.
- Desenvolvimento decide arquitetura, tecnologias, empacotamento e integração.
- Qualidade participa da definição e validação dos estados, da acessibilidade e da prevenção de regressões.
- Diretoria valida decisões de marca ou direção de produto que ultrapassem o escopo operacional.

## Navegação

- [Governança](./governance.md)
- [Plano de entregáveis](./deliverables.md)
- [Fonte da verdade](./source-of-truth/README.md)
- [Princípios iniciais](./source-of-truth/principles.md)
- [Inventário das fontes](./source-of-truth/source-inventory.md)
- [Matriz de reconciliação](./source-of-truth/reconciliation-matrix.md)
- [Registro de decisões](./source-of-truth/decision-log.md)
- [Pendências para retomada](./pending-decisions.md)
- [Cadastro estruturado em seções](./source-of-truth/patterns/structured-registration.md)
- [Contexto para IA](./ai/README.md)

## Status normativo

Todo conteúdo deve estar identificado como:

- **Proposto:** ainda depende de validação.
- **Aprovado:** decisão vigente e aplicável.
- **Em revisão:** decisão vigente sendo reavaliada.
- **Descontinuado:** não deve ser utilizado em novas demandas.
- **Exceção:** uso autorizado apenas no contexto registrado.

Exemplos existentes no frontend não criam regras automaticamente.
