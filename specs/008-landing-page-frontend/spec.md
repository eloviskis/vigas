# Feature Specification: Landing Page & Dashboard Frontend

**Feature Branch**: `008-landing-page-frontend`  
**Created**: 2026-01-04  
**Status**: Not Started  
**Input**: User description: "Landing page com call-to-action, dashboard cliente e operador para acompanhar chamados e agendamentos"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Landing Page (Priority: P1)

Website público apresenta VITAS com hero section, features, pricing e CTA para baixar app ou criar chamado.

**Why this priority**: MVP precisa de presença online para conversão de usuários. Landing page é primeira interação.

**Independent Test**: Landing page carrega em < 3s, é responsiva (mobile/desktop), botões funcionam, form de contato envia email.

**Acceptance Scenarios**:

1. **Given** usuário acessa https://vitas.com, **When** página carrega, **Then** vê hero section com "Encontre o profissional certo em 1 clique"
2. **Given** usuário em desktop, **When** redimensiona para mobile, **Then** layout se adapta corretamente (hamburger menu)
3. **Given** usuário vê botão "Baixar App Android", **When** clica, **Then** navega para página de download com .apk
4. **Given** usuário em seção "Como funciona", **When** vê 3 steps (Criar, Triagem, Agendar), **Then** cada step tem ícone + descrição + seta

---

### User Story 2 - Dashboard Cliente (Priority: P1)

Cliente autenticado vê lista de seus chamados, pode criar novo, acompanhar timeline (historico), status de agendamento.

**Why this priority**: Core da experiência do usuário. Cliente precisa saber o status em tempo real.

**Independent Test**: Cliente pode criar chamado, listar seus chamados, ver timeline completa, cancelar agendamento se pendente.

**Acceptance Scenarios**:

1. **Given** cliente autenticado, **When** acessa /chamados, **Then** vê lista de seus chamados com status (ABERTO, TRIADO, AGENDADO, CONCLUIDO)
2. **Given** cliente sem chamados, **When** acessa /chamados, **Then** vê "Nenhum chamado" + botão "Criar novo"
3. **Given** cliente em /chamados/new, **When** preenche {titulo, descricao, contexto} e clica "Criar", **Then** chamado é criado (POST /api/chamados)
4. **Given** chamado criado, **When** cliente clica nele, **Then** vê página de detalhes com timeline (historico) mostrando CRIADO → TRIADO → AGENDADO → CONCLUIDO
5. **Given** agendamento PENDENTE, **When** cliente clica "Confirmar", **Then** PUT /api/agendamentos/:id/confirmar é executado, status muda para CONFIRMADO
6. **Given** agendamento em qualquer estado < CONCLUIDO, **When** cliente clica "Cancelar", **Then** PUT /api/agendamentos/:id/cancelar é executado

---

### User Story 3 - Dashboard Operador (Priority: P1)

Operador autenticado vê chamados abertos, executa triagem automática ou manual, agenda agendamentos, acompanha SLA.

**Why this priority**: Operadores são power users que controlam fluxo. Precisam de visibilidade e ações rápidas.

**Independent Test**: Operador pode listar chamados, clicar "Fazer Triagem", ver resultado, confirmar ou editar recomendação, criar agendamento.

**Acceptance Scenarios**:

1. **Given** operador autenticado, **When** acessa /admin/chamados, **Then** vê tabela com chamados ABERTOS ordenados por criação (DESC)
2. **Given** operador vê chamado ABERTO, **When** clica "Fazer Triagem", **Then** POST /api/chamados/:id/triagem é executado, resultado aparece (RECOMENDADO/MULTIPLAS_OPCOES/SEM_PROFISSIONAL)
3. **Given** triagem retorna RECOMENDADO com profissional_id, **When** operador vê card de recomendação com foto + nome + score, **Then** pode clicar "Confirmar" (cria agendamento automaticamente)
4. **Given** triagem retorna MULTIPLAS_OPCOES, **When** operador vê 3 opções com scores diferentes, **Then** pode clicar uma para selecionar e PUT /api/triagem/:id/recomendacao
5. **Given** profissional selecionado, **When** operador clica "Agendar", **Then** navega para página de booking com slots disponíveis (GET /api/profissionais/:id/slots)
6. **Given** operador selecionou slot, **When** clica "Confirmar Agendamento", **Then** POST /api/chamados/:id/agendamentos é executado, agendamento criado
7. **Given** agendamento criado, **When** operador volta a /admin/chamados, **Then** status do chamado mudou para AGENDADO

---

### User Story 4 - Autenticação & Sessão (Priority: P1)

