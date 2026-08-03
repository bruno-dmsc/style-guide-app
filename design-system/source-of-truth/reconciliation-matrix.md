# Matriz de reconciliação

Status: **iniciada**

Escopo: somente referências e demandas do Desmonte. E-commerce e ERP legado ficam fora desta matriz conforme a decisão de escopo vigente.

Base operacional: style guide fundador, Cadastro de Peças v2 e Cadastro de Grupos de Peças. Coerência entre essas fontes fortalece a reutilização, mas não substitui a classificação e a aprovação de cada objeto.

## Classificações

- **Vigente:** aplicado e confirmado como regra futura.
- **Evoluído:** originado em uma fonte, mas substituído posteriormente.
- **Não adotado:** documentado ou prototipado, mas não incorporado.
- **Descontinuado:** não deve ser reutilizado.
- **Exceção:** válido apenas no contexto registrado.
- **Conflitante:** fontes divergem e exigem decisão.
- **Inconclusivo:** evidência insuficiente.

## Foundations

| ID | Regra ou elemento | Style guide | Peças v2 | Grupos | Estoque | Recentes Desmonte | Classificação | Decisor |
|---|---|---|---|---|---|---|---|---|
| REC-001 | Azul primário `#0066ff` | Definido como `azul-500` | Aplicado | Replicado localmente | Pendente | Pendente | Inconclusivo | Produto/Design |
| REC-002 | Escala de espaçamento 4/8/16/24/48 | Definida | Aplicada como base | Parcialmente replicada | Pendente | Pendente | Inconclusivo | Produto/Design |
| REC-003 | Hierarquia tipográfica | H1–H6 definida; há valor provisório | Poppins no título e Roboto no corpo | Mesma direção | Pendente | Pendente | Conflitante | Produto/Design |
| REC-004 | Tema escuro | `body.dark-theme` | `.alternative` e `.dark-theme` | `.alternative` | Pendente | Pendente | Conflitante | Design/Dev |
| REC-005 | Largura de layout | Container geral de `1440px` | Principal `784px` + lateral | Principal `784px` + lateral | Pendente | Pendente | Conflitante | Produto/Design |

## Componentes e padrões

| ID | Regra ou elemento | Style guide | Peças v2 | Grupos | Estoque | Recentes Desmonte | Classificação | Decisor |
|---|---|---|---|---|---|---|---|---|
| REC-101 | Cartão de seção | Documentado como contêiner | Aplicado em quatro seções | Aplicado em duas seções | Pendente | Pendente | Vigente | Produto/Design |
| REC-102 | Hierarquia de botões | Primário, secundário e terciário | Duas modalidades, cancelar e transição para legado | Salvar e cancelar | Pendente | Pendente | Vigente | Produto/Design |
| REC-103 | Navegação lateral/scrollspy | Recomendada a partir de dois cartões | Lateral fixa, quatro seções e seção ativa observada | Lateral fixa, duas seções e seção ativa por rolagem | Pendente | Pendente | Vigente | Produto/Design |
| REC-104 | Campo com rótulo externo | Demonstrado com ajuda e erro | Aplicado com associações explícitas em campos principais | Aplicado com lacunas de associação | Pendente | Pendente | Vigente | Produto/Design/QA |
| REC-105 | Tabela operacional | Demonstrada em variações | Não é núcleo do cadastro | Aplicada via PrimeNG | Pendente | Pendente | Inconclusivo | Produto/Design |
| REC-106 | Upload de mídia | Demonstrado com TODOs | Implementação mais completa | Não aplicável | Pendente | Pendente | Evoluído provável | Produto/Design |
| REC-107 | Associação acessível de rótulo, obrigatoriedade e erro | Rótulo visual sem associação completa documentada | Evidência mais madura em campos principais | Rótulos visuais sem associação explícita em parte dos campos | Pendente | Pendente | Evoluído provável | Design/QA/Dev |
| REC-108 | Navegação e ações responsivas do cadastro em seções | Lateral direita fixa; mobile não definido | Conteúdo seguido da lateral no tablet; menu flutuante de ações no mobile sem navegação por seção | Navegação e ações antes do conteúdo no tablet/mobile | Pendente | Pendente | Conflitante | Produto/Design/QA |

## Próximas inclusões

1. Decidir navegação contextual e persistência das ações entre tablet e mobile.
2. Validar a matriz de estados e os requisitos acessíveis do cadastro em seções.
3. Aprovar ou revisar a especificação proposta do padrão.
4. Aplicar o padrão consolidado às demandas recentes e registrar somente evoluções, conflitos e exceções reais.
