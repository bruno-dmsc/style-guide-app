# Cadastro estruturado em seções

Status: **Proposto**
Versão de vigência: não aplicável antes da aprovação
Responsável: Produto/Design/QA
Última revisão: 2026-07-24

## Objetivo

Organizar cadastros extensos do Desmonte em seções compreensíveis, navegáveis e rastreáveis, mantendo a ação principal e o progresso contextual acessíveis sem transformar particularidades de uma tela em regra compartilhada.

## Quando usar

- Cadastro ou edição com pelo menos duas seções funcionais distintas.
- Jornada cujo preenchimento se beneficia de agrupamento, navegação contextual e ações persistentes ou facilmente alcançáveis.
- Tela em que todos os campos precisam permanecer no mesmo contexto, sem justificar etapas transacionais independentes.

## Quando não usar

- Formulário curto que pode ser compreendido como um único bloco.
- Fluxo em que cada etapa possui confirmação, dependência ou efeito transacional próprio.
- Consulta, listagem ou dashboard sem edição longa.
- Modal curto de confirmação ou edição pontual.

## Anatomia ou composição

### Estrutura confirmada como candidato reutilizável

1. Título da página identifica a ação e a entidade, como `Cadastrar Grupo de peças` ou `Editar Grupo de peças`.
2. No desktop, o conteúdo principal e a lateral contextual formam uma composição centralizada.
3. O conteúdo principal possui largura máxima observada de `784px`.
4. A lateral contextual possui largura observada de `246px`.
5. Conteúdo e lateral possuem espaçamento observado de `24px`.
6. Cada seção é apresentada em cartão próprio, com título, descrição curta e conteúdo relacionado.
7. A lateral apresenta uma entrada para cada seção e evidencia a seção ativa.
8. As ações do cadastro ficam agrupadas junto da navegação contextual no desktop.
9. Os campos utilizam rótulo externo acima do controle.

As dimensões acima representam a base operacional atual. A aprovação definitiva como regra de foundation depende da reconciliação de largura, densidade e responsividade.

### Seções

- Cada seção deve possuir identificador estável.
- O título deve nomear o assunto da seção.
- A descrição deve explicar seu propósito sem repetir o título.
- A entrada da navegação deve corresponder ao título ou a uma forma curta inequívoca.
- A seção ativa deve acompanhar a rolagem e também responder à seleção na navegação.
- Conteúdos secundários podem usar expansão progressiva dentro da seção quando não justificarem uma nova seção principal.

### Campos

- O rótulo fica acima do controle.
- Obrigatoriedade, ajuda e erro devem ser comunicados próximos ao campo.
- Rótulo e controle devem possuir associação programática.
- O erro deve identificar o campo e explicar a correção esperada.
- A posição externa do rótulo é recorrente; a associação acessível ainda apresenta divergência entre as implementações.

### Ações

- Deve existir uma ação primária evidente por contexto.
- Modalidades adicionais de gravação somente podem existir quando representarem resultados funcionais diferentes e confirmados.
- Cancelar ou voltar não deve competir visualmente com a ação primária.
- Ações de migração ou retorno a fluxo antigo são transitórias e não pertencem ao padrão permanente.

## Variações permitidas

- Quantidade e nomes das seções conforme o domínio.
- Conteúdo simples, grade de campos, árvore, tabela ou composição expansível dentro de uma seção.
- Uma única ação de salvar ou múltiplas modalidades confirmadas pela regra de negócio.
- Inclusão de ação secundária contextual, desde que não concorra com a ação primária.

Não são variações automaticamente permitidas:

- alterar largura, espaçamento ou hierarquia por preferência local;
- remover navegação contextual de um cadastro longo sem justificar a continuidade da jornada;
- criar múltiplas ações primárias equivalentes;
- usar rótulo sem associação programática como nova referência.

## Estados obrigatórios

- padrão;
- seção ativa;
- carregamento inicial;
- gravação em andamento;
- campo obrigatório não preenchido;
- campo inválido;
- ação desabilitada;
- ausência de permissão, quando aplicável;
- sucesso;
- erro de carregamento ou gravação;
- conteúdo interno vazio, quando a seção admitir coleções.

As fontes implementadas comprovam parte desses estados, mas ainda não existe cobertura comparável de todos eles nas duas jornadas.

## Comportamento responsivo

### Evidência coerente

- Acima de `1024px`, as duas implementações utilizam conteúdo principal e lateral contextual.
- Em larguras menores, o conteúdo principal deixa de ficar limitado a `784px` e passa a ocupar a largura disponível.
- Grades de campos e estruturas densas devem reduzir colunas para evitar rolagem horizontal da página.

### Conflito pendente

- Cadastro de Peças v2 coloca conteúdo e lateral em coluna abaixo de `1024px`; no mobile, oculta a navegação lateral e oferece as ações em menu flutuante.
- Grupos de Peças move navegação e ações antes do conteúdo abaixo de `1024px`; a navegação permanece visível e quebra em múltiplas linhas.
- A posição da navegação, a persistência das ações e o mecanismo mobile ainda dependem de decisão de Produto/Design/QA.

Enquanto o conflito permanecer, novas demandas devem reutilizar a composição desktop e declarar explicitamente a proposta mobile para validação.

