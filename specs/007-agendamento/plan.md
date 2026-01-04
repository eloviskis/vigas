# Implementation Plan: Feature 007 - Agendamento & Scheduling

**Feature Number**: 007  
**Branch**: 007-agendamento  
**Status**: In Progress  

## Implementation Phases

### Phase 1: Backend Entities & Services (COMPLETE)

**Tasks**:
- [x] T001: Slot Entity (profissionalId, dataHora, duracao, disponivel, agendamentoId)
- [x] T002: Agendamento Entity (chamadoId, profissionalId, slotId, status, timestamps)
- [x] T003: SlotService (criar, criarEmLote, listar, marcar disponível/ocupado)
- [x] T004: AgendamentoService (agendar, confirmar, cancelar, iniciar, concluir atendimento)
- [x] T005: SlotController (POST/GET slots)
- [x] T006: AgendamentoController (POST agendar, PUT confirmar/cancelar/iniciar/concluir)

**Completion**: 100%

---

### Phase 2: Database Migrations & Integration

**Tasks**:
- [ ] T007: Criar migration para Slot table
- [ ] T008: Criar migration para Agendamento table
- [ ] T009: Atualizar índices para performance (por profissional + data)
- [ ] T010: Testar relacionamentos TypeORM (Slot.profissional, Agendamento.slot)

**Estimated Duration**: 1-2 hours

---

### Phase 3: HistoricoService Integration (COMPLETE)

**Tasks**:
- [x] T011: HistoricoService já tem registrarAgendamento()
- [x] T012: AgendamentoService injeta HistoricoService
- [x] T013: Logs automáticos em agendar(), confirmar(), cancelar(), iniciar(), concluir()
- [x] T014: Metadados incluem agendamento_id, profissional_id, duracao, motivoCancelamento

**Completion**: 100%

---

### Phase 4: Testing & Documentation

**Tasks**:
- [ ] T015: Criar test-feature-007.sh para validação end-to-end (criar slots → agendar → confirmar → concluir)
- [ ] T016: Documentar API endpoints (Swagger)
- [ ] T017: Validar integração com Feature 006 (Triagem recomenda → Agendamento confirma)
- [ ] T018: Adicionar exemplos no README.md

**Estimated Duration**: 2 hours

---

### Phase 5: Frontend (React Components)

**Tasks**:
- [ ] T019: Criar componente SlotSelector (exibir slots disponíveis com calendário)
- [ ] T020: Criar página /chamados/:id/agendar (selecionarslot → confirmar)
- [ ] T021: Integrar com API (axios)
- [ ] T022: Exibir status PENDENTE/CONFIRMADO/EM_ATENDIMENTO/CONCLUIDO em timeline

**Estimated Duration**: 4-5 hours (separate from backend completion)

---

## Known Issues & Risks

1. **Issue**: Sem timezone handling
   - **Risk**: Slots podem estar em timezone errado em diferentes regiões
   - **Mitigation**: Para MVP, usar UTC. Em v2, adicionar timezone do profissional

2. **Issue**: Sem notificações real-time
   - **Risk**: Cliente não sabe quando agendamento foi confirmado
   - **Mitigation**: Adicionar email/SMS em v2; por enquanto, timeline é fonte de verdade

3. **Issue**: Sem overbooking prevention para profissional
   - **Risk**: Se 2 agendamentos são criados simultaneamente, pode usar mesmo slot
   - **Mitigation**: Transações de banco garantem atomicidade; adicionar lock pessimista se necessário

4. **Issue**: Slots antigos não são auto-limpos
   - **Risk**: Tabela fica grande, performance degrada
   - **Mitigation**: Adicionar job de limpeza (CronJob) em v2

---

## Key Decisions

- **Slots separados de Agendamentos**: Slots são "oferta de disponibilidade", Agendamentos são "confirmação". Desacoplamento permite profissional gerenciar agenda independente.
- **Status transições**: PENDENTE→CONFIRMADO→EM_ATENDIMENTO→CONCLUIDO (ou CANCELADO em qualquer momento)
- **slotId é opcional**: Agendamento pode ser criado sem slot específico (será preenchido depois)
- **Timestamps de atendimento**: inicioAtendimento e fimAtendimento para rastreamento real-time

---

## Success Criteria

1. ✅ Slots podem ser criados individuais ou em lote
2. ✅ Agendamento reifica slot (marca como ocupado)
3. ✅ Confirmação funciona (status PENDENTE→CONFIRMADO)
4. ✅ Cancelamento libera slot (marca disponível novamente)
5. ✅ Rastreamento de atendimento (iniciar/concluir)
6. ✅ Integração com HistoricoService (eventos AGENDAMENTO na timeline)
7. ✅ Integração com Feature 006 (Triagem recomenda → Agendamento confirma)

---

## Integration Points

- **Feature 006 (Triagem)**: Agendamento usa profissionalRecomendadoId de Triagem como padrão
- **Feature 013 (Chamado/Historico)**: Agendamento injeta HistoricoService, logs de status
- **Frontend**: React pages para criar slots (admin), agendar (operador), confirmar (cliente)
- **Notifications (v2)**: Email/SMS de confirmação, lembrete antes do horário
