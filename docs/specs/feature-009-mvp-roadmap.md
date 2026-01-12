# Feature 009: VITAS MVP — Roadmap de Finalização

**Status**: 🟡 Em Progresso  
**Prioridade**: 🔥 Crítica  
**Épico**: MVP Production Ready  
**Data**: 2026-01-05  
**Autor**: Equipe VITAS

---

## 📋 Visão Geral

O VITAS está 75% implementado com backend e frontend funcionais. Esta spec organiza as **pendências restantes** para alcançar um **MVP production-ready** seguindo ordem de prioridade baseada em impacto e risco.

### Progresso Atual
- ✅ Backend Core (Auth, Chamados, Triagem, Profissionais, Agendamento)
- ✅ Frontend Estrutura (React, Router, State Management)
- ✅ Páginas principais (Login, Chamados, Admin)
- ✅ UX básica (Loading, Toast, Validação)
- ⏳ Segurança em produção
- ⏳ Deploy e infraestrutura
- ⏳ Funcionalidades opcionais (Upload, Métricas, PWA)

---

## 🔴 PRIORIDADE 1 — BLOQUEADORES DE PRODUÇÃO

**Prazo**: 2 dias  
**Sem isso, não pode ir para produção.**

### P1.1: Autenticação JWT Real

**Problema**: Token atual é base64 simples, sem assinatura ou expiração.  
**Impacto**: ❌ Segurança zero, qualquer pessoa pode forjar tokens.

**Tarefas**:
```
[ ] Instalar jsonwebtoken no backend (npm i jsonwebtoken @types/jsonwebtoken)
[ ] Criar JWT_SECRET em .env (gerar string aleatória 64 chars)
[ ] Atualizar AuthService.login() para jwt.sign()
[ ] Configurar expiresIn: '7d'
[ ] Criar middleware JwtAuthGuard usando jwt.verify()
[ ] Atualizar todos os controllers com @UseGuards(JwtAuthGuard)
[ ] Testar token inválido retorna 401
[ ] (Opcional) Implementar refresh token
```

**Arquivos**:
- `backend/src/auth/auth.service.ts` - substituir `Buffer.from()` por `jwt.sign()`
- `backend/src/auth/jwt.strategy.ts` - criar estratégia Passport JWT
- `backend/src/auth/jwt-auth.guard.ts` - criar guard
- `backend/.env` - adicionar `JWT_SECRET=<random>`

**Critério de Aceite**:
- ✅ Login retorna JWT assinado
- ✅ Chamada sem token → 401
- ✅ Chamada com token expirado → 401
- ✅ Chamada com token válido → 200

---

### P1.2: Gestão de Ambientes

**Problema**: Sem separação dev/prod, secrets hardcoded.  
**Impacto**: ❌ Código inseguro, deploy impossível.

**Tarefas**:
```
[ ] Criar backend/.env com DB_PATH, JWT_SECRET, PORT, NODE_ENV
[ ] Criar backend/.env.example (sem valores sensíveis)
[ ] Adicionar .env ao .gitignore
[ ] Instalar @nestjs/config
[ ] Criar ConfigModule no AppModule
[ ] Substituir hardcoded values por process.env.*
[ ] Criar frontend/.env.production com VITE_API_URL
[ ] Criar frontend/.env.local com VITE_API_URL=http://localhost:3000/api
```

**Arquivos**:
- `backend/.env` (criar)
- `backend/.env.example` (criar)
- `backend/src/app.module.ts` - importar ConfigModule
- `frontend/.env.local` (criar)
- `frontend/.env.production` (criar)

**Critério de Aceite**:
- ✅ npm run dev usa .env.local
- ✅ npm run build:prod usa .env.production
- ✅ Nenhum secret no git

---

### P1.3: Deploy Funcional em Produção

**Problema**: App roda só em localhost.  
**Impacto**: ❌ Usuários não conseguem acessar.

**Tarefas**:
```
[ ] Configurar servidor Hostinger (Cloud Startup)
[ ] Instalar Node.js 18+ no servidor
[ ] Fazer build do backend (npm run build)
[ ] Fazer build do frontend (npm run build)
[ ] Configurar nginx para servir frontend estático
[ ] Configurar proxy reverso nginx → backend:3000
[ ] Configurar SSL/HTTPS (Let's Encrypt)
[ ] Testar domínio acessível (https://vitas.seudominio.com)
[ ] Configurar PM2 para manter backend rodando
[ ] Configurar restart automático após reboot
```

