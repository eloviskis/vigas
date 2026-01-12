# VITAS - Backlog Priorizado

**Data**: 6 de janeiro de 2026  
**Status**: Sprint 2 Finalizado → Próximas Issues

---

## 📋 Opções para Continuar

Baseado no status atual, aqui estão as próximas issues recomendadas:

---

## 🎯 **Opção 1: Continuar com Features (Recomendado)**

### #25 - Integração de Pagamentos (PIX/Cartão, Split)
**Status**: Em progresso  
**Prioridade**: Alta (part dos must-have features)  
**Estimativa**: 40-50 horas  
**Descrição**: Implementar pagamentos PIX e cartão de crédito  

**O que fazer**:
- [ ] PIX QR Code generation (backend)
- [ ] Webhook handling para confirmação PIX
- [ ] Cartão de crédito (integração gateway)
- [ ] Split de pagamento (cliente + plataforma + profissional)
- [ ] Testes de pagamento

---

### #27 - Regras Avançadas de Score de Profissionais
**Status**: Não iniciado  
**Prioridade**: Alta  
**Estimativa**: 20-30 horas  
**Descrição**: Melhorar algoritmo de triagem com regras mais sofisticadas  

**O que fazer**:
- [ ] Adicionar peso para histórico de avaliações
- [ ] Considerar sazonalidade (horários, dias)
- [ ] Penalizar profissionais com taxa de rejeição alta
- [ ] Machine Learning (opcional para Fase 2)

---

### #28 - Expansão do Backoffice
**Status**: Não iniciado  
**Prioridade**: Média  
**Estimativa**: 30-40 horas  
**Descrição**: Expandir painel admin com mais funcionalidades  

**O que fazer**:
- [ ] Gestão de garantias (formal + informal)
- [ ] Áreas de atendimento (setup por região)
- [ ] Dashboard de métricas
- [ ] Gestão de usuários (aprovação, bloqueio)

---

### #14 - Pós-Serviço Automatizado (Follow-up)
**Status**: Não iniciado  
**Prioridade**: Média  
**Estimativa**: 15-20 horas  
**Descrição**: Automações D+7, D+30, D+90  

**O que fazer**:
- [ ] Agendador de jobs (Redis Queue ou similar)
- [ ] Email D+7: "Como foi o serviço?"
- [ ] Email D+30: "Precisa de novo serviço?"
- [ ] Email D+90: "Recomende um profissional"
- [ ] SMS opcional

---

## 🔬 **Opção 2: Implementar Testes (Sprint 3)**

Se prefere começar os testes agora ao invés de continuar com features:

### #37 - Backend Unit Tests (Jest)
**Status**: Não iniciado  
**Prioridade**: Alta (antes de produção)  
**Estimativa**: 40-50 horas  
**Target**: 80 testes, 80% cobertura  

