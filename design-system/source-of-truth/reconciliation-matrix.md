# Matriz de reconciliação

Status: **iniciada**

## Classificações

- **Vigente:** aplicado e confirmado como regra futura.
- **Evoluído:** originado em uma fonte, mas substituído posteriormente.
- **Não adotado:** documentado ou prototipado, mas não incorporado.
- **Descontinuado:** não deve ser reutilizado.
- **Exceção:** válido apenas no contexto registrado.
- **Conflitante:** fontes divergem e exigem decisão.
- **Inconclusivo:** evidência insuficiente.

## Foundations

| ID | Regra ou elemento | Style guide | Peças v2 | Grupos | Estoque | Recentes | Classificação | Decisor |
|---|---|---|---|---|---|---|---|---|
| REC-001 | Azul primário `#0066ff` | Definido como `azul-500` | Aplicado | Replicado localmente | Pendente | Pendente | Inconclusivo | Produto/Design |
| REC-002 | Escala de espaçamento 4/8/16/24/48 | Definida | Aplicada como base | Parcialmente replicada | Pendente | Pendente | Inconclusivo | Produto/Design |
| REC-003 | Hierarquia tipográfica | H1–H6 definida; há valor provisório | Poppins no título e Roboto no corpo | Mesma direção | Pendente | Pendente | Conflitante | Produto/Design |
| REC-004 | Tema escuro | `body.dark-theme` | `.alternative` e `.dark-theme` | `.alternative` | Pendente | Pendente | Conflitante | Design/Dev |
| REC-005 | Largura de layout | Container geral de `1440px` | Principal `784px` + lateral | Principal `784px` + lateral | Pendente | Pendente | Conflitante | Produto/Design |

## Componentes e padrões

| ID | Regra ou elemento | Style guide | Peças v2 | Grupos | Estoque | Recentes | Classificação | Decisor |
|---|---|---|---|---|---|---|---|---|
| REC-101 | Cartão de seção | Demonstrado | Aplicado | Aplicado localmente | Pendente | Pendente | Inconclusivo | Produto/Design |
| REC-102 | Hierarquia de botões | Primário, secundário e terciário | Aplicada | Aplicada parcialmente | Pendente | Pendente | Inconclusivo | Produto/Design |
| REC-103 | Navegação lateral/scrollspy | Demonstrada | Aplicada com ações | Aplicada com duas seções | Pendente | Pendente | Inconclusivo | Produto/Design |
| REC-104 | Campo com rótulo externo | Demonstrado | Aplicado com associações acessíveis | Aplicado com lacunas de associação | Pendente | Pendente | Inconclusivo | Produto/Design/QA |
| REC-105 | Tabela operacional | Demonstrada em variações | Não é núcleo do cadastro | Aplicada via PrimeNG | Pendente | Pendente | Inconclusivo | Produto/Design |
| REC-106 | Upload de mídia | Demonstrado com TODOs | Implementação mais completa | Não aplicável | Pendente | Pendente | Evoluído provável | Produto/Design |

## Próximas inclusões

1. Inventariar Estoque.
2. Identificar demandas recentes que alteraram o padrão.
3. Comparar cada componente do frontend deste repositório com o comportamento implementado.
4. Transformar conflitos em pautas objetivas de decisão.
