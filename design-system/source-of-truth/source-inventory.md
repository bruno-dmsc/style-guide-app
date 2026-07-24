# Inventário das fontes

Status: **iniciado**

## Fontes principais

| Fonte | Papel | Situação | Próxima ação |
|---|---|---|---|
| Aplicação Angular deste repositório | Protótipo fundador e galeria executável | Inventário inicial realizado | Reconciliar regras e exemplos |
| Cadastro de Peças v2 | Referência implementada mais madura | Diagnóstico inicial realizado | Comparar foundations, componentes e padrões |
| Grupos de Peças | Segunda aplicação do padrão | Diagnóstico inicial realizado | Identificar adoções, desvios e lacunas |
| Estoque | Aplicação posterior | Não inventariado nesta iniciativa | Delimitar telas e levantar padrões |
| Demandas recentes | Evoluções incrementais | Não inventariadas | Identificar itens e mudanças relevantes |

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
