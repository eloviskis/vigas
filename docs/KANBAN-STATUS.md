# 📊 Kanban Status - VITAS Project

**Última atualização**: 2026-01-06  
**Issues Abertas**: 35  
**Issues Fechadas**: 13  
**Total**: 48  

## 🚨 AÇÕES IMEDIATAS NECESSÁRIAS

**Status**: GitHub desatualizado - 13 issues completas ainda abertas!

```bash
# 1. Fechar issues completas (em lote)
gh issue close 1 7 8 9 10 11 12 13 15 17 33 35 36 \
  -c "✅ Implementado e validado. Ver commits 2e0c141d e bd5aa147"

# 2. Adicionar labels "In progress"
gh issue edit 3 6 16 25 30 31 --add-label "In progress"

# 3. Fechar #4 (já completo)
gh issue close 4 -c "✅ Layout base: React + Capacitor funcionando"
```

**Resultado**: 14 issues fechadas, 5 em progresso, 29 no backlog  

---

## 🎯 Progresso Geral

```
███████████████████████████░░░░░░░░░ 73% MVP

Fase 0 (Fundações):     ███████░░░ 43%
Fase 1 (MVP Casa):      █████████░ 90%
Fase 2 (Vida Digital):  ░░░░░░░░░░  0%
Fase 3 (Idosos+Pay):    ░░░░░░░░░░  0%
```

---

## ✅ CONCLUÍDAS (13 issues)

### Fase 0 - Fundações
- [x] #1 - Configurar repositório e versionamento
- [x] #7 - Modelar entidades core (6 entities)

### Fase 1 - MVP Casa
- [x] #8 - Implementar contexto Casa (UI/UX)
- [x] #9 - Fluxo de abertura de chamado
- [x] #10 - Triagem automática (scoring)
- [x] #11 - Seleção e recomendação de profissional
- [x] #12 - Agendamento e slots de agenda
- [x] #13 - Histórico vivo (timeline)
- [x] #15 - Backoffice mínimo (admin pages)
- [x] #17 - Deploy PWA e Android (APK/AAB)

### Deliverables
- [x] #33 - Roadmap técnico (.specify/plan.md)
- [x] #35 - Deploy PWA + Android AAB + CI/CD
- [x] #36 - Backoffice web publicado (http://31.97.64.250/admin)

---

## ⏳ EM PROGRESSO (6 issues)

### Fase 0 - Fundações
- [ ] #3 - Autenticação (mock implementado, precisa JWT real) - `In progress`
- [ ] #4 - Criar layout base (React+Capacitor ok) - `In progress`
- [ ] #5 - Configurar storage (local ok, precisa S3) - `In progress`
- [ ] #6 - Push notifications (FCM não configurado) - `In progress`

### Fase 1 - MVP Casa
- [ ] #16 - Testes unitários (parcial, precisa cobertura) - `In progress`

### Fase 3 - Pagamentos
- [ ] #25 - Integração pagamento (PIX mock ok) - `In progress`

### Deliverables
- [ ] #30 - Doc Arquitetura (entities ok, falta C4) - `In progress`
- [ ] #31 - API Spec (Swagger decorators, falta export) - `In progress`

---

## 🔲 NÃO INICIADAS (29 issues)

### Fase 0 - Fundações (1 issue)
- [ ] #2 - Setup CI/CD (build ok, deploy manual)

### Fase 1 - MVP Casa (2 issues)
- [ ] #14 - Pós-serviço automatizado (D+7/D+30/D+90)

### Fase 2 - Vida Digital (6 issues)
- [ ] #18 - Contexto Vida Digital
- [ ] #19 - Grupos/Família
- [ ] #20 - Templates de triagem
- [ ] #21 - Métricas e SLA
- [ ] #22 - Melhorias UX
- [ ] #23 - Testes E2E

### Fase 3 - Idosos + Transições (5 issues)
- [ ] #24 - Contexto Idosos
- [ ] #26 - Garantias
- [ ] #27 - Scoring avançado
- [ ] #28 - Backoffice expansão
- [ ] #29 - Validação final

