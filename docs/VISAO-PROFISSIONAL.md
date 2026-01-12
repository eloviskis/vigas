# 👷 Visão do Profissional - VITAS

## 📍 Status Atual

### ✅ O que já existe:

1. **Backend Completo**:
   - API `/api/profissionais` implementada
   - CRUD de profissionais
   - Listagem com filtro por localização e contexto
   - Cálculo de distância (lat/lon)
   - Atualização de status (ativo/inativo)

2. **Entidade Profissional** (`backend/src/profissional/entities/profissional.entity.ts`):
   ```typescript
   - id: UUID
   - usuarioId: UUID (vincula ao User)
   - especialidades: string[] (array de especialidades)
   - localizacao: { lat: number, lon: number }
   - raioAtuacao: number (km)
   - status: 'ATIVO' | 'INATIVO'
   - score: number (reputação)
   - totalAvaliacoes: number
   - mediaAvaliacoes: number
   ```

3. **Frontend Cadastro**:
   - Página `/cadastro-profissional` existe
   - Formulário com nome, email, senha, especialidades
   - Link no menu "Sou Profissional"

### ❌ O que NÃO existe:

1. **Dashboard do Profissional**: Não implementado
2. **Listagem de Chamados Disponíveis**: Não implementado
3. **Envio de Orçamentos**: Não implementado
4. **Gestão de Agenda**: Não implementado
5. **Histórico de Serviços**: Não implementado

---

## 🎯 Como Acessar a Visão do Profissional

### Opção 1: Via Cadastro Existente

1. **Criar Conta de Profissional**:
   - Acessar: http://31.97.64.250/cadastro-profissional
   - Preencher: nome, email, senha, especialidades
   - Submeter formulário

2. **Fazer Login** (após cadastro):
   - Acessar: http://31.97.64.250/login
   - Usar credenciais criadas
   - Sistema identifica role e redireciona

3. **Problema**: 
   - ❌ Não há dashboard específico do profissional
   - ❌ Usuário é redirecionado para `/chamados` (visão de cliente)

### Opção 2: Via Banco de Dados (Desenvolvimento)

Você pode criar um profissional diretamente no backend e testar via API:

```bash
# POST http://31.97.64.250/api/profissionais
{
  "usuarioId": "uuid-do-usuario",
  "especialidades": ["Eletricista", "Encanador"],
  "localizacao": {
    "lat": -23.5505,
    "lon": -46.6333
  },
  "raioAtuacao": 10
}
```

---

## 🚧 O que precisa ser implementado

### 1. **Dashboard do Profissional** (PRIORIDADE ALTA)

Criar: `frontend/src/pages/profissional/DashboardProfissional.tsx`

**Funcionalidades**:
```tsx
- Ver chamados disponíveis na região (raio de atuação)
- Filtrar por especialidade
- Ver detalhes do chamado
- Enviar orçamento
- Histórico de orçamentos enviados
- Histórico de serviços realizados
- Métricas: Total ganho, avaliações, ranking
```

### 2. **Listagem de Chamados Disponíveis**

Criar: `frontend/src/pages/profissional/ChamadosDisponiveis.tsx`

**API já existe**:
- GET `/api/chamados` - retorna todos chamados
- Filtrar por: status=ABERTO, localização próxima

**UI**:
```tsx
<ChamadoCard
  titulo={chamado.titulo}
  descricao={chamado.descricao}
  localizacao={chamado.localizacao}
  distancia="2.3 km"
  prioridade={chamado.prioridade}
  dataDesejada={chamado.dataDesejada}
  onEnviarOrcamento={() => {}}
/>
```

### 3. **Envio de Orçamentos**

Criar: `frontend/src/components/profissional/EnviarOrcamento.tsx`

**Backend precisa criar**:
- `OrcamentoModule` (novo)
- Entity: `Orcamento` (id, chamadoId, profissionalId, valor, descricao, prazo, status)
- POST `/api/orcamentos`

**Fluxo**:
1. Profissional vê chamado
2. Clica "Enviar Orçamento"
3. Modal abre com formulário:
   - Valor (R$)
   - Prazo (dias/horas)
   - Descrição do serviço
   - Disponibilidade
4. Submete
5. Cliente recebe notificação

### 4. **Gestão de Agenda**

Criar: `frontend/src/pages/profissional/MinhaAgenda.tsx`

**Backend já tem slots**:
- GET `/api/slots?profissionalId=xxx`
- POST `/api/slots` (criar disponibilidade)

**UI**:
```tsx
<CalendarioDisponibilidade
  profissionalId={user.profissionalId}
  onCreateSlot={(date, duration) => {}}
  onDeleteSlot={(slotId) => {}}
/>
```

### 5. **Histórico de Serviços**

Criar: `frontend/src/pages/profissional/HistoricoServicos.tsx`

**API**:
- GET `/api/agendamentos?profissionalId=xxx`
- Filtrar por status: CONCLUIDO

**UI**:
```tsx
<ServicoCard
  cliente={agendamento.chamado.usuarioNome}
  servico={agendamento.chamado.titulo}
  data={agendamento.dataHora}
  valor={agendamento.valorPago}
  avaliacao={agendamento.avaliacao}
/>
```

---

## 📐 Arquitetura Recomendada

### Estrutura de Pastas

