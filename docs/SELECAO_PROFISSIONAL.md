# Seleção e Recomendação de Profissional - Issue #11

## Visão Geral

Interface visual para seleção de profissional baseada nos resultados da triagem automática (Issue #10). Permite ao usuário visualizar as recomendações, comparar profissionais e confirmar a atribuição.

## Componentes

### 1. ProfissionalSelector Component
**Arquivo**: `frontend/src/components/ProfissionalSelector.tsx`

Interface hierárquica que exibe profissionais ordenados por score de compatibilidade.

#### Features:
- **Profissional Recomendado Destacado**: Card verde 2px border, maior destaque
- **Badge de Score**: 0-100% com cores por faixa:
  - 🟢 Verde (≥85%): Excelente compatibilidade
  - 🟢 Emerald (≥75%): Alta compatibilidade - **Pronto para automação**
  - 🟡 Amarelo (≥65%): Média compatibilidade
  - 🟠 Laranja (<65%): Baixa compatibilidade
- **Informações Exibidas**:
  - Nome e especialidade
  - Rating (0-5.0 estrelas)
  - Chamados em andamento (carga atual)
  - Valor por hora (R$)
  - Aceita urgentes (ícone)
- **Interação**:
  - Click em qualquer card para selecionar
  - Ícone de check aparece no selecionado
  - Botão "Confirmar Seleção" com loading state

#### Props Interface:
```typescript
interface ProfissionalSelectorProps {
  profissionaisCandidatos: Profissional[];        // Lista ordenada por score
  profissionalRecomendado: Profissional;          // Top 1
  podeSerAutomatizado: boolean;                   // Se score ≥ 75%
  onSelectProfissional: (prof) => void;           // Callback de confirmação
  isLoading?: boolean;                            // Loading state do botão
}
```

### 2. TriagemChamado Page
**Arquivo**: `frontend/src/pages/TriagemChamado.tsx`

Página completa para visualizar triagem e selecionar profissional.

#### Features:
- **Loading State**: Loader animado durante carregamento
- **Error Handling**: Card vermelho com mensagem de erro + botão voltar
- **Retry Mechanism**: Botão "Recalcular" para re-triagem
- **Info do Chamado**: Card com contexto e prioridade (cor por urgência)
- **Justificativa**: Card cinza com detalhamento da recomendação
- **Navegação**: Botão voltar + redirect pós-confirmação

#### Estados:
- `loading`: Carregamento inicial
- `confirmando`: Salvando seleção
- `retriaging`: Recalculando triagem
- `error`: Mensagem de erro

### 3. triagemService (Frontend)
**Arquivo**: `frontend/src/lib/triagemService.ts`

Service layer para comunicação com backend de triagem.

#### Métodos:

```typescript
executarTriagem(chamadoId, criterios): Promise<ResultadoTriagem>
```
- Executa triagem automática real
- Atualiza status do chamado para TRIADO
- Retorna top 5 profissionais + recomendação

```typescript
simularTriagem(criterios): Promise<ResultadoTriagem>
```
- Simula triagem com dados demo
- Útil para testes sem backend completo
- Não atualiza status

```typescript
retriage(chamadoId, criterios?): Promise<ResultadoTriagem>
```
- Re-executa triagem de um chamado
- Útil para reassignação ou mudança de critérios

```typescript
confirmarSelecao(chamadoId, profissionalId): Promise<void>
```
- PATCH `/chamados/{chamadoId}/profissional`
- Atualiza chamado com profissional selecionado
- Dispara notificação ao profissional

## Fluxo de Uso

### 1. Criar Novo Chamado (NovoChamado)
```
Usuario preenche FormNovoChamado
  → Submete com titulo, descricao, prioridade, anexos
  → Backend cria Chamado
  → Backend executa TriagemService.triageAutomatica()
  → Frontend redireciona para /chamados/{id}/triagem
```

### 2. Visualizar Triagem (TriagemChamado)
```
TriagemChamado.tsx carrega
  → buscarChamado(id) - detalhes do chamado
  → simularTriagem(criterios) - profissionais ordenados
  → Renderiza ProfissionalSelector
  → Usuário visualiza recomendação + alternativas
```

### 3. Selecionar Profissional
```
Usuario clica em card de profissional
  → handleSelect(profissional) - atualiza selectedId
  → Usuario clica "Confirmar Seleção"
  → confirmarSelecao(chamadoId, profissionalId)
  → PATCH /chamados/{id}/profissional
  → Redireciona para /chamados/{id} (detalhes)
```

### 4. Re-triagem (Reassignação)
```
Usuario clica "Recalcular"
  → retriage(chamadoId, criterios)
  → Backend recalcula scores
  → Frontend atualiza resultadoTriagem state
  → Renderiza nova lista ordenada
```

## Exemplo de UI

```
╔══════════════════════════════════════════════════════════╗
║ ← Voltar          Triagem de Profissional     🔄 Recalcular ║
╠══════════════════════════════════════════════════════════╣
║ Chamado: Reforma do banheiro                             ║
╠══════════════════════════════════════════════════════════╣
║ Contexto: Casa | Prioridade: ALTA                        ║
╠══════════════════════════════════════════════════════════╣
║ ✓ Resultado com alta compatibilidade - Automação OK     ║
╠══════════════════════════════════════════════════════════╣
║ ┌────────────────────────────────────────────────────┐   ║
║ │ João Silva ✓                              [94%] 🟢 │   ║
║ │ REFORMA                                             │   ║
║ │ ⭐ 4.8/5.0 | ⏰ 1 em andamento | 💰 R$ 75/h | 🔥 Urgentes│   ║
║ │ ✓ Compatibilidade excelente - Pronto para automação│   ║
║ └────────────────────────────────────────────────────┘   ║
║                                                          ║
║ ───────────────── Outras opções ─────────────────────   ║
║                                                          ║
║ ┌────────────────────────────────────────────────────┐   ║
║ │ Pedro Costa                               [83%] 🟢 │   ║
║ │ REFORMA                                             │   ║
║ │ ⭐ 4.3/5.0 | ⏰ 0 em andamento | 💰 R$ 65/h | 🔥      │   ║
║ └────────────────────────────────────────────────────┘   ║
║                                                          ║
║ ┌────────────────────────────────────────────────────┐   ║
║ │ Maria Santos                              [78%] 🟢 │   ║
║ │ REFORMA                                             │   ║
║ │ ⭐ 4.6/5.0 | ⏰ 2 em andamento | 💰 R$ 80/h |        │   ║
║ └────────────────────────────────────────────────────┘   ║
║                                                          ║
║ [          Confirmar Seleção          ]                  ║
╠══════════════════════════════════════════════════════════╣
║ Justificativa                                            ║
║ Profissional: João Silva | Rating: 4.8/5.0 |            ║
║ Especialidade: REFORMA | Carga atual: 1 chamado(s) |    ║
║ ✓ Pode ser automatizado (score > 75%)                   ║
╚══════════════════════════════════════════════════════════╝
```

## Exemplo de Response

```json
{
  "chamadoId": "cham-001",
  "triageType": "AUTOMATICA",
  "timestamp": "2024-01-15T10:30:00Z",
  "podeSerAutomatizado": true,
  "profissionalRecomendado": {
    "id": "prof-001",
    "nome": "João Silva",
    "especialidade": "REFORMA",
    "rating": 4.8,
    "chamadosEmAndamento": 1,
    "valorHora": 75,
    "aceitaUrgentes": true,
    "score": 94.2,
    "matchPercentual": 94.2
  },
  "profissionaisOrdenados": [
    {"id": "prof-001", "nome": "João Silva", "score": 94.2, ...},
    {"id": "prof-003", "nome": "Pedro Costa", "score": 82.5, ...},
    {"id": "prof-002", "nome": "Maria Santos", "score": 78.3, ...}
  ],
  "justificativa": "Profissional: João Silva | Rating: 4.8/5.0 | Especialidade: REFORMA | Carga atual: 1 chamado(s) | ✓ Pode ser automatizado (score > 75%)"
}
```

## Integração Backend

### Endpoint: PATCH /chamados/:chamadoId/profissional

**Request Body**:
```json
{
  "profissionalId": "prof-001"
}
```

**Ações Backend**:
1. Valida se profissional existe e está disponível
2. Atualiza `Chamado.profissionalId = profissionalId`
3. Atualiza `Chamado.status = ChamadoStatus.ATRIBUIDO`
4. Incrementa `Profissional.chamadosEmAndamento`
5. Envia notificação push ao profissional
6. Cria registro em histórico do chamado

**Response**: 200 OK
```json
{
  "success": true,
  "chamado": {...},
  "profissional": {...}
}
```

## Responsividade

- **Mobile (< 640px)**:
  - Cards ocupam largura total
  - Grid de info: 2 colunas
  - Botões full-width

- **Tablet (640px - 1024px)**:
  - Cards com padding aumentado
  - Grid de info: 3 colunas

- **Desktop (> 1024px)**:
  - Max-width 4xl (56rem)
  - Grid de info: 4 colunas
  - Cards com hover effects

## Próximos Passos (Issue #12)

- **Agendamento**: Seleção de data/hora para início do serviço
- **Slots de Agenda**: Visualização de disponibilidade do profissional
- **Confirmação Dupla**: Profissional deve aceitar antes de iniciar
- **SLA**: Exibição de prazo estimado de conclusão