## Acessibilidade

- Usar regiões semânticas para conteúdo principal, navegação contextual e seções.
- Associar a navegação contextual a um nome acessível.
- Associar cada seção ao seu título.
- Permitir navegação e acionamento por teclado.
- Manter foco visível.
- Associar rótulos, ajuda, obrigatoriedade e erros aos respectivos controles.
- Após tentativa de gravação inválida, comunicar o primeiro erro e permitir localizar o campo correspondente.
- Não comunicar seção ativa, sucesso, erro ou obrigatoriedade somente por cor.

Cadastro de Peças v2 apresenta evidência mais madura em títulos de seção, rótulos e nomes acessíveis. Grupos de Peças ainda possui rótulos visuais sem associação programática explícita em parte dos campos.

## Conteúdo e terminologia

- Título da página: verbo no infinitivo ou ação consolidada seguida da entidade.
- Título da seção: substantivo ou expressão curta.
- Descrição da seção: uma frase curta sobre finalidade.
- Ação primária: verbo específico, como `Salvar`.
- Modalidade adicional: explicitar o efeito, como `Salvar e publicar`.
- Erro: explicar o problema junto do campo ou da ação, evitando mensagem genérica isolada.

## Exemplos aprovados

Ainda não existem exemplos aprovados integralmente. Cadastro de Peças v2 e Grupos de Peças são referências operacionais autorizadas para comparação e reutilização dos elementos coerentes.

## Antipadrões

- Um único cartão extenso contendo assuntos independentes.
- Navegação com item que não corresponde a uma seção real.
- Destaque de seção ativa sem atualização durante a rolagem.
- Ações principais espalhadas em locais diferentes da mesma tela.
- Rótulos usados apenas como texto visual, sem associação ao controle.
- Erros apresentados somente em notificação global quando existe campo correspondente.
- Solução desktop reduzida sem redefinir ordem, navegação e alcance das ações no mobile.

## Exceções conhecidas

- A ação `Usar cadastro antigo` do Cadastro de Peças v2 é transitória e não integra o padrão futuro.
- Modalidades de publicação do Cadastro de Peças v2 são específicas do domínio e não criam variantes gerais de gravação.
- A árvore de categorias de Grupos de Peças é conteúdo específico da seção, não anatomia obrigatória do padrão.

## Evidências e referências

### Style guide fundador

- Repositório `bruno-dmsc/style-guide-app`, commit-base `9cd30fb8decd87b3342d2fda09df5ed0a6e24ad5`.
- `frontend/src/app/pages/design-system/design-system.html:60` — cartão como contêiner de conteúdo e ações.
- `frontend/src/app/pages/design-system/design-system.html:76` — scrollspy contextual fixo para formulários com múltiplos cartões.
- `frontend/src/app/pages/design-system/design-system.html:95` — rótulo externo, ajuda e erro de campos.
- `frontend/src/app/pages/design-system/design-system.html:307` — hierarquia de ações primária, secundária e terciária.

### Cadastro de Peças v2

- Frontend do Desmonte `main`, commit `c58788b819720689e5e55841b6e008e5416cbeba`.
- `apps/desmonte/src/app/erp/waste/piece-registration-v2/piece-registration-v2.component.html:1` — página, formulário com quatro seções e lateral contextual.
- `apps/desmonte/src/app/erp/waste/piece-registration-v2/piece-registration-v2.component.scss:16` — composição, larguras e quebra responsiva.
- `apps/desmonte/src/app/erp/waste/piece-registration-v2/piece-registration-v2-sidebar/piece-registration-v2-sidebar.component.html:1` — navegação, ações e alternativa mobile.
- `apps/desmonte/src/app/erp/waste/piece-registration-v2/piece-registration-v2-basic-data/piece-registration-v2-basic-data.component.html:1` — seção semântica, título associado e rótulos de campos.

### Grupos de Peças

- Frontend do Desmonte `main`, commit `c58788b819720689e5e55841b6e008e5416cbeba`.
- `apps/desmonte/src/app/erp/logistics/pecas-categorias/piece-category.component.html:87` — cadastro com duas seções, navegação e ações.
- `apps/desmonte/src/app/erp/logistics/pecas-categorias/piece-category.component.css:93` — composição `784px + 246px`, cartões e lateral fixa.
- `apps/desmonte/src/app/erp/logistics/pecas-categorias/piece-category.component.css:848` — reorganização abaixo de `1024px`.
- `apps/desmonte/src/app/erp/logistics/pecas-categorias/piece-category.component.ts:207` — navegação por seção e atualização da seção ativa.

## Decisões relacionadas

- Fonte da verdade restrita ao produto Desmonte.
- Style guide fundador, Cadastro de Peças v2 e Grupos de Peças adotados como base operacional inicial.
- Decisões funcionais separadas das escolhas de arquitetura e implementação.

## Pendências para aprovação

1. Definir a hierarquia tipográfica definitiva do título da página.
2. Definir o posicionamento da navegação contextual entre `768px` e `1024px`.
3. Definir navegação entre seções e persistência das ações no mobile.
4. Confirmar a matriz mínima de estados sistêmicos do padrão.
5. Validar associação de rótulos, erros, foco e navegação por teclado com Design/QA/Desenvolvimento.
