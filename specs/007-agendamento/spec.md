# Feature Specification: Agendamento & Scheduling com Slots de Disponibilidade

**Feature Branch**: `007-agendamento`  
**Created**: 2026-01-03  
**Status**: In Progress  
**Input**: User description: "Agendamento e scheduling com slots de disponibilidade do profissional, confirmação de agendamentos, rastreamento de atendimento"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Criar Slots de Disponibilidade (Priority: P1)

Profissional cadastra seus slots (dias/horários disponíveis) no sistema. Sistema permite criar slots individuais ou em lote (ex: "terca a sexta, 09:00-17:00, horários de 1h").

**Why this priority**: Fundamental - sem slots, não há como agendar. É o primeiro passo do profissional.

**Independent Test**: Profissional pode criar 1 slot individual, sistema aceita. Pode criar lote (30 slots) em 1 operação. GET /profissionais/:id/slots retorna apenas slots disponíveis.

**Acceptance Scenarios**:

1. **Given** profissional sem slots, **When** POST /profissionais/:id/slots com {dataHora: "2026-01-15 10:00", duracao: 60}, **Then** retorna 201 com slot.id
2. **Given** mesmo profissional, **When** POST /profissionais/:id/slots com mesmo dataHora, **Then** retorna 400 "Slot já existe"
3. **Given** profissional com 3 slots, **When** GET /profissionais/:id/slots?dataInicio=2026-01-15&dataFim=2026-01-20, **Then** retorna apenas slots nesse período, ordenados por data

---

### User Story 2 - Agendar Profissional (Priority: P1)

Após triagem, sistema (ou operador) cria agendamento do profissional. Agendamento seleciona slot disponível, reserva horário, gera confirma via SMS/email.

**Why this priority**: Core de automação - transforma triagem em ação. Usuário consegue marcar serviço agora.

**Independent Test**: Agendamento criado em <1s, slot marcado como ocupado, evento AGENDAMENTO registrado no histórico, status=PENDENTE até confirmação.

**Acceptance Scenarios**:

1. **Given** chamado TRIADO com profissional recomendado e 5 slots disponíveis, **When** POST /chamados/:id/agendamentos com {profissionalId, slotId, dataHora}, **Then** retorna 201, agendamento.status=PENDENTE
2. **Given** agendamento criado, **When** GET /chamados/:id/agendamentos, **Then** retorna agendamento com profissional e slot details
3. **Given** agendamento criado, **When** GET /profissionais/:id/slots, **Then** slot está indisponível (ocupado)

---

### User Story 3 - Confirmar Agendamento (Priority: P1)

Cliente ou sistema confirma agendamento. Confirmar muda status para CONFIRMADO e envia notificação ao profissional. Se cancelado, libera slot.

**Why this priority**: Transição de estado crítica - separa agendamentos pendentes de confirmados. Necessário para rastreamento.

**Independent Test**: Confirmação muda status PENDENTE→CONFIRMADO, registra confirmadoEm, libera slot se cancelado, log na timeline.

**Acceptance Scenarios**:

1. **Given** agendamento PENDENTE, **When** PUT /chamados/:id/agendamentos/:id/confirmar, **Then** status=CONFIRMADO, confirmadoEm=now()
2. **Given** agendamento CONFIRMADO, **When** PUT /chamados/:id/agendamentos/:id/cancelar com {motivo: "Cliente não compareceu"}, **Then** status=CANCELADO, slot volta a ficar disponível
3. **Given** agendamento cancelado, **When** GET /chamados/:id/historico, **Then** evento AGENDAMENTO com "Agendamento cancelado: Cliente não compareceu"

---

### User Story 4 - Rastreamento de Atendimento (Priority: P2)

Profissional marca início/fim do atendimento. Sistema registra duração real, status muda CONFIRMADO→EM_ATENDIMENTO→CONCLUIDO. Timeline mostra progresso.

**Why this priority**: Visibilidade operacional - gerente sabe status de cada chamado em tempo real.

**Independent Test**: Atendimento iniciado, durações calculadas, timeline atualizada, status correto em cada etapa.

**Acceptance Scenarios**:

1. **Given** agendamento CONFIRMADO, **When** PUT /chamados/:id/agendamentos/:id/iniciar, **Then** status=EM_ATENDIMENTO, inicioAtendimento=now()
2. **Given** agendamento EM_ATENDIMENTO, **When** PUT /chamados/:id/agendamentos/:id/concluir, **Then** status=CONCLUIDO, fimAtendimento=now(), timeline atualizada

---

### User Story 5 - Agenda Inteligente (Priority: P2)

Sistema recomenda próximo slot disponível do profissional (padrão para agendamento rápido). Opcionalmente, mostra 3 opções.

**Why this priority**: UX rápida - operador clica 1x confirma agendamento, sem navegar slots.

**Independent Test**: GET /profissionais/:id/slots retorna slots ordenados por data, primeiro é recomendado, frontend exibe 3 opções.

**Acceptance Scenarios**:

1. **Given** profissional com slots em 15/01, 16/01, 17/01, **When** GET /profissionais/:id/slots, **Then** retorna 3 slots, primeiro é 15/01 08:00
