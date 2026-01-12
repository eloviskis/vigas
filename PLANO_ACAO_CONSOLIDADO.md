# 🎯 Plano de Ação Consolidado - VITAS MVP

**Data**: 11/01/2026  
**Ambiente**: https://vitas.app.br  
**Branch**: 007-agendamento

---

## 📊 Status Atual da Produção

### ✅ O Que Está Funcionando AGORA (31 itens)

#### Infraestrutura
- [x] Deploy HTTPS em produção (vitas.app.br)
- [x] Backend NestJS rodando
- [x] Frontend React + Vite servido
- [x] Banco PostgreSQL operacional
- [x] PWA 100% funcional (instalável, service worker, manifest)
- [x] SSL/TLS configurado

#### Autenticação
- [x] Login com email/senha
- [x] JWT assinado com expiração (7 dias)
- [x] JwtStrategy e Guards funcionando
- [x] Password hashing (bcrypt)
- [x] Roles (cliente, operador, admin)
- [x] Admin bypass para modo manutenção

#### Chamados (Core)
- [x] Criar chamado (título, descrição, contexto)
- [x] Listar chamados do usuário
- [x] Ver detalhes de chamado
- [x] Timeline/Histórico visual
- [x] Estados (ABERTO, TRIADO, AGENDADO, CONCLUÍDO)

#### Triagem Automática
- [x] Motor de regras funcionando
- [x] Matching de profissionais
- [x] Score de profissionais
- [x] Recomendação automática

#### Agendamento
- [x] Criar agendamento
- [x] Slots de horário
- [x] Confirmação de agendamento
- [x] Estados (PENDENTE, CONFIRMADO, CONCLUÍDO)

#### Profissionais
- [x] CRUD completo
- [x] Áreas de atuação
- [x] Cadastro de profissional
- [x] Listagem admin

#### Admin/Backoffice
- [x] Dashboard admin
- [x] Gestão de chamados
- [x] Triagem manual
- [x] Agendamento manual
- [x] **Modo manutenção** (NOVO! ✨)
- [x] Garantias (página base)
- [x] Áreas (página base)
- [x] Usuários (página base)

#### UX/UI
- [x] Landing page atraente
- [x] Toast notifications
- [x] Loading states
- [x] Páginas legais (Termos, Política, FAQ, **Quem Somos**)
- [x] Responsividade básica
- [x] Mobile usável

---

## ❌ O Que FALTA na Produção (35 itens críticos)

### 🔴 PRIORIDADE 1 - BLOQUEADORES (Impede MVP completo)

#### 1. Upload de Fotos/Anexos
**Issues GitHub**: #9, #13 (fechadas incorretamente)  
**Impacto**: 🔴 **CRÍTICO** - Funcionalidade esperada pelos usuários  
**Tempo**: 6h  
**Complexidade**: Média

**O que fazer**:
```typescript
// Backend
1. Criar entity ChamadoFoto
2. Endpoint POST /api/chamados/:id/fotos
3. Integrar StorageService existente
4. Validação (max 5MB, jpg/png)

// Frontend
1. Input type="file" em CriarChamado
2. Preview de imagens
3. Upload via FormData
4. Galeria em ChamadoDetail
```

**Arquivos**:
- `backend/src/chamado/entities/chamado-foto.entity.ts` (criar)
- `backend/src/chamado/chamado.controller.ts` (adicionar endpoint)
- `frontend/src/pages/chamado/CriarChamado.tsx` (adicionar input)
- `frontend/src/pages/chamado/ChamadoDetail.tsx` (galeria)

**Sugestão**: Começar por aqui! É rápido e desbloqueia muita percepção de valor.

---

#### 2. Rate Limiting
**Issues GitHub**: Nenhuma (gap identificado)  
**Impacto**: 🔴 **CRÍTICO** - Segurança  
**Tempo**: 2h  
**Complexidade**: Baixa

**O que fazer**:
```bash
cd backend && npm install @nestjs/throttler
```

```typescript
// app.module.ts
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 10,
})

// auth.controller.ts
@Throttle({default: {limit: 5, ttl: 60000}})
@Post('login')
```

**Arquivos**:
- `backend/src/app.module.ts`
- `backend/src/auth/auth.controller.ts`

**Sugestão**: Implementar HOJE. 2 horas protege toda a API.

---

#### 3. Logs Estruturados
**Issues GitHub**: Nenhuma  
**Impacto**: 🔴 **ALTO** - Observabilidade  
**Tempo**: 4h  
**Complexidade**: Média

**O que fazer**:
```bash
cd backend && npm install pino-http pino-pretty
```

