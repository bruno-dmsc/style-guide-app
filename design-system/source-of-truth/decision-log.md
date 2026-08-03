# Registro de decisões

## DS-001 — Avançar do guia fundador para o escopo completo

- Status: **Aprovado**
- Data: 2026-07-24
- Decisão: tratar este repositório como protótipo fundador e não produzir um novo MVP intermediário.
- Consequência: seu conteúdo será reconciliado com as implementações posteriores antes de se tornar normativo.

## DS-002 — Hospedar aqui a fonte da verdade funcional

- Status: **Aprovado**
- Data: 2026-07-24
- Decisão: este repositório passa a hospedar princípios, foundations, componentes, padrões, conteúdo, acessibilidade, exceções e decisões.
- Consequência: saídas visuais, técnicas e para IA deverão indicar a versão utilizada.

## DS-003 — Separar decisão funcional de decisão técnica

- Status: **Aprovado**
- Data: 2026-07-24
- Decisão: Produto define comportamento, prioridade e aceite; desenvolvimento define arquitetura e tecnologia.
- Consequência: esta documentação poderá exigir capacidades, mas não imporá ferramenta ou formato técnico sem decisão dos desenvolvedores.

## DS-004 — Orientar IAs por conhecimento versionado

- Status: **Aprovado conceitualmente**
- Data: 2026-07-24
- Decisão: o design system produzirá contexto para agentes de prototipação, desenvolvimento e revisão.
- Consequência: IAs deverão aplicar regras vigentes, declarar a versão utilizada e devolver lacunas para decisão humana.
- Pendente: plataforma, distribuição e validações técnicas.

## DS-005 — Restringir o Design System ao produto Desmonte

- Status: **Aprovado**
- Data: 2026-07-24
- Responsável: Produto
- Contexto: o e-commerce é um projeto separado, com layout e comportamento próprios, enquanto o ERP legado será migrado para o Desmonte e abandonado.
- Alternativas consideradas: reconciliar todos os produtos do projeto IBR; usar e-commerce e ERP como referências auxiliares; restringir a fonte normativa ao Desmonte.
- Decisão: este Design System será normativo somente para o Desmonte e para telas que serão incorporadas ao Desmonte. O e-commerce não será usado como referência por padrão, e o ERP legado será excluído da reconciliação.
- Justificativa: evitar que padrões de produtos com contexto, ciclo de vida e linguagem distintos contaminem decisões futuras do Desmonte.
- Consequências: inventários, matrizes, pilotos e demandas devem ser filtrados pelo produto Desmonte; referências externas exigem decisão explícita e escopo delimitado.
- Exceções: nenhuma vigente.
- Revisar em: quando houver decisão organizacional de compartilhar marca, foundations ou componentes entre produtos, ou se a estratégia de migração do ERP mudar.
- Referências: orientação do Produto em 2026-07-24; decisão aprovada de hospedar neste repositório a fonte da verdade funcional.

## DS-006 — Adotar três referências como base operacional inicial

- Status: **Aprovado**
- Data: 2026-07-24
- Responsável: Produto
- Contexto: o repositório contém a referência fundadora, enquanto Cadastro de Peças v2 e Cadastro de Grupos de Peças materializam a evolução do padrão em duas aplicações do Desmonte.
- Alternativas consideradas: usar somente o repositório fundador; tratar todas as telas existentes de forma equivalente; adotar as três referências selecionadas como base inicial.
- Decisão: o conteúdo fundador deste repositório, o Cadastro de Peças v2 e o Cadastro de Grupos de Peças serão as referências operacionais iniciais para consolidar foundations, componentes e padrões reutilizáveis.
- Justificativa: combinar intenção documentada, implementação madura e repetição em uma segunda tela reduz improvisação e fornece evidência comparável para iniciar a consolidação.
- Consequências: padrões coerentes entre as três fontes podem ser reutilizados durante a reconciliação; cada objeto ainda deve registrar estados, responsividade, acessibilidade, conteúdo, divergências e status normativo antes da publicação definitiva.
- Exceções: detalhes exclusivos de uma tela, decisões de negócio locais e divergências não reconciliadas não se tornam regra compartilhada.
- Revisar em: após o primeiro ciclo de consolidação de componentes e padrões ou quando uma referência sucessora for aprovada.
- Referências: orientação do Produto em 2026-07-24; inventário inicial das fontes.

## Modelo

```markdown
## DS-XXX — Título

- Status:
- Data:
- Responsável:
- Contexto:
- Alternativas consideradas:
- Decisão:
- Justificativa:
- Consequências:
- Exceções:
- Revisar em:
- Referências:
```
