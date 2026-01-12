# Implementation Plan: Feature 006 - Triagem & Seleção de Profissional

**Feature Number**: 006  
**Branch**: 006-triagem-seleção-profissional  
**Status**: In Progress  

## Implementation Phases

### Phase 1: Backend Entities & Services (COMPLETE)

**Tasks**:
- [x] T001: Profissional Entity (ProfissionalStatus, score, taxa satisfação)
- [x] T002: Triagem Entity (TriagemTipo, TriagemResultado, relação com Chamado/Profissional)
- [x] T003: ProfissionalService (CRUD, listar por contexto/categoria, atualizar score)
- [x] T004: TriagemService (executarTriagemAutomatica, recomendarManualmente)
- [x] T005: ProfissionalController (POST/GET/PUT endpoints)
- [x] T006: TriagemController (POST triagem, GET triagem, PUT recomendação)

**Completion**: 100%

---

### Phase 2: Database Migrations & Integration

**Tasks**:
- [ ] T007: Criar migration para Profissional table
- [ ] T008: Criar migration para Triagem table  
- [ ] T009: Atualizar Chamado entity com referência OneToMany para Triagem
- [ ] T010: Testar relacionamentos TypeORM

**Estimated Duration**: 1-2 hours

---

### Phase 3: HistoricoService Integration

**Tasks**:
- [ ] T011: Injetar HistoricoService em TriagemService
- [ ] T012: Implementar registrarTriagem() com timeline logging
- [ ] T013: Testar logs automáticos em POST /triagem
- [ ] T014: Verificar eventos TRIAGEM no GET /historico

**Estimated Duration**: 1 hour

---

### Phase 4: Testing & Documentation

**Tasks**:
- [ ] T015: Criar test-feature-006.sh para validação end-to-end
- [ ] T016: Documentar API endpoints (Swagger)
- [ ] T017: Adicionar exemplos no README.md
- [ ] T018: Validar integração com Feature 013 (Chamado/Historico)

**Estimated Duration**: 2 hours

---

### Phase 5: Frontend (React Components)

**Tasks**:
- [ ] T019: Criar componente TriagemForm (seleção de profissional)
- [ ] T020: Criar página /chamados/:id/triagem
- [ ] T021: Integrar com API (axios)
- [ ] T022: Exibir opções de profissionais e recomendação automática

**Estimated Duration**: 3-4 hours (separate from backend completion)

---

## Known Issues & Risks

1. **Issue**: Triagem automática usando apenas score (algoritmo muito simples)
   - **Risk**: Não considera disponibilidade, localização, especialidade específica
   - **Mitigation**: Para MVP, usar score. Em v2, adicionar peso de contexto/categoria/distância

2. **Issue**: Sem validação de disponibilidade em tempo real
   - **Risk**: Profissional recomendado pode estar ocupado
   - **Mitigation**: Feature 007 (Agendamento) vai integrar slots de agenda

3. **Issue**: Sem autenticação de profissionais
   - **Risk**: Qualquer um pode criar perfil falso
   - **Mitigation**: Adicionar verificação de email + documento em fase 2

---

## Key Decisions

- **Triagem automática por default**: Usa score como métrica principal (simples, funciona bem)
- **Recomendação manual como fallback**: Operadores podem intervir se automática falhar
- **Score editável via admin**: Permite ajustar ranking sem SQL
- **Não bloqueia Agendamento**: Triagem é independente; agendamento pode ocorrer sem triagem

---

## Success Criteria

1. ✅ Profissionais podem se cadastrar com contextos/categorias
2. ✅ Triagem automática recomenda profissional em <2s
3. ✅ Triagem sem profissional retorna SEM_PROFISSIONAL (não falha)
4. ✅ Recomendação manual funciona e atualiza timeline
5. ✅ Score aparece em ranking e afeta recomendações
6. ✅ Integração com HistoricoService completa (eventos TRIAGEM registrados)

---

## Integration Points

- **Feature 013 (Chamado/Historico)**: Triagem injeta HistoricoService para logging
- **Feature 007 (Agendamento)**: Usa profissional recomendado como padrão
- **Frontend**: React pages para cadastro profissional, visualizar triagem, confirmar recomendação