```typescript
// logger.module.ts (criar)
import pino from 'pino-http'

// main.ts
app.use(pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
}))
```

**Benefícios**:
- Logs em JSON estruturado
- Request ID único
- Stack traces completos
- Troubleshooting facilitado

**Sugestão**: Essencial para produção. Implementar na Sprint 1.

---

#### 4. Variáveis de Ambiente
**Issues GitHub**: Parte de #3, #5  
**Impacto**: 🟡 **MÉDIO** - Boas práticas  
**Tempo**: 30min  
**Complexidade**: Baixa

**O que fazer**:
```bash
# Backend
cp backend/.env backend/.env.example
# Remover valores sensíveis

# Frontend
echo "VITE_API_URL=http://localhost:3000/api" > frontend/.env.local
echo "VITE_API_URL=https://vitas.app.br/api" > frontend/.env.production
```

**Arquivos**:
- `backend/.env.example` (criar)
- `frontend/.env.local` (criar)
- `frontend/.env.production` (criar)

**Sugestão**: Rápido, documentar ambiente para próximos devs.

---

### 🟠 PRIORIDADE 2 - CORE FUNCIONALIDADE

#### 5. OAuth (Google/Facebook)
**Issues GitHub**: #3 (in progress mas incompleto)  
**Impacto**: 🟡 **MÉDIO** - UX  
**Tempo**: 4h  
**Complexidade**: Média

**O que fazer**:
```bash
npm install @nestjs/passport passport-google-oauth20
```

```typescript
// google.strategy.ts (criar)
// google-auth.guard.ts (criar)
// Configurar credenciais Google Cloud
```

**Sugestão**: Pode esperar Sprint 2. Email/senha funciona.

---

#### 6. Storage S3/GCS
**Issues GitHub**: #5 (in progress mas incompleto)  
**Impacto**: 🟡 **MÉDIO** - Escalabilidade  
**Tempo**: 3h  
**Complexidade**: Média

**O que fazer**:
```typescript
// storage.service.ts já existe!
// Só precisa configurar:
AWS_S3_BUCKET=vitas-uploads
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

**Sugestão**: Sprint 2. Storage local funciona para MVP.

---

#### 7. Push Notifications
**Issues GitHub**: #6 (fechada incorretamente)  
**Impacto**: 🟡 **MÉDIO** - Engagement  
**Tempo**: 6h  
**Complexidade**: Alta

**O que fazer**:
```typescript
// notification.service.ts já existe!
// Precisa:
1. Configurar FCM no Firebase Console
2. Adicionar service worker FCM no frontend
3. Solicitar permissão push
4. Enviar token para backend
5. Trigger notificações em eventos (triagem, agendamento)
```

**Arquivos**:
- `frontend/public/firebase-messaging-sw.js` (já existe!)
- `backend/src/notification/notification.service.ts` (integrar)

**Sugestão**: Sprint 3. Toast funciona bem para MVP.

---

#### 8. Página de Perfil do Usuário
**Issues GitHub**: #41 (EPIC parcial)  
**Impacto**: 🟡 **MÉDIO** - UX esperada  
**Tempo**: 4h  
**Complexidade**: Baixa

**O que fazer**:
```typescript
// Frontend
1. Criar /perfil route
2. Mostrar nome, email, role
3. Formulário alterar senha
4. Botão logout

// Backend
1. POST /auth/change-password
2. Validação senha forte (zxcvbn)
```

**Arquivos**:
- `frontend/src/pages/Perfil.tsx` (criar)
- `backend/src/auth/auth.controller.ts` (adicionar endpoint)

**Sugestão**: Sprint 2. Rápido e melhora UX.

---

#### 9. Dashboard com Métricas Reais
**Issues GitHub**: #21 (could-have)  
**Impacto**: 🔵 **BAIXO** - Nice to have  
**Tempo**: 8h  
**Complexidade**: Média

**O que fazer**:
```typescript
// Backend
GET /api/admin/dashboard/stats
{
  totalChamados: 42,
  porStatus: { ABERTO: 10, TRIADO: 5, ... },
  tempoMedioResolucao: '2.5 dias',
  ultimosChamados: [...]
}