**Arquivos**:
- `docs/deploy-hostinger.md` (criar guia)
- `ecosystem.config.js` - PM2 config (criar)
- `nginx.conf` - configuração (criar)

**Critério de Aceite**:
- ✅ https://vitas.dominio.com carrega landing page
- ✅ Login funciona via HTTPS
- ✅ API responde via domínio
- ✅ Certificado SSL válido

---

## 🟠 PRIORIDADE 2 — CORE MVP (FUNCIONALIDADE ESPERADA)

**Prazo**: 3 dias  
**MVP "fecha o ciclo" corretamente.**

### P2.1: Upload de Arquivos/Fotos

**Problema**: Chamados sem evidências visuais.  
**Impacto**: 🟡 Funcionalidade esperada pelos usuários.

**Tarefas**:

**Backend**:
```
[ ] Instalar multer (@nestjs/platform-express já tem)
[ ] Criar ChamadoFoto entity (id, chamadoId, filename, path, mimeType)
[ ] Criar pasta backend/uploads (adicionar ao .gitignore)
[ ] Criar endpoint POST /chamados/:id/fotos com @UseInterceptors(FileInterceptor)
[ ] Validar tipo (image/jpeg, image/png, max 5MB)
[ ] Salvar arquivo em uploads/
[ ] Retornar URL pública da foto
[ ] Endpoint GET /chamados/:id/fotos para listar
```

**Frontend**:
```
[ ] Adicionar input type="file" no CriarChamado
[ ] Preview de imagem antes de enviar
[ ] Upload via FormData após criar chamado
[ ] Mostrar fotos no ChamadoDetail
[ ] Loading durante upload
[ ] Error handling
```

**Arquivos**:
- `backend/src/chamado/entities/chamado-foto.entity.ts` (criar)
- `backend/src/chamado/controllers/chamado.controller.ts` - adicionar endpoint upload
- `backend/src/chamado/services/chamado.service.ts` - lógica upload
- `frontend/src/pages/chamado/CriarChamado.tsx` - input file
- `frontend/src/pages/chamado/ChamadoDetail.tsx` - galeria fotos

**Critério de Aceite**:
- ✅ Upload de 1-5 fotos funciona
- ✅ Fotos aparecem no detalhe do chamado
- ✅ Validação de tipo/tamanho ativa
- ✅ Arquivo >5MB é rejeitado

---

### P2.2: Logs Estruturados

**Problema**: Console.log dificulta debug em produção.  
**Impacto**: 🟡 Impossível diagnosticar erros.

**Tarefas**:
```
[ ] Instalar pino-http (npm i pino-http)
[ ] Criar LoggerModule
[ ] Substituir console.log por logger.info()
[ ] Logar todos os requests (método, URL, status, tempo)
[ ] Logar todos os errors (stack trace)
[ ] Configurar log levels (dev: debug, prod: info)
[ ] Rotacionar logs diariamente
```

**Arquivos**:
- `backend/src/logger/logger.module.ts` (criar)
- `backend/src/logger/logger.service.ts` (criar)
- `backend/src/main.ts` - integrar pino-http

**Critério de Aceite**:
- ✅ Logs em formato JSON
- ✅ Request ID único por requisição
- ✅ Stack trace completo em erros

---

### P2.3: Rate Limiting

**Problema**: API exposta sem proteção.  
**Impacto**: 🟡 Abuso, DDoS, spam.

**Tarefas**:
```
[ ] Instalar @nestjs/throttler
[ ] Configurar ThrottlerModule (10 req/min global)
[ ] Aplicar @Throttle() em rotas sensíveis (login: 5/min)
[ ] Retornar 429 Too Many Requests
[ ] Adicionar header X-RateLimit-Remaining
```

**Arquivos**:
- `backend/src/app.module.ts` - importar ThrottlerModule
- `backend/src/auth/auth.controller.ts` - @Throttle({default: {limit: 5, ttl: 60000}})

**Critério de Aceite**:
- ✅ 11ª requisição em 1 minuto → 429
- ✅ Login após 5 tentativas → 429

---

### P2.4: AdminAgendamento — Integração Completa

**Problema**: Página existe mas não funciona.  
**Impacto**: 🟡 Operador não consegue gerenciar agendamentos.

