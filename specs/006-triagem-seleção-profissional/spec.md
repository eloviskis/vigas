# Feature Specification: Triagem & Seleção de Profissional com Recomendação Automática

**Feature Branch**: `006-triagem-seleção-profissional`  
**Created**: 2026-01-03  
**Status**: In Progress  
**Input**: User description: "Triagem e seleção automática de profissionais com recomendação baseada em contexto, especialidade e disponibilidade"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastro de Profissional (Priority: P1)

Sistema permite que fornecedores (profissionais, artesãos, prestadores) se cadastrem com seus dados profissionais, contextos de atuação (Casa, Saúde, Empresa) e categorias de serviço.

**Why this priority**: Fundamental - sem profissionais, não há quem atenda os chamados. É o pilar de supply.

**Independent Test**: Sistema aceita novo profissional com email único, contextos e categorias válidos, e lista em endpoint público.

**Acceptance Scenarios**:

1. **Given** sistema sem profissional com email "joao@example.com", **When** POST /profissionais com {nome, email, contextos: ["Casa"], categorias: ["Encanamento"]}, **Then** retorna 201 com profissional.id
2. **Given** profissional "joao@example.com" existente, **When** POST /profissionais com mesmo email, **Then** retorna 400 "Email já registrado"
3. **Given** profissional cadastrado, **When** GET /profissionais?contexto=Casa, **Then** profissional aparece na lista ordenado por score

---

### User Story 2 - Triagem Automática (Priority: P1)

Sistema executa triagem automática quando um chamado é criado/reatribuído, analisando contexto e recomendando profissional mais qualificado (maior score, disponível, na área).

**Why this priority**: Core de automação - diferencia VITAS de plataformas manuais. Entrega valor imediato.

**Independent Test**: Triagem executa automaticamente em < 2s, recomenda profissional com score mais alto, ou retorna "SEM_PROFISSIONAL" se nenhum disponível.

**Acceptance Scenarios**:

1. **Given** chamado ABERTO com contexto "Casa" e 3 profissionais cadastrados com scores [4.5, 3.2, 3.0], **When** POST /chamados/:id/triagem com tipo=AUTOMATICA, **Then** recomenda profissional com score 4.5
2. **Given** nenhum profissional para contexto "Casa", **When** POST /chamados/:id/triagem, **Then** resultado=SEM_PROFISSIONAL, justificativa="Nenhum profissional disponível"
3. **Given** triagem realizada, **When** GET /chamados/:id/historico, **Then** evento TRIAGEM registrado com timestamp e resultado

---

### User Story 3 - Recomendação Manual (Priority: P2)

Se triagem automática não encontrar profissional ideal (múltiplas opções ou baixa confiança), operador pode intervir e recomendar manualmente um profissional com justificativa.

**Why this priority**: Fallback crítico - garante que 100% dos chamados encontram profissional. Operadores precisam dessa flexibilidade.

**Independent Test**: Operador pode visualizar opções e selecionar manualmente profissional diferente, justificativa é registrada, histórico atualizado.

**Acceptance Scenarios**:

1. **Given** triagem com resultado MULTIPLAS_OPCOES e 3 opções, **When** PUT /triagem/:id/recomendacao com profissionalId e justificativa, **Then** profissional recomendado muda, confiança=100, tipo=MANUAL
2. **Given** recomendação manual realizada, **When** GET /chamados/:id/historico, **Then** evento TRIAGEM com flag tipo=MANUAL

---

### User Story 4 - Score e Rating de Profissional (Priority: P2)

Sistema mantém score (1-5) e taxa de satisfação de cada profissional baseado em conclusão e avaliação de serviços. Score influencia recomendações futuras.

**Why this priority**: Gamification + qualidade - incentiva profissionais bons a se manterem ativos, feedback loop melhora recomendações.

**Independent Test**: Score é calculado corretamente (média de avaliações), aparece em ranking, afeta ordem de recomendação.

**Acceptance Scenarios**:

1. **Given** profissional com 10 serviços concluídos e 8 avaliados como satisfatório (média 4.2), **When** GET /profissionais/:id/taxa-satisfacao, **Then** retorna taxa=80%
2. **Given** dois profissionais para contexto, um com score 4.5 e outro 3.8, **When** triagem automática, **Then** recomenda score 4.5 primeiro

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]  
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]