// Frontend - AdminDashboard.tsx
1. Cards com números grandes
2. Gráfico pizza (Chart.js)
3. Tabela últimos chamados
```

**Sugestão**: Sprint 3. Dashboard básico já existe.

---

### 🧪 PRIORIDADE 3 - QUALIDADE E TESTES

#### 10. Testes Unitários Backend
**Issues GitHub**: #16 (in progress falso)  
**Impacto**: 🔴 **CRÍTICO** - Qualidade  
**Tempo**: 12h  
**Complexidade**: Média

**O que fazer**:
```bash
cd backend && npm run test
# Criar testes para:
- AuthService.login()
- TriagemService.executar()
- ChamadoService.criar()
- AgendamentoService.criar()
```

**Arquivos**:
- `backend/src/auth/auth.service.spec.ts` (expandir)
- `backend/src/triagem/triagem.service.spec.ts` (criar)
- `backend/src/chamado/chamado.service.spec.ts` (criar)

**Meta**: 60% coverage mínimo

**Sugestão**: Sprint 3. Essencial antes de escalar.

---

#### 11. Testes E2E Frontend
**Issues GitHub**: #23  
**Impacto**: 🟡 **MÉDIO** - Qualidade  
**Tempo**: 8h  
**Complexidade**: Alta

**O que fazer**:
```bash
cd frontend && npx playwright install
```

```typescript
// tests/e2e/chamado-flow.spec.ts
test('Criar chamado completo', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=email]', 'cliente@example.com')
  await page.fill('[name=password]', '123456')
  await page.click('button[type=submit]')
  // ... criar chamado
})
```

**Sugestão**: Sprint 3. Rodar em CI.

---

#### 12. CI/CD GitHub Actions
**Issues GitHub**: #2, #35 (fechada incorretamente)  
**Impacto**: 🔴 **CRÍTICO** - DevOps  
**Tempo**: 6h  
**Complexidade**: Média

**O que fazer**:
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test

# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build
      - uses: easingthemes/ssh-deploy@v2
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
```

**Sugestão**: Sprint 3. Automatizar deploy!

---

### 🔐 PRIORIDADE 4 - SEGURANÇA E COMPLIANCE

#### 13. LGPD Compliance
**Issues GitHub**: #50 (EPIC must-have)  
**Impacto**: 🟡 **MÉDIO** - Legal  
**Tempo**: 12h  
**Complexidade**: Alta

**O que fazer**:
```typescript
// 1. Consentimento
- Checkbox "Aceito política de privacidade" no cadastro
- Armazenar consentimento com timestamp

// 2. Exportação de dados
GET /api/users/me/export
-> Retorna JSON com todos os dados do usuário

// 3. Exclusão de dados
DELETE /api/users/me
-> Soft delete + anonimização

// 4. Auditoria
- Log de quem acessou dados de quem
- Tabela audit_log
```

**Arquivos**:
- `backend/src/auth/entities/user.entity.ts` (add consentimento)
- `backend/src/auth/auth.controller.ts` (endpoints LGPD)
- `frontend/src/pages/auth/Signup.tsx` (checkbox)

**Sugestão**: Sprint 4. Importante para B2B.

---

#### 14. Auditoria de Segurança
**Issues GitHub**: Parte de #50  
**Impacto**: 🟡 **MÉDIO** - Segurança  
**Tempo**: 6h  
**Complexidade**: Alta

**O que fazer**:
1. SQL Injection: TypeORM já protege ✅
2. XSS: React já escapa ✅
3. CSRF: Implementar tokens
4. Secrets no .env: ✅ Já feito
5. HTTPS: ✅ Já configurado
6. Rate Limiting: ❌ **FALTA**
7. Input Validation: Zod já valida ✅

**Sugestão**: Contratar pentest ou usar OWASP ZAP.

---

### 🎨 PRIORIDADE 5 - UX E POLISH

#### 15. Responsividade Mobile Completa
**Issues GitHub**: Implícito em #48  
**Impacto**: 🟡 **MÉDIO** - UX  
**Tempo**: 3h  
**Complexidade**: Baixa

**O que testar**:
```bash
# Chrome DevTools
- 360px (Galaxy S8)
- 375px (iPhone X)
- 414px (iPhone Plus)

# Checklist
[ ] Botões min 44px altura
[ ] Sem scroll horizontal
[ ] Touch feedback (hover states)
[ ] Menu hamburger se necessário
[ ] Forms usáveis
```

**Sugestão**: Sprint 2. PWA já funciona bem.

---

#### 16. Offline Mode (PWA)
**Issues GitHub**: #48 (EPIC must-have)  
**Impacto**: 🔵 **BAIXO** - Nice to have  
**Tempo**: 8h  
**Complexidade**: Alta

**O que fazer**:
```typescript
// Service Worker já existe!
// Adicionar:
1. Cache de chamados (IndexedDB)
2. Sync background quando voltar online
3. Banner "Você está offline"
4. Fila de ações pendentes
```