**Tarefas**:
```
[ ] Implementar AdminAgendamentoPage
[ ] Listar todos agendamentos do sistema
[ ] Filtrar por status (PENDENTE, CONFIRMADO, CONCLUIDO)
[ ] Editar status do agendamento
[ ] Reagendar data/hora
[ ] Integrar com Toast feedback
[ ] Adicionar loading states
```

**Arquivos**:
- `frontend/src/pages/admin/AdminAgendamento.tsx` - implementar
- `frontend/src/services/agendamentoService.ts` - adicionar métodos

**Critério de Aceite**:
- ✅ Operador vê todos agendamentos
- ✅ Pode mudar status PENDENTE → CONFIRMADO
- ✅ Pode reagendar

---

## 🟡 PRIORIDADE 3 — EXPERIÊNCIA E VISIBILIDADE

**Prazo**: 2 dias  
**MVP "apresentável" para usuários e investidores.**

### P3.1: Dashboard com Métricas

**Tarefas**:
```
[ ] Criar endpoint GET /api/admin/dashboard/stats
[ ] Retornar: total chamados, por status, tempo médio resolução
[ ] Criar página AdminDashboard
[ ] Cards com números grandes (ex: 42 chamados)
[ ] Gráfico de pizza (status)
[ ] Tabela dos últimos 5 chamados
```

**Arquivos**:
- `backend/src/admin/controllers/dashboard.controller.ts` (criar)
- `frontend/src/pages/admin/AdminDashboard.tsx` (criar)

**Critério de Aceite**:
- ✅ Dashboard mostra métricas em tempo real
- ✅ Atualiza ao criar novo chamado

---

### P3.2: Página de Perfil do Usuário

**Tarefas**:
```
[ ] Criar página /perfil
[ ] Mostrar nome, email, role
[ ] Formulário alterar senha
[ ] Botão logout
[ ] Validação senha forte
```

**Arquivos**:
- `frontend/src/pages/Perfil.tsx` (criar)
- `backend/src/auth/auth.controller.ts` - endpoint PATCH /auth/change-password

**Critério de Aceite**:
- ✅ Usuário altera senha
- ✅ Senha fraca rejeitada

---

### P3.3: Otimização Mobile

**Tarefas**:
```
[ ] Testar em Android Chrome
[ ] Ajustar breakpoints CSS
[ ] Botões maiores (min 44px)
[ ] Touch feedback visual
[ ] Menu hamburger responsivo
```

**Arquivos**:
- `frontend/src/styles/index.css` - media queries

**Critério de Aceite**:
- ✅ App usável em tela 360px
- ✅ Sem scroll horizontal

---

## 🔵 PRIORIDADE 4 — QUALIDADE TÉCNICA

**Prazo**: 3 dias  
**Não bloqueia, mas evita dor futura.**

### P4.1: Testes Unitários (Backend)

**Tarefas**:
```
[ ] Configurar Jest
[ ] Testar AuthService.login()
[ ] Testar TriagemService.executar()
[ ] Testar regras de matching
[ ] Coverage mínimo 60%
```

**Arquivos**:
- `backend/src/auth/auth.service.spec.ts` (criar)
- `backend/src/triagem/services/triagem.service.spec.ts` (criar)

---

### P4.2: Testes E2E (Frontend)

**Tarefas**:
```
[ ] Instalar Playwright ou Cypress
[ ] Teste: Login → Criar Chamado → Ver Lista
[ ] Teste: Operador executa triagem
[ ] CI roda testes antes do deploy
```

**Arquivos**:
- `frontend/tests/e2e/login.spec.ts` (criar)
- `frontend/tests/e2e/chamado-flow.spec.ts` (criar)

---

## 🟣 PRIORIDADE 5 — PWA E INFRA

**Prazo**: 2 dias  
**Diferencial e escalabilidade.**

### P5.1: PWA

**Tarefas**:
```
[ ] Instalar vite-plugin-pwa
[ ] Criar manifest.json (nome, ícones, cores)
[ ] Gerar ícones 192x192, 512x512
[ ] Service Worker básico
[ ] Cache de rotas estáticas
[ ] Install prompt
```

**Arquivos**:
- `frontend/public/manifest.json` (criar)
- `frontend/vite.config.ts` - plugin PWA

**Critério de Aceite**:
- ✅ App instalável no Android
- ✅ Funciona offline (landing page)

---

### P5.2: Dockerização