```
frontend/src/pages/profissional/
├── DashboardProfissional.tsx (hub central)
├── ChamadosDisponiveis.tsx (feed de chamados)
├── EnviarOrcamento.tsx (modal/página)
├── MinhaAgenda.tsx (calendário)
├── HistoricoServicos.tsx (lista)
├── MeuPerfil.tsx (dados, especialidades)
└── Estatisticas.tsx (métricas)
```

### Componentes Reutilizáveis

```
frontend/src/components/profissional/
├── ChamadoCard.tsx
├── OrcamentoForm.tsx
├── CalendarioDisponibilidade.tsx
├── ServicoCard.tsx
└── StatusBadge.tsx
```

### Rotas

```tsx
// frontend/src/App.tsx
<Routes>
  <Route path="/profissional" element={<ProfissionalLayout />}>
    <Route index element={<DashboardProfissional />} />
    <Route path="chamados" element={<ChamadosDisponiveis />} />
    <Route path="agenda" element={<MinhaAgenda />} />
    <Route path="historico" element={<HistoricoServicos />} />
    <Route path="perfil" element={<MeuPerfil />} />
  </Route>
</Routes>
```

---

## 🔐 Controle de Acesso

### Guard no Frontend

```tsx
// frontend/src/components/ProfissionalRoute.tsx
function ProfissionalRoute({ children }) {
  const user = useAuthStore(state => state.user);
  
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'PROFISSIONAL') {
    return <Navigate to="/chamados" />;
  }
  
  return children;
}
```

### Guard no Backend (já existe)

```typescript
// backend/src/auth/guards/roles.guard.ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PROFISSIONAL)
@Get('meus-chamados')
async meusChamados(@Request() req) {
  // Só profissionais acessam
}
```

---

## 🎨 Mockup UI/UX

### Dashboard do Profissional

```
┌─────────────────────────────────────┐
│ 👷 Olá, João Silva                  │
│ ⭐ 4.8 (42 avaliações)              │
├─────────────────────────────────────┤
│ 📊 Métricas do Mês                  │
│ ┌──────┬──────┬──────┬──────┐      │
│ │ 12   │ R$   │ 4.8  │ #3   │      │
│ │Serv. │3.2k  │⭐    │Rank  │      │
│ └──────┴──────┴──────┴──────┘      │
├─────────────────────────────────────┤
│ 🔔 Novos Chamados Disponíveis (8)   │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔧 Troca de Torneira            │ │
│ │ 📍 2.3 km • Pinheiros           │ │
│ │ 💰 Orçamento: Até R$ 150        │ │
│ │ ⏰ Urgente • Hoje               │ │
│ │ [Enviar Orçamento]              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ⚡ Instalação de Ventilador     │ │
│ │ 📍 5.1 km • Vila Madalena       │ │
│ │ 💰 Orçamento: Até R$ 200        │ │
│ │ 📅 Amanhã                       │ │
│ │ [Enviar Orçamento]              │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🚀 Implementação Passo a Passo

### Fase 1: Backend Orçamentos (2h)

```bash
# 1. Criar módulo de orçamentos
nest g module orcamento
nest g service orcamento/services/orcamento
nest g controller orcamento/controllers/orcamento

# 2. Entity Orcamento
# 3. DTOs
# 4. Endpoints:
#    POST /api/orcamentos
#    GET /api/orcamentos/chamado/:chamadoId
#    GET /api/orcamentos/profissional/:profissionalId
#    PATCH /api/orcamentos/:id/status
```

### Fase 2: Frontend Dashboard (4h)

```bash
# 1. Criar página DashboardProfissional.tsx
# 2. Service orcamentoService.ts
# 3. Componente ChamadoCard
# 4. Componente OrcamentoForm
# 5. Integrar com API
# 6. Adicionar rota /profissional
```

### Fase 3: Listagem e Filtros (2h)

```bash
# 1. ChamadosDisponiveis.tsx
# 2. Filtros: distância, especialidade, prioridade
# 3. Paginação
# 4. Loading states
```

### Fase 4: Agenda e Histórico (3h)

```bash
# 1. MinhaAgenda.tsx
# 2. Integrar com SlotService
# 3. HistoricoServicos.tsx
# 4. Estatísticas e métricas
```

---

## 📝 Estimativa Total

**Tempo**: 11-15 horas  
**Complexidade**: Média  
**Prioridade**: Alta (essencial para MVP completo)

---

## ✅ Para Testar Agora (Workaround)

Enquanto não tem dashboard, você pode testar via:

1. **API direta** (Postman/Insomnia):
   - GET http://31.97.64.250/api/profissionais
   - POST http://31.97.64.250/api/profissionais

2. **Criar usuário profissional no banco**:
   ```sql
   UPDATE users SET role = 'PROFISSIONAL' WHERE email = 'seu@email.com';
   ```

3. **Simular fluxo**:
   - Cliente cria chamado
   - Backend triagem recomenda profissionais
   - (MANUAL) Admin cria orçamento
   - Cliente aprova
   - Sistema agenda

---

## 🎯 Resumo

**Situação atual**: Backend completo, frontend NÃO implementado  
**Como acessar**: Não há interface de profissional ainda  
**O que fazer**: Implementar módulo de orçamentos + dashboard profissional  
**Prazo estimado**: 2-3 dias de desenvolvimento  

Quer que eu implemente o **dashboard do profissional** agora? Posso começar pela listagem de chamados disponíveis e envio de orçamentos. 🚀
