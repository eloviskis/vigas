# Sistema de Agendamento e Slots - Issue #12

## Visão Geral

Sistema completo de agendamento de serviços com gestão automática de slots de disponibilidade, calendário interativo e validações de conflito.

## Arquitetura

### Backend (NestJS + TypeORM)

#### 1. Agendamento Entity
**Arquivo**: `backend/src/agendamento/entities/agendamento.entity.ts`

```typescript
@Entity('agendamentos')
class Agendamento {
  id: string;
  chamadoId: string;
  profissionalId: string;
  dataHoraInicio: Date;
  dataHoraFim: Date;
  duracaoEstimadaMinutos: number;
  status: AgendamentoStatus;
  observacoes: string;
  motivoCancelamento: string;
  confirmadoEm: Date;
  iniciadoEm: Date;
  finalizadoEm: Date;
  notificacaoEnviada: boolean;
  lembrete24h: boolean;
  lembrete1h: boolean;
}
```

**Status Lifecycle**:
```
PENDENTE → CONFIRMADO → EM_ANDAMENTO → CONCLUIDO
    ↓           ↓
CANCELADO   REAGENDADO
```

#### 2. SlotsService
**Arquivo**: `backend/src/agendamento/services/slots.service.ts`

**Métodos Principais**:

`getSlotsDisponiveis(profissionalId, dataInicio, dataFim, duracao)`
- Gera todos os slots possíveis no período
- Busca agendamentos existentes
- Marca slots indisponíveis (conflitos)
- Verifica antecedência mínima (24h)
- Retorna array de SlotDisponivel

`criarAgendamento(dados)`
- Valida se slot está disponível
- Verifica conflitos
- Cria registro com status PENDENTE
- Retorna Agendamento criado

`confirmarAgendamento(agendamentoId)`
- Atualiza status → CONFIRMADO
- Registra timestamp confirmadoEm
- Dispara notificação

`cancelarAgendamento(agendamentoId, motivo)`
- Atualiza status → CANCELADO
- Salva motivoCancelamento
- Libera slot

`reagendarAgendamento(agendamentoId, novaDataInicio, novaDataFim)`
- Marca antigo como REAGENDADO
- Cria novo agendamento
- Preserva histórico

**Algoritmo de Geração de Slots**:
```typescript
1. Iterar por cada dia no período (dataInicio → dataFim)
2. Verificar se dia está em diasSemanaDisponiveis
3. Para cada dia disponível:
   - Iniciar no horarioInicio (ex: 08:00)
   - Gerar slots até horarioFim (ex: 18:00)
   - Intervalo = intervaloMinutos (ex: 60)
4. Para cada slot gerado:
   - Buscar agendamentos existentes no mesmo período
   - Verificar conflito (sobreposição de horários)
   - Verificar antecedência mínima
   - Marcar disponivel = true/false
```

**Verificação de Conflito**:
```typescript
function verificarConflito(inicio1, fim1, inicio2, fim2) {
  return inicio1 < fim2 && inicio2 < fim1;
}

// Exemplo:
// Slot1: 10:00-11:00
// Agendamento: 10:30-11:30
// inicio1(10:00) < fim2(11:30) && inicio2(10:30) < fim1(11:00)
// true → CONFLITO!
```

#### 3. AgendamentoController
**Arquivo**: `backend/src/agendamento/controllers/agendamento.controller.ts`

**Endpoints**:

`GET /agendamentos/slots`
- Query params: profissionalId, dataInicio, dataFim, duracao
- Response: SlotDisponivel[]

`POST /agendamentos`
- Body: CriarAgendamentoDto
- Response: Agendamento

`PATCH /agendamentos/:id/confirmar`
- Response: Agendamento (status CONFIRMADO)

`PATCH /agendamentos/:id/cancelar`
- Body: { motivo: string }
- Response: Agendamento (status CANCELADO)

`PATCH /agendamentos/:id/reagendar`
- Body: { novaDataInicio, novaDataFim }
- Response: Agendamento (novo registro)

### Frontend (React + TypeScript)

#### 1. SlotSelector Component
**Arquivo**: `frontend/src/components/SlotSelector.tsx`

**Features**:
- Calendário horizontal (próximos 7 dias)
- Grid de horários (8h-18h, intervalos de 1h)
- Estados visuais por disponibilidade
- Seleção por clique
- Resumo da seleção

**Props**:
```typescript
interface SlotSelectorProps {
  profissionalId: string;
  duracaoServico: number;
  onSelectSlot: (slot: Slot) => void;
}
```

**Estados de Slot**:
- ✅ **Disponível**: Branco, border cinza, hover azul
- 🟢 **Selecionado**: Verde com ícone de check
- ⚫ **Indisponível**: Cinza com texto "Ocupado"
- 🔵 **Hoje**: Azul claro (dia atual)

#### 2. AgendarServico Page
**Arquivo**: `frontend/src/pages/AgendarServico.tsx`

**Seções**:
1. Header com navegação (← Voltar)
2. Info do chamado
3. Info do profissional selecionado
4. SlotSelector (calendário + horários)
5. Campo de observações (opcional)
6. Botões de ação (Cancelar | Confirmar)

**Validações**:
- Botão desabilitado até selecionar slot
- Loading state durante agendamento
- Error handling com retry

#### 3. agendamentoService
**Arquivo**: `frontend/src/lib/agendamentoService.ts`

```typescript
getSlotsDisponiveis(profissionalId, dataInicio, dataFim, duracao)
criarAgendamento(dados: CriarAgendamentoRequest)
confirmarAgendamento(agendamentoId)
cancelarAgendamento(agendamentoId, motivo)
reagendarAgendamento(agendamentoId, novaDataInicio, novaDataFim)
```