**Tarefas**:
```
[ ] Criar Dockerfile.backend
[ ] Criar Dockerfile.frontend
[ ] docker-compose.yml (backend + frontend + postgres?)
[ ] Build imagens
[ ] Testar containers
```

**Arquivos**:
- `Dockerfile.backend` (criar)
- `Dockerfile.frontend` (criar)
- `docker-compose.yml` (criar)

---

### P5.3: CI/CD

**Tarefas**:
```
[ ] GitHub Actions workflow
[ ] On push: lint + build + test
[ ] On merge main: deploy automático
[ ] Notificação Slack/Discord
```

**Arquivos**:
- `.github/workflows/ci.yml` (criar)
- `.github/workflows/deploy.yml` (criar)

---

### P5.4: Monitoramento

**Tarefas**:
```
[ ] Integrar Sentry frontend
[ ] Integrar Sentry backend
[ ] Health check endpoint GET /health
[ ] Uptime monitoring (UptimeRobot)
```

**Arquivos**:
- `backend/src/health/health.controller.ts` (criar)
- `frontend/src/main.tsx` - Sentry.init()

---

## 🧾 CHECKLIST FINAL DE ACEITE (MVP)

O MVP só é considerado **"pronto para produção"** quando:

### Funcionalidade
- [ ] Login gera JWT válido com expiração
- [ ] Usuário cliente cria chamado em produção
- [ ] Fotos são anexadas e visualizadas no chamado
- [ ] Operador executa triagem automática
- [ ] Agendamento pode ser criado e gerenciado
- [ ] Histórico do chamado funciona corretamente
- [ ] Toast feedback em todas as ações

### Segurança
- [ ] JWT assinado e verificado
- [ ] Rate limiting ativo
- [ ] Secrets em .env (não no código)
- [ ] HTTPS ativo

### Deploy
- [ ] App roda em HTTPS com domínio
- [ ] Backend acessível via API
- [ ] Frontend build otimizado
- [ ] PM2 restart automático

### UX
- [ ] Build PWA instalável
- [ ] Loading states em todas páginas
- [ ] Mobile responsivo (360px+)

### Observabilidade
- [ ] Logs estruturados em JSON
- [ ] Sentry captura erros
- [ ] Health check retorna 200

---

## 📊 ESTIMATIVA DE TEMPO

| Prioridade | Dias | Acumulado |
|------------|------|-----------|
| P1 - Bloqueadores | 2d | 2d |
| P2 - Core MVP | 3d | 5d |
| P3 - Experiência | 2d | 7d |
| P4 - Qualidade | 3d | 10d |
| P5 - PWA/Infra | 2d | 12d |

**Total estimado**: ~12 dias úteis (2.5 semanas)

---

## 🎯 ESTRATÉGIA DE EXECUÇÃO

### Semana 1 (Sprint MVP Core)
- Dias 1-2: **P1** (JWT + Env + Deploy básico)
- Dias 3-5: **P2** (Upload + Logs + Rate Limit + AdminAgendamento)

### Semana 2 (Sprint Polish)
- Dias 6-7: **P3** (Dashboard + Perfil + Mobile)
- Dias 8-10: **P4** (Testes)

### Semana 3 (Sprint Scale)
- Dias 11-12: **P5** (PWA + Docker + CI/CD + Monitoring)

---

## ⚠️ RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Deploy Hostinger falha | Média | Alto | Documentar processo, backup VPS alternativo |
| SSL não configura | Baixa | Médio | Let's Encrypt tem docs extensas |
| Upload consome muito espaço | Média | Médio | Limitar 5 fotos/chamado, max 5MB cada |
| Testes E2E demoram muito | Alta | Baixo | Rodar só em CI, não local |

---

## 📚 REFERÊNCIAS

- [NestJS JWT Auth](https://docs.nestjs.com/security/authentication)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Hostinger Node Deploy](https://support.hostinger.com/en/articles/5578821-how-to-deploy-node-js-application)
- [PM2 Production Guide](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

## 🎬 CONCLUSÃO

O VITAS está **75% completo** com arquitetura sólida. As pendências são previsíveis e organizáveis. 

**Mensagem-chave**: O erro comum é achar que "falta pouco" e nunca fechar. Esta spec garante fechamento em **2-3 semanas** seguindo ordem de prioridade.

**Próximo passo imediato**: Começar por **P1.1 - JWT Real** (impacto máximo, 4h de trabalho).

---

**Fim da Spec**