**O que fazer**:
- [ ] AuthService tests
- [ ] ChamadoService tests
- [ ] TriagemService tests
- [ ] PaymentService tests (quando #25 terminar)

---

### #40 - Frontend Unit Tests (Vitest)
**Status**: Não iniciado  
**Prioridade**: Alta  
**Estimativa**: 25-35 horas  
**Target**: 40+ testes, 60% cobertura  

---

### #41 - Frontend E2E Tests (Playwright)
**Status**: Não iniciado  
**Prioridade**: Média  
**Estimativa**: 20-25 horas  
**Target**: 12 testes dos fluxos críticos  

---

## 🔄 **Opção 3: Melhorias & Bug Fixes**

### #22 - Melhorias de UX e Performance
**Status**: Não iniciado  
**Prioridade**: Baixa  
**Estimativa**: 20-30 horas  
**Descrição**: Polish UI, otimizar performance  

**O que fazer**:
- [ ] Dark mode
- [ ] Otimizar imagens
- [ ] Lazy loading
- [ ] Cache strategies
- [ ] Performance audit

---

### #29 - Testes Finais e Validação
**Status**: Não iniciado  
**Prioridade**: Crítica (antes do launch)  
**Estimativa**: 40-50 horas  
**Descrição**: UAT com stakeholders + bug fixes  

---

## 📊 Recomendação Estratégica

### **Melhor Caminho**: Feature → Testes → Produção

```
AGORA (Sprint 3)
├─ #25 Pagamentos (40-50h) ← COMEÇAR AQUI
└─ Após finalizar → Testes (#37, #40, #41)

SEMANA 2 (Sprint 3)
├─ #27 Score Rules (20-30h) ou
├─ #28 Backoffice (30-40h) ou
└─ #14 Follow-up (15-20h)
  └─ Após → Testes

SEMANA 3-4 (Sprint 4)
├─ #37 Backend Tests (40-50h)
├─ #40 Frontend Tests (25-35h)
└─ #41 E2E Tests (20-25h)

SEMANA 5 (Sprint 5)
├─ #29 UAT & Validação (40-50h)
└─ Deploy → Produção

GO-LIVE: Mid-February 2026
```

---

## 🎯 **Recomendação #1: Começar com #25 Pagamentos**

### Por quê?
1. ✅ Completa um dos must-have features
2. ✅ Necessário antes de produção
3. ✅ Testes para PaymentService após
4. ✅ Desbloqueia UAT (necessita pagamentos)
5. ✅ Estimativa clara (40-50h = ~1 semana)

### Próximos Passos para #25:
```bash
# 1. Criar issue se não existir
gh issue create --title "Implementar pagamentos PIX e Cartão" \
  --label "must-have,in-progress" --milestone "Sprint 3"

# 2. Criar branch
git checkout -b 008-pagamentos

# 3. Começar implementação
# a. PaymentService com lógica PIX/Cartão
# b. PaymentController com endpoints
# c. DTOs de validação
# d. Integração com gateway
# e. Webhook handling

# 4. Ao finalizar
git add .
git commit -m "feat: implement payment integration (PIX/Cartão) (#25)"
git push origin 008-pagamentos
# Criar PR para review
```

---

## 🎯 **Recomendação #2: Começar com Testes (#37)**

### Por quê?
1. ✅ Não depende de features pendentes
2. ✅ Pode rodar em paralelo com features
3. ✅ Necessário antes de produção
4. ✅ Desbloqueia CI/CD
5. ✅ Validação contínua de código

### Próximos Passos para #37:
```bash
# 1. Criar branch
git checkout -b 008-backend-tests

# 2. Setup Jest
cd backend
npm install --save-dev jest @types/jest ts-jest

# 3. Criar test-setup.ts
# 4. Implementar testes:
#    - AuthService.spec.ts
#    - ChamadoService.spec.ts
#    - TriagemService.spec.ts

# 5. Ao finalizar
npm run test:cov
# Target: 80% coverage
```

---

## 📈 Matriz de Dependências

```
#25 Pagamentos ─→ #29 UAT
                 ↓
#37 Backend Tests ─→ #40 Frontend Tests ─→ #41 E2E Tests
                                              ↓
                                          #29 UAT
                                              ↓
                                          PRODUÇÃO

#27 Score Rules → Pode rodar em paralelo com #25
#28 Backoffice  → Pode rodar em paralelo com #25
#14 Follow-up   → Pode rodar em paralelo com #25
```

---

## 💡 Minhas Recomendações

### **Se quer continuar com Features**:
→ **Começar com #25 (Pagamentos)**
- Completa requisito crítico do MVP
- Necessário para UAT
- Desbloqueador de produção
- 1 semana de trabalho

### **Se quer focar em Qualidade**:
→ **Começar com #37 (Backend Tests)**
- Não depende de outras features
- Melhora confiança no código
- Desbloqueador de deploy
- Pode fazer em paralelo com features

### **Caminho Recomendado** (Meu Top Pick):
1. **Esta semana**: #25 Pagamentos (40-50h)
2. **Próxima semana**: #37-41 Testes em paralelo (100h+)
3. **Semana 3**: #29 UAT + bug fixes
4. **Semana 4**: Deploy!

---

## 🚀 Qual você prefere?

**Opção A**: `#25 Pagamentos` (Features)  
**Opção B**: `#37 Backend Tests` (Testes)  
**Opção C**: `#27 Score Rules` (Melhorias no algoritmo)  
**Opção D**: `#28 Backoffice` (Admin dashboard)  

Responda qual você quer começar e vou preparar a implementação! 🎯