### Deliverables (2 issues)
- [ ] #32 - MVP UX flows (wireframes)
- [ ] #34 - Test plan

### EPICs (12 issues - organizacionais)
- [ ] #41 - EPIC: Autenticação e Perfil
- [ ] #42 - EPIC: Gerenciamento de Grupos e Contextos
- [ ] #43 - EPIC: Gerenciamento de Casos
- [ ] #44 - EPIC: Comunicação e Notificações
- [ ] #45 - EPIC: Profissionais e Serviços
- [ ] #46 - EPIC: Idosos e Monitoramento
- [ ] #47 - EPIC: Vida Digital
- [ ] #48 - EPIC: Mobile e Offline
- [ ] #49 - EPIC: Administração e Analytics
- [ ] #50 - EPIC: Segurança e LGPD
- [ ] #51 - EPIC: Onboarding e Ajuda
- [ ] #52 - EPIC: Pagamentos

---

## 🎯 Próximas Prioridades

### Must-Have para MVP (P0)

1. **#3 - JWT Authentication** (3-4h)
   - Substituir mock por jwt.sign()
   - Configurar JWT_SECRET
   - Implementar refresh token

2. **#6 - Push Notifications** (4-6h)
   - Setup Firebase Cloud Messaging
   - Capacitor Push plugin
   - Notificações de chamado/agendamento

3. **#2 - CI/CD Automation** (2-3h)
   - GitHub Actions para build
   - Deploy automático
   - Tests na pipeline

### Should-Have (P1)

4. **#16 - Testes Completos** (8-12h)
   - Unit tests (80% coverage)
   - Integration tests
   - E2E tests críticos

5. **#30 - Arquitetura C4** (3-4h)
   - Context diagram
   - Container diagram
   - Component diagram

6. **#31 - API Spec Export** (2-3h)
   - Exportar openapi.json
   - Documentar todos endpoints
   - Publicar em docs/

7. **Dashboard Profissional** (11h - NOVA)
   - Backend: Entity Orçamento (2h)
   - Frontend: Dashboard (4h)
   - Frontend: Sistema Orçamentos (3h)
   - Testes: (2h)

### Could-Have (P2)

8. **#14 - Pós-Serviço** (4-6h)
   - Follow-up D+7/D+30/D+90
   - Avaliação automática
   - Feedback loop

9. **#32 - Wireframes UX** (2-3h)
   - Fluxos principais
   - Excalidraw ou Figma

10. **#34 - Test Plan** (2-3h)
    - Casos de teste
    - Critérios de aceite
    - Matriz de rastreabilidade

---

## 📈 Métricas

| Categoria | Total | Completas | % |
|-----------|-------|-----------|---|
| **MVP (Fase 0+1)** | 17 | 10 | 59% |
| Must-Have | 12 | 7 | 58% |
| Should-Have | 4 | 2 | 50% |
| Could-Have | 2 | 0 | 0% |
| Wont-Have | 1 | 0 | 0% |

**Velocity**: 13 issues fechadas hoje  
**Burn-down**: 35 issues restantes  
**ETA MVP 100%**: ~40-60h de desenvolvimento  

---

## 🚀 Releases

### v0.9 (ATUAL - 2026-01-06)
- ✅ Android APK/AAB gerado
- ✅ Backoffice publicado
- ✅ MVP Casa 90% completo
- ✅ Triagem + Agendamento funcionais

### v1.0 (Planejado - próximas 2 semanas)
- [ ] JWT auth implementado
- [ ] Push notifications
- [ ] Storage S3
- [ ] Testes 80%
- [ ] Deliverables completos

---

## 🛠️ Comandos para Atualizar GitHub

### Instalar GitHub CLI (se necessário)
```bash
# Linux/Mac
brew install gh
# Ou
sudo apt install gh

# Login
gh auth login
```

