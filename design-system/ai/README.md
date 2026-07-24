# Contexto do design system para IA

Status: **estrutura inicial**

## Objetivo

Fornecer uma camada versionada e verificável para agentes que criam protótipos, apoiam o desenvolvimento ou revisam conformidade.

Este diretório não substitui a fonte da verdade. Seus conteúdos serão derivados das decisões aprovadas em `source-of-truth/`.

## Funções previstas

### Prototipação

- compor telas com elementos aprovados;
- produzir desktop e mobile;
- cobrir estados obrigatórios;
- identificar decisões ausentes;
- registrar exceções propostas.

### Desenvolvimento

- localizar tokens, componentes e padrões existentes;
- respeitar as decisões vigentes;
- não inventar variantes silenciosamente;
- devolver conflitos funcionais ao Produto e decisões técnicas aos desenvolvedores.

### Revisão

- comparar protótipos ou implementações com a versão vigente;
- apontar divergências e antipadrões;
- verificar estados, responsividade, conteúdo e acessibilidade;
- produzir relatório de conformidade.

## Contrato mínimo de resposta

```markdown
## Versão do design system utilizada
## Componentes utilizados
## Padrões aplicados
## Estados cobertos
## Comportamento responsivo
## Acessibilidade
## Exceções
## Decisões pendentes do Produto
## Decisões pendentes do Desenvolvimento
```

## Regras fundamentais

1. Consultar a versão vigente antes de agir.
2. Reutilizar antes de criar.
3. Citar a regra aplicada.
4. Não transformar lacunas em decisões.
5. Identificar conflitos entre documentação, referência visual e implementação.
6. Preservar a decisão final humana.

## Entregáveis futuros

- catálogo estruturado de componentes;
- schemas para especificação e revisão;
- exemplos aprovados e antipadrões;
- checklists para cada função;
- instruções específicas por ferramenta;
- validação automática da versão e das referências citadas.
