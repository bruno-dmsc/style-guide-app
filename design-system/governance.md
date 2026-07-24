# Governança

Status: **Proposto**

## Mandato

O Design System do Desmonte será um produto interno contínuo. Seu propósito é reduzir decisões repetidas, divergências entre telas e retrabalho, sem transferir para Produto decisões de arquitetura que pertencem ao desenvolvimento.

## Direitos de decisão

| Tema | Propõe | Valida | Decide |
|---|---|---|---|
| Problema e prioridade | Produto | Áreas usuárias | Produto |
| Regra de experiência | Produto/Design | Usuários e QA | Produto |
| Direção visual | Design | Produto e, quando necessário, Diretoria | Produto/Diretoria |
| Acessibilidade | Design/QA/Dev | QA | Decisão conjunta |
| Arquitetura e tecnologia | Desenvolvimento | Desenvolvimento | Desenvolvimento |
| Exceção funcional | Solicitante | Design/Dev/QA | Produto |
| Exceção técnica | Desenvolvimento | Produto quanto ao impacto | Desenvolvimento |
| Publicação de versão | Mantenedores | Produto/Design/Dev/QA | Responsável a definir |

## Fluxo de mudança

1. Registrar o problema ou necessidade.
2. Verificar se já existe fundamento, componente ou padrão aplicável.
3. Comparar referências implementadas e documentação vigente.
4. Elaborar proposta e alternativas quando houver incerteza.
5. Validar experiência, acessibilidade e impacto técnico.
6. Aprovar, rejeitar ou registrar como exceção.
7. Atualizar a fonte da verdade antes ou junto da implementação.
8. Atualizar biblioteca visual, contrato técnico e contexto para IA.
9. Comunicar a mudança e registrar a versão.

## Criação de variantes

Uma variante somente deve ser criada quando existir diferença recorrente de estado, comportamento ou necessidade de negócio. Preferência estética isolada ou particularidade de uma única tela não constitui automaticamente uma variante.

## Exceções

Toda exceção deve registrar:

- contexto e tela;
- regra que não será seguida;
- justificativa funcional ou técnica;
- responsável pela decisão;
- riscos conhecidos;
- prazo ou condição para reavaliação.

## Cadência inicial sugerida

- revisão de propostas: conforme demanda;
- revisão de consistência: mensal durante a consolidação;
- publicação: quando houver conjunto coerente de decisões;
- revisão ampla: trimestral no primeiro ano;
- correções críticas de acessibilidade ou usabilidade: fluxo prioritário.

As pessoas e os fóruns responsáveis ainda precisam ser nomeados.