**Sugestão**: Sprint 5. MVP não precisa offline.

---

#### 17. Animações e Microinterações
**Issues GitHub**: #22 (melhorias UX)  
**Impacto**: 🔵 **BAIXO** - Polish  
**Tempo**: 4h  
**Complexidade**: Baixa

**O que fazer**:
```typescript
// Framer Motion
npm install framer-motion

// Adicionar:
- Fade in em páginas
- Slide in em modals
- Loading skeletons
- Hover animations
- Transition suaves
```

**Sugestão**: Sprint 5. Baixa prioridade.

---

### 📊 PRIORIDADE 6 - FUNCIONALIDADES AVANÇADAS (v2.0)

Não implementar agora, planejar para futuro:

- [ ] #18 - Contexto Vida Digital (16h)
- [ ] #19 - Grupos/Família (16h)
- [ ] #20 - Templates de Checklist (8h)
- [ ] #24 - Contexto Idosos (20h)
- [ ] #25 - Pagamentos (40h)
- [ ] #26 - Garantias Formais (12h)
- [ ] #27 - Score Avançado (8h)
- [ ] #28 - Expansão Backoffice (12h)
- [ ] #14 - Follow-up Automatizado (10h)

**Total**: ~142h (3.5 semanas)

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### 📅 SPRINT 1 - Desbloqueio (2 dias - 16h)

**Objetivo**: Fechar gaps críticos e corrigir issues incorretas

| # | Tarefa | Tempo | Prioridade |
|---|--------|-------|------------|
| 1 | Upload de fotos/anexos | 6h | 🔴 Crítico |
| 2 | Rate limiting | 2h | 🔴 Crítico |
| 3 | Logs estruturados (pino) | 4h | 🔴 Crítico |
| 4 | .env.example | 30min | 🟡 Médio |
| 5 | Reabrir issues #9, #13, #6, #35 | 30min | 🟡 Médio |

**Entregável**: 
- ✅ Upload funcionando
- ✅ API protegida
- ✅ Logs em produção
- ✅ Kanban GitHub alinhado com realidade

---

### 📅 SPRINT 2 - Funcionalidade (3 dias - 24h)

**Objetivo**: Completar funcionalidades esperadas

| # | Tarefa | Tempo | Prioridade |
|---|--------|-------|------------|
| 1 | Página de perfil | 4h | 🟡 Médio |
| 2 | OAuth Google | 4h | 🟡 Médio |
| 3 | S3 Storage | 3h | 🟡 Médio |
| 4 | Dashboard métricas | 8h | 🔵 Baixo |
| 5 | Auditoria mobile | 3h | 🟡 Médio |

**Entregável**:
- ✅ Usuário edita perfil
- ✅ Login com Google
- ✅ Storage escalável
- ✅ Dashboard útil

---

### 📅 SPRINT 3 - Qualidade (5 dias - 40h)

**Objetivo**: Garantir qualidade e automação

| # | Tarefa | Tempo | Prioridade |
|---|--------|-------|------------|
| 1 | CI/CD GitHub Actions | 6h | 🔴 Crítico |
| 2 | Testes unitários backend | 12h | 🔴 Crítico |
| 3 | Testes E2E frontend | 8h | 🟡 Médio |
| 4 | Push notifications | 6h | 🟡 Médio |
| 5 | Validação critérios aceite | 4h | 🔴 Crítico |

**Entregável**:
- ✅ Deploy automático
- ✅ 60% test coverage
- ✅ E2E críticos passando
- ✅ Notificações funcionando

---

### 📅 SPRINT 4 - Segurança (3 dias - 24h)

**Objetivo**: LGPD e segurança

| # | Tarefa | Tempo | Prioridade |
|---|--------|-------|------------|
| 1 | LGPD básico | 12h | 🟡 Médio |
| 2 | Auditoria segurança | 6h | 🟡 Médio |
| 3 | Pentest básico | 4h | 🟡 Médio |

**Entregável**:
- ✅ Conformidade LGPD básica
- ✅ Sem vulnerabilidades críticas

---

### 📅 SPRINT 5 - Polish (2 dias - 16h)

**Objetivo**: UX final

| # | Tarefa | Tempo | Prioridade |
|---|--------|-------|------------|
| 1 | Animações | 4h | 🔵 Baixo |
| 2 | Offline mode | 8h | 🔵 Baixo |
| 3 | Performance audit | 4h | 🟡 Médio |

**Entregável**:
- ✅ App "polished"
- ✅ Performance otimizada

---

## 📊 RESUMO EXECUTIVO

