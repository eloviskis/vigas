# 📑 Índice de Documentação - VITAS Project

## 🚀 Começar Aqui
- **[ROADMAP_COMPLETO.txt](ROADMAP_COMPLETO.txt)** - Resumo visual das 4 iniciativas
- **[README.md](README.md)** - Visão geral do projeto
- **[TESTING.md](TESTING.md)** - Guia completo de testes

## 📊 Relatórios de Progresso
- **[PROGRESS_4_PASSOS.md](PROGRESS_4_PASSOS.md)** - Detalhes das 4 iniciativas com checklist
- **[BACKLOG-PRIORIZADO.md](BACKLOG-PRIORIZADO.md)** - Backlog priorizado do projeto

## 🏗️ Arquitetura & Design
- **[docs/API.md](docs/API.md)** - Documentação OpenAPI (endpoints REST)
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Diagramas C4
- **[docs/UX.md](docs/UX.md)** - Wireframes e user flows

## 📁 Estrutura do Projeto

### Backend (NestJS)
```
backend/
├── src/
│   ├── auth/                    # Autenticação (JWT)
│   ├── chamado/                 # Gerenciamento de chamados
│   ├── agendamento/             # Agendamentos
│   ├── triagem/                 # Matching de profissionais
│   ├── profissional/            # Perfil de profissionais
│   ├── pagamento/               # Integração Mercado Pago
│   ├── followup/      ⭐ NOVO   # Sistema de acompanhamento
│   ├── avaliacao/               # Avaliações e reviews
│   ├── notification/            # Firebase FCM
│   └── storage/                 # Upload de arquivos
├── jest.config.js
├── package.json
└── tsconfig.json
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── ChamadoList.tsx
│   │   ├── ChamadoDetail.tsx
│   │   ├── Checkout.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── AdminPagamentos.tsx ⭐ NOVO
│   │   ├── lazy.tsx             ⭐ Code splitting
│   │   └── ...
│   ├── components/
│   │   ├── FollowupWidget.tsx   ⭐ NOVO
│   │   ├── LazyImage.tsx        ⭐ NOVO
│   │   └── ...
│   ├── hooks/
│   │   ├── useLazy.ts           ⭐ NOVO
│   │   └── ...
│   ├── services/
│   │   ├── followupService.ts   ⭐ NOVO
│   │   ├── chamadoService.ts
│   │   ├── pagamentoService.ts
│   │   └── ...
│   ├── utils/
│   │   ├── performance.ts       ⭐ NOVO (Web Vitals)
│   │   ├── swRegister.ts        ⭐ NOVO (Service Worker)
│   │   └── ...
│   ├── store/
│   │   └── authStore.ts
│   ├── __tests__/              ⭐ NOVO (Unit tests)
│   │   ├── Login.test.tsx
│   │   ├── ChamadoList.test.tsx
│   │   ├── Checkout.test.tsx
│   │   ├── useAuthStore.test.ts
│   │   └── setup.ts
│   └── App.tsx
├── e2e/                        ⭐ NOVO (E2E tests)
│   └── full-flow.spec.ts
├── public/
│   └── sw.js                   ⭐ NOVO (Service Worker)
├── vite.config.ts
├── vitest.config.ts            ⭐ NOVO
├── playwright.config.ts        ⭐ NOVO
├── package.json
└── tsconfig.json
```

## 🧪 Testes

### Testes Unitários Frontend
```bash
cd frontend
npm test              # Rodar todos
npm run test:watch    # Modo watch
npm run test:coverage # Com cobertura
npm run test:ui       # Interface visual
```

**Arquivo:** `frontend/src/__tests__/`
- **Login.test.tsx** - 3 testes (render, validação, autenticação)
- **ChamadoList.test.tsx** - 4 testes (render, filtros, detalhes)
- **Checkout.test.tsx** - 5 testes (métodos pagamento, PIX, erro)
- **useAuthStore.test.ts** - 5 testes (login, logout, sessão)

### Testes Unitários Backend
```bash
cd backend
npm test              # Todos
npm test -- followup  # Apenas followup
```

**Arquivos:** `backend/src/**/*.spec.ts`
- **auth.service.spec.ts** - 3 testes
- **chamado.service.spec.ts** - 2 testes
- **triagem.service.spec.ts** - 2 testes
- **pagamento.service.spec.ts** - 2 testes
- **followup.service.spec.ts** - 6 testes ⭐ NOVO

### Testes E2E
```bash
cd frontend
npm run test:e2e      # Headless
npm run test:e2e:ui   # Interface
npm run test:e2e:debug # Debug
```

**Arquivo:** `frontend/e2e/full-flow.spec.ts`
- Cenário 1: Login → Criar Chamado
- Cenário 2: Triagem de Profissional
- Cenário 3: Pagamento PIX
- Cenário 4: Admin Pagamentos + Estorno
- Cenário 5: Integração Completa

## 🚀 Scripts NPM