## Configuração de Agenda

**ConfiguracaoAgenda**:
```typescript
{
  horarioInicio: "08:00",
  horarioFim: "18:00",
  intervaloMinutos: 60,           // 30, 60, 120
  diasSemanaDisponiveis: [1,2,3,4,5],  // 0=Dom, 6=Sab
  duracaoMinimaMinutos: 60,
  antecedenciaMinima: 24          // horas
}
```

**Customizações Futuras**:
- Horários flexíveis por dia da semana
- Pausas para almoço (12h-13h)
- Horários estendidos (manhã/tarde/noite)
- Blackout dates (feriados)

## Fluxo de Uso Completo

### 1. Usuario Agenda Serviço
```
TriagemChamado (Issue #11)
  → Usuario confirma seleção do profissional
  → Navegação: /chamados/{id}/agendar?profissionalId=X&profissionalNome=Y
  → AgendarServico page carrega
  → buscarChamado() - detalhes do chamado
```

### 2. Seleção de Data
```
Usuario visualiza calendário (7 dias)
  → Clica em um dia
  → setSelectedDate(dia)
  → carregarSlots() executado
  → getSlotsDisponiveis() API call
  → Renderiza grid de horários (8h-18h)
```

### 3. Seleção de Horário
```
Usuario clica em slot disponível
  → handleSelectSlot(slot)
  → setSelectedSlot(slot)
  → Card verde aparece com resumo
  → Botão "Confirmar" habilitado
```

### 4. Confirmação
```
Usuario clica "Confirmar Agendamento"
  → criarAgendamento() API call
  → Backend valida disponibilidade
  → Cria Agendamento (status PENDENTE)
  → Frontend redireciona /chamados/{id}/confirmado
  → Notificação enviada ao profissional
```

### 5. Profissional Confirma
```
Profissional recebe notificação
  → Acessa dashboard de agendamentos
  → Clica "Confirmar Presença"
  → PATCH /agendamentos/{id}/confirmar
  → Status → CONFIRMADO
  → Notificação enviada ao usuário
```

### 6. Lembretes Automáticos
```
Cronjob roda a cada hora
  → Busca agendamentos com dataHoraInicio - 24h
  → Se lembrete24h = false:
    - Envia notificação
    - Atualiza lembrete24h = true
  → Busca agendamentos com dataHoraInicio - 1h
  → Se lembrete1h = false:
    - Envia notificação
    - Atualiza lembrete1h = true
```

## Exemplo de Resposta API

**GET /agendamentos/slots**
```json
[
  {
    "inicio": "2026-01-03T08:00:00Z",
    "fim": "2026-01-03T09:00:00Z",
    "disponivel": true,
    "profissionalId": "prof-001"
  },
  {
    "inicio": "2026-01-03T09:00:00Z",
    "fim": "2026-01-03T10:00:00Z",
    "disponivel": false,
    "profissionalId": "prof-001"
  },
  {
    "inicio": "2026-01-03T10:00:00Z",
    "fim": "2026-01-03T11:00:00Z",
    "disponivel": true,
    "profissionalId": "prof-001"
  }
]
```

**POST /agendamentos**
```json
{
  "id": "agend-001",
  "chamadoId": "cham-001",
  "profissionalId": "prof-001",
  "dataHoraInicio": "2026-01-03T10:00:00Z",
  "dataHoraFim": "2026-01-03T12:00:00Z",
  "duracaoEstimadaMinutos": 120,
  "status": "PENDENTE",
  "observacoes": "Favor trazer escada",
  "notificacaoEnviada": false,
  "lembrete24h": false,
  "lembrete1h": false,
  "criadoEm": "2026-01-02T15:30:00Z"
}
```

## Casos de Uso Avançados

### Reagendamento
```
Usuario solicita reagendamento
  → Acessa agendamento existente
  → Clica "Reagendar"
  → Seleciona nova data/hora
  → reagendarAgendamento(id, novaDataInicio, novaDataFim)
  → Backend:
    1. Marca antigo como REAGENDADO
    2. Cria novo agendamento (status PENDENTE)
    3. Vincula ao mesmo chamado
    4. Notifica profissional
```

### Cancelamento
```
Usuario ou Profissional cancela
  → Clica "Cancelar Agendamento"
  → Informa motivo (obrigatório)
  → cancelarAgendamento(id, motivo)
  → Status → CANCELADO
  → Slot liberado para outros
  → Notificação enviada
```

### Múltiplos Agendamentos
```
Chamado grande (ex: reforma completa)
  → Requer múltiplas visitas
  → Usuario cria vários agendamentos
  → Cada um com dataHoraInicio diferente
  → Todos vinculados ao mesmo chamadoId
  → Timeline do chamado mostra sequência
```

## Responsividade

**Mobile (< 640px)**:
- Calendário: scroll horizontal
- Grid de horários: 2 colunas
- Botões full-width

**Tablet (640px - 1024px)**:
- Calendário: 7 dias visíveis
- Grid de horários: 3 colunas

**Desktop (> 1024px)**:
- Calendário: 7 dias com espaçamento
- Grid de horários: 4 colunas
- Max-width 4xl (56rem)

## Performance

- Slots gerados sob demanda (não pré-computados)
- Cache de 5 minutos para slots disponíveis
- Lazy loading de dias adicionais
- Debounce na seleção de data (300ms)

## Segurança

- Validação de conflitos server-side
- Verificação de ownership (usuario/profissional)
- Rate limiting (10 req/min por IP)
- Sanitização de observações (XSS)

## Próximos Passos (Issue #13)

- Histórico vivo de atendimento (timeline)
- Notificações push em tempo real
- Integração com Google Calendar
- Recorrência de agendamentos
