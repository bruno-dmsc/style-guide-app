# Inventário das fontes

Status: **iniciado**

## Fontes principais

| Fonte | Papel | Situação | Próxima ação |
|---|---|---|---|
| Aplicação Angular deste repositório | Referência fundadora e galeria executável | Base operacional autorizada; inventário inicial realizado | Reconciliar regras e exemplos por objeto |
| Cadastro de Peças v2 | Referência implementada mais madura | Composição do cadastro em seções inventariada no frontend `c58788b` | Completar estados e validação de qualidade |
| Grupos de Peças | Segunda aplicação do padrão | Composição do cadastro em seções inventariada no frontend `c58788b` | Resolver divergências responsivas e de acessibilidade |
| Estoque | Aplicação posterior | Amostra pontual consultada; inventário não iniciado | Delimitar o conjunto representativo de telas e padrões |
| Demandas recentes do Desmonte | Evoluções incrementais | Amostra pontual consultada; inventário não iniciado | Selecionar conjunto representativo de itens e mudanças relevantes |

## Critério para demandas recentes

- Uma demanda isolada é evidência do seu próprio contexto e não define regra transversal do Design System.
- Demandas podem levantar hipóteses de foundation, componente ou padrão para investigação.
- Uma hipótese somente entra na matriz de reconciliação quando houver objeto de Design System delimitado e comparação com as referências relevantes do Desmonte.
- Bugs e regras específicas de uma tela permanecem no fluxo da demanda, salvo quando a recorrência ou uma decisão explícita justificar sua generalização.

## Critério para a base operacional

- Solução coerente nas três fontes constitui evidência forte de um candidato reutilizável.
- Solução presente em apenas uma fonte continua sendo evidência local até nova comparação ou decisão.
- Divergência entre as fontes deve permanecer como conflito, evolução, exceção ou resultado inconclusivo conforme o caso.
- Reutilização durante a consolidação deve citar a fonte consultada e não dispensa validação de estados, responsividade, acessibilidade e conteúdo.

## Fontes fora do escopo

| Fonte | Classificação | Justificativa | Tratamento |
|---|---|---|---|
| E-commerce | Produto separado | Possui layout e comportamento próprios | Não usar como evidência por padrão; exigir decisão explícita para eventual elemento compartilhado |
| ERP legado | Descontinuado como referência | Será migrado para o Desmonte e abandonado | Não inventariar, reconciliar ou promover seus padrões para novas demandas |

## Conteúdo atual do repositório

### Foundations existentes

- paletas primitivas: azul, vermelho, verde, amarelo, laranja e neutros;
- escala de espaçamento de `4px` a `64px`, além de tamanhos auxiliares;
- famílias, pesos, tamanhos e alturas de linha;
- tema claro e escuro;
- mapeamento de tema para PrimeNG.

### Componentes demonstrados

- accordion;
- badge;
- botão;
- card;
- editor;
- campos de texto, textarea, número, dropdown, autocomplete, data, rádio, checkbox e switch;
- gauge e knob;
- scrollspy;
- tabela;
- upload.

### Estrutura executável

- tokens em `frontend/src/styles/tokens/`;
- estilos de componentes em `frontend/src/styles/components/`;
- componentes Angular em `frontend/src/app/shared/components/`;
- galeria em `frontend/src/app/pages/design-system/`;
- agregação global em `frontend/src/styles/styles.scss`.

## Lacunas iniciais observadas

- regras funcionais estão misturadas ao HTML da galeria;
- exemplos não possuem status normativo ou versão;
- parte da tipografia está marcada como provisória;
- há TODOs explícitos em componentes;
- não foi encontrada uma camada documentada de tokens semânticos completa;
- o container geral de `1440px` precisa ser reconciliado com os layouts implementados posteriormente;
- a tecnologia atual da galeria não deve ser confundida com obrigação arquitetural para o Desmonte;
- ainda não há documentação completa de acessibilidade, responsividade, exceções e governança.

Essas lacunas são itens de reconciliação, não decisões de implementação.