### Backend
```bash
npm run dev              # Desenvolver (watch mode)
npm run build            # Build produção
npm start                # Executar servidor
npm test                 # Rodar testes
npm test -- --coverage   # Com cobertura
```

### Frontend
```bash
npm run dev              # Dev server (Vite)
npm run build            # Build otimizado
npm run preview          # Preview build
npm test                 # Testes Vitest
npm run test:watch       # Teste em watch
npm run test:coverage    # Com cobertura
npm run test:e2e         # E2E com Playwright
npm run test:e2e:ui      # E2E interface
npm run lint             # ESLint
npm run format           # Prettier
```

## 📚 Guias por Feature

### Follow-up/CRM (#14)
1. **Backend Implementation:** `backend/src/followup/`
   - `entities/followup.entity.ts` - Modelo de dados
   - `services/followup.service.ts` - Lógica
   - `controllers/followup.controller.ts` - Endpoints
   - `dtos/followup.dto.ts` - DTOs (Data Transfer Objects)

2. **Frontend Implementation:** `frontend/src/components/FollowupWidget.tsx`
   - Widget com modal interativo
   - Integrado em ChamadoDetail

3. **Endpoints REST:**
   ```
   POST   /followups                  # Criar
   GET    /followups/:id              # Obter
   GET    /followups/agendamento/:id  # Listar por agendamento
   PUT    /followups/:id/enviar       # Enviar notificação
   PUT    /followups/:id/responder    # Responder
   GET    /followups/metricas/geral   # Métricas
   ```

### Performance (#22)
1. **Code Splitting:** `frontend/src/pages/lazy.tsx`
   - React.lazy() para lazy load de rotas
   - Suspense fallback

2. **Image Lazy Loading:** `frontend/src/hooks/useLazy.ts` + `frontend/src/components/LazyImage.tsx`
   - Intersection Observer API
   - Placeholder SVG

3. **Service Worker:** `frontend/public/sw.js`
   - Cache-first (assets)
   - Network-first (API)
   - Stale-while-revalidate (HTML)

4. **Monitoring:** `frontend/src/utils/performance.ts`
   - Web Vitals (LCP, FID, CLS, FCP, TTFB)
   - Envio para analytics

### Testes Frontend (#16)
- **Unit Tests:** `frontend/src/__tests__/`
- **E2E Tests:** `frontend/e2e/`
- **Config:** `frontend/vitest.config.ts`, `frontend/playwright.config.ts`

### Testes E2E (#23)
- **Config:** `frontend/playwright.config.ts`
- **Testes:** `frontend/e2e/full-flow.spec.ts`
- **Estratégia:** Chromium + Firefox, headless + UI, debug

## 🔧 Configuração

### Environment Variables
```
.env                    # Root
backend/.env           # Backend config (DB, API keys)
frontend/.env          # Frontend config (API base URL)
```

### Database
- **Development:** SQLite (arquivo `data/vitas.db`)
- **Production:** PostgreSQL

### Banco de Dados (Schema)
- `usuarios` - Clientes e profissionais
- `chamados` - Requisições de serviço
- `agendamentos` - Agendamentos
- `triagens` - Matching de profissionais
- `orcamentos` - Orçamentos
- `pagamentos` - Transações Mercado Pago
- `avaliacoes` - Reviews e ratings
- `followups` ⭐ NOVO - Acompanhamento pós-agendamento

## 📖 Recursos Externos
- [NestJS Docs](https://docs.nestjs.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Mercado Pago SDK](https://www.mercadopago.com.br/developers/)

## 💡 Tips & Tricks

### Build & Deploy
```bash
# Build local completo
cd backend && npm run build
cd ../frontend && npm run build

# Tamanho dos bundles
du -sh frontend/dist/
du -sh backend/dist/

# Benchmark de performance
bash benchmark.sh
```

### Debugging
```bash
# Backend com debugger
node --inspect-brk dist/main.js

# Frontend com DevTools
npm run dev

# E2E com debug visual
npm run test:e2e:debug
```

### Database
```bash
# Backup
pg_dump vitas > backup.sql

# Restore
psql vitas < backup.sql

# Ver migrations
npm run typeorm migration:show
```

## 🎯 Checklist de Deployment

- [ ] Variáveis de ambiente configuradas
- [ ] Testes passando (npm test)
- [ ] Build sem erros
- [ ] E2E tests validadas
- [ ] Database migrations aplicadas
- [ ] SSL/HTTPS configurado
- [ ] PM2 iniciado
- [ ] Nginx configurado
- [ ] Backups agendados
- [ ] Monitoring setup (Sentry, New Relic, etc)

## 📞 Support & Troubleshooting

Ver [TESTING.md](TESTING.md) para troubleshooting de testes.

Comum issues:
- **Port 3000 em uso:** `lsof -i :3000`
- **Módulo não encontrado:** `npm install`
- **Jest timeout:** Aumentar em `jest.config.js`
- **E2E falhando:** Verificar se servidor está rodando

---

**Último Update:** Janeiro 2026
**Branch:** 007-agendamento
**Status:** ✅ 4/4 Iniciativas Completas