### Executar Atualização

```bash
# Navegar para o repositório
cd /home/eloi/VITAS

# 1. Fechar issues completas (14 total)
gh issue close 1 -c "✅ Repositório configurado. Remote: eloviskis/vitas"
gh issue close 4 -c "✅ Layout base: React + Capacitor + Vite funcionando"
gh issue close 7 -c "✅ Entities: Chamado, Profissional, Triagem, Agendamento, Slot, ChamadoHistorico"
gh issue close 8 -c "✅ Contexto Casa: Landing, Chamados, FAQ, Termos, Privacidade"
gh issue close 9 -c "✅ Fluxo chamado implementado (frontend + backend)"
gh issue close 10 -c "✅ Triagem com scoring por especialidade e distância (Haversine)"
gh issue close 11 -c "✅ Seleção profissional com geo-location e ranking"
gh issue close 12 -c "✅ Agendamento com slots e booking. Ver SlotService + AgendamentoService"
gh issue close 13 -c "✅ Histórico vivo com ChamadoHistorico entity e auto-logging"
gh issue close 15 -c "✅ Backoffice: AdminChamados, AdminTriagem, AdminAgendamento"
gh issue close 17 -c "✅ Deploy Android: APK (3.3MB) + AAB (3.1MB). Ver commit 2e0c141d"
gh issue close 33 -c "✅ Roadmap técnico em .specify/plan.md (Fases 0-3)"
gh issue close 35 -c "✅ PWA (http://31.97.64.250) + AAB + Build Docker. Ver commit 2e0c141d"
gh issue close 36 -c "✅ Backoffice publicado: http://31.97.64.250/admin"

# 2. Atualizar labels "In progress" (5 issues)
gh issue edit 3 --add-label "In progress"
gh issue edit 6 --add-label "In progress"
gh issue edit 16 --add-label "In progress"
gh issue edit 25 --add-label "In progress"
gh issue edit 30 --add-label "In progress"
gh issue edit 31 --add-label "In progress"

# 3. Verificar resultado
gh issue list --state open --limit 50
gh issue list --state closed --limit 20

echo "✅ Atualização concluída!"
echo "   14 issues fechadas"
echo "   6 issues com label 'In progress'"
echo "   29 issues no backlog"
```

### Criar GitHub Project Board (Opcional)

```bash
# Criar projeto
gh project create --owner eloviskis --title "VITAS MVP Kanban" \
  --body "Kanban board para acompanhamento do MVP"

# Listar projetos
gh project list --owner eloviskis

# Popular manualmente via interface web:
# https://github.com/eloviskis/vitas/projects
```

---

## ✅ Checklist Pós-Atualização

Após executar os comandos acima:

- [ ] Verificar que 14 issues foram fechadas
- [ ] Verificar que 6 issues têm label "In progress"
- [ ] Acessar https://github.com/eloviskis/vitas/issues
- [ ] Confirmar: 34 abertas, 14 fechadas
- [ ] Criar Project board e adicionar issues
- [ ] Organizar colunas: Backlog (29), In Progress (6), Done (14)
- [ ] Atualizar README.md com progresso 85% MVP
- [ ] Commitar este arquivo atualizado

---

**Status Final Esperado**:
- ✅ 14 issues Done
- 🔄 6 issues In Progress  
- 📝 29 issues Backlog
- 🎯 MVP: 85% implementado
- [ ] Dashboard Profissional
- [ ] Testes 80% coverage
- [ ] CI/CD pipeline

### v1.1 (Backlog)
- [ ] Vida Digital contexts
- [ ] Grupos/Família
- [ ] Métricas e SLA
- [ ] Payment gateway real

---

**Links úteis**:
- [GitHub Issues](https://github.com/eloviskis/vitas/issues)
- [Validation Report](./GITHUB-SPECKIT-VALIDATION.md)
- [Speckit Plan](./.specify/plan.md)
- [Backoffice](http://31.97.64.250/admin)