Sistema autentica usuários (cliente/operador) via login/senha ou JWT token, mantém sessão, permite logout, protege rotas.

**Why this priority**: Segurança essencial. Sem auth, não há privacy de dados.

**Independent Test**: Login funciona, token é armazenado, rotas protegidas redirecionam para login, logout limpa token.

**Acceptance Scenarios**:

1. **Given** usuário não autenticado, **When** tenta acessar /chamados, **Then** é redirecionado para /login
2. **Given** usuário em /login, **When** preenche email + senha e clica "Entrar", **Then** POST /api/auth/login é executado, token recebido
3. **Given** token recebido, **When** armazenado em localStorage, **Then** requests subsequentes incluem header "Authorization: Bearer {token}"
4. **Given** usuário autenticado, **When** clica "Sair", **Then** localStorage é limpo, redirecionado para /login
5. **Given** token expirado, **When** faz request, **Then** recebe 401, redirecionado para /login

---

### User Story 5 - Notificações em Tempo Real (Priority: P2)

Cliente e operador recebem notificações quando status muda (triagem pronta, agendamento confirmado, serviço iniciado).

**Why this priority**: Melhora UX, reduz necessidade de refresh manual. Não é crítico para MVP inicial mas aumenta engagement.

**Independent Test**: Notificação push aparece quando servidor emite evento, usuário vê toast/badge, histórico de notificações acessível.

**Acceptance Scenarios**:

1. **Given** cliente com chamado TRIADO, **When** servidor executa triagem, **Then** cliente recebe notificação "Profissional recomendado: João Silva"
2. **Given** operador com chamado pendente triagem, **When** sistema envia notificação de novo chamado, **Then** operador vê toast + badge no menu

---

## User Journey

```
CLIENTE:
1. Acessa https://vitas.com (landing)
2. Clica "Criar Chamado" → /login (se não autenticado)
3. Login com email/senha
4. Redirecionado para /chamados
5. Clica "Novo Chamado"
6. Preenche {titulo, descricao, contexto, categoria}
7. Sistema cria chamado, redireciona para /chamados/:id
8. Vê status ABERTO, aguarda triagem (recebe notificação)
9. Ver recomendação em timeline
10. Confirma agendamento quando recebe link
11. Vê status CONCLUIDO

OPERADOR:
1. Acessa /admin (já autenticado)
2. Vê dashboard com chamados ABERTOS
3. Clica em um chamado → /admin/chamados/:id
4. Clica "Fazer Triagem" → POST /api/chamados/:id/triagem
5. Vê resultado (RECOMENDADO/MULTIPLAS_OPCOES)
6. Se RECOMENDADO, clica "Agendar"
7. Seleciona slot disponível
8. Clica "Confirmar"
9. Agendamento criado, cliente recebe notificação
10. Cliente confirma (PUT /api/agendamentos/:id/confirmar)
11. Operador pode marcar "Iniciado" e "Concluído" quando serviço acontece
```

---

## Technical Requirements

| Requirement | Details |
|-------------|---------|
| **Framework** | React 18 + Vite |
| **UI Library** | Shadcn/ui (ou Material-UI) |
| **State Management** | Zustand (simples) ou Redux (se complexo) |
| **API Client** | Axios com interceptors para auth |
| **Routing** | React Router v6 |
| **Forms** | React Hook Form + Zod (validation) |
| **Real-time** | Socket.io (opcional Phase 2) ou polling simples |
| **Auth** | JWT token em localStorage |
| **Styling** | Tailwind CSS |
| **Testing** | Vitest + React Testing Library |
| **Build** | Vite (dev: npm run dev, prod: npm run build) |

---

## Deliverables

### By End of Feature:
- ✅ Landing page (público, sem auth)
- ✅ Páginas autenticadas (cliente + operador)
- ✅ Integração com API backend (todos os endpoints)
- ✅ Autenticação JWT + sessão
- ✅ Responsivo (mobile + desktop)
- ✅ Swagger/API docs integrado

### Phase 2 (v1.1):
- Notificações real-time (Socket.io)
- Analytics (Mixpanel)
- Email confirmação
- Dark mode

---

## Acceptance Criteria

- [ ] Landing page carrega em < 3s
- [ ] Todos os endpoints da API integrados
- [ ] Login/logout funciona sem erros
- [ ] Dashboard cliente lista e cria chamados
- [ ] Dashboard operador faz triagem e agendamento
- [ ] Responsivo em mobile (375px) + desktop (1920px)
- [ ] Sem console errors/warnings
- [ ] Jest tests com >70% coverage