### Situação Atual
- **Implementado**: 31 funcionalidades (31%)
- **Faltando Crítico**: 17 itens (17%)
- **Faltando Médio**: 14 itens (14%)
- **Faltando Baixo**: 38 itens (38%)

### Esforço para MVP Completo
- **Sprint 1-3**: 80h (2 semanas)
- **Resultado**: MVP production-ready com 70% completude

### Esforço para MVP Robusto
- **Sprint 1-4**: 104h (2.5 semanas)
- **Resultado**: MVP seguro e escalável com 85% completude

### Esforço para v1.0 Completo
- **Sprint 1-5**: 120h (3 semanas)
- **Resultado**: v1.0 polished com 95% completude

---

## 🎬 PRÓXIMOS PASSOS IMEDIATOS

### Hoje (11/01/2026)
1. ✅ **Upload de fotos** (6h)
   - Implementar backend endpoint
   - Adicionar input file frontend
   - Testar em produção

2. ✅ **Rate limiting** (2h)
   - npm install @nestjs/throttler
   - Configurar global + login
   - Deploy

### Amanhã (12/01/2026)
1. ✅ **Logs estruturados** (4h)
   - npm install pino-http
   - Configurar logger
   - Deploy

2. ✅ **.env docs** (30min)
   - Criar .env.example
   - Documentar variáveis

### Semana 1 (13-17/01/2026)
- Sprint 2 completa
- MVP funcional com todas features core

### Semana 2 (20-24/01/2026)
- Sprint 3 completa
- Testes e CI/CD funcionando

---

## ✅ CHECKLIST DE ACEITE FINAL

MVP só está pronto quando:

### Funcionalidade
- [ ] Login/logout funciona
- [ ] Criar chamado com fotos
- [ ] Triagem recomenda profissional
- [ ] Agendamento confirmado
- [ ] Timeline mostra histórico completo
- [ ] Admin gerencia tudo

### Segurança
- [ ] JWT válido
- [ ] Rate limiting ativo
- [ ] Secrets em .env
- [ ] HTTPS funcionando
- [ ] Input validation em todos forms

### Qualidade
- [ ] 60% test coverage
- [ ] E2E fluxos críticos passando
- [ ] CI/CD deployando automático
- [ ] Logs estruturados em produção
- [ ] Zero console.errors

### UX
- [ ] PWA instalável
- [ ] Mobile responsivo (360px+)
- [ ] Loading states em todas ações
- [ ] Toast feedback sempre
- [ ] Sem bugs visuais

### Performance
- [ ] Landing page < 3s
- [ ] API p95 < 500ms
- [ ] Lighthouse score > 80

---

## 💡 SUGESTÕES ESTRATÉGICAS

### 1. Priorize Valor Percebido
**Upload de fotos** é mais impactante que OAuth para usuários finais.

### 2. Segurança Primeiro
**Rate limiting** protege investimento. Implementar HOJE.

### 3. Automatize Cedo
**CI/CD** na Sprint 3 evita deploy manual arriscado.

### 4. Teste Antes de Escalar
**Testes unitários** garantem refatoração segura.

### 5. LGPD é Marketing
**Compliance** abre portas B2B.

### 6. Performance Importa
**Lighthouse audit** antes de lançar oficialmente.

---

## 📞 COMO USAR ESTE DOCUMENTO

1. **Escolha um Sprint** (recomendo Sprint 1)
2. **Pegue primeira tarefa** (Upload de fotos)
3. **Implemente seguindo o "O que fazer"**
4. **Deploy em produção**
5. **Marque como ✅**
6. **Próxima tarefa**

**Não paralelize**. Uma tarefa de cada vez, bem feita.

---

## 🏆 MÉTRICAS DE SUCESSO

Após Sprint 1 (2 dias):
- ✅ Usuários podem anexar fotos
- ✅ API protegida contra abuso
- ✅ Logs facilitam debug
- ✅ GitHub alinhado com realidade

Após Sprint 3 (2 semanas):
- ✅ Deploy automático
- ✅ Testes garantem qualidade
- ✅ MVP pode escalar com segurança

Após Sprint 4 (2.5 semanas):
- ✅ LGPD compliant
- ✅ Sem vulnerabilidades críticas
- ✅ Pronto para B2B

---

**Boa sorte! 🚀**

Qualquer dúvida, consulte:
- `ANALISE_REGRESSIVA_GAPS.md` - Gaps técnicos
- `KANBAN_GITHUB_STATUS.md` - Issues GitHub
- Este documento - Plano de ação

**Comece pelo Upload de Fotos. É 6h que mudam a percepção do MVP.**
