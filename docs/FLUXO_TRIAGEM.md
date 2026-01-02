# Fluxo de Triagem Automática/Assistida - Issue #10

## Visão Geral

Sistema de triagem inteligente que automaticamente roteia chamados (Casos) para profissionais mais qualificados baseado em:
- **Especialidade requerida**
- **Prioridade do chamado**
- **Rating do profissional**
- **Carga de trabalho atual**
- **Disponibilidade para atendimentos urgentes**

## Componentes

### 1. TriagemService (Backend)
**Arquivo**: `backend/src/chamado/services/triagem.service.ts`

#### Métodos Principais:

```typescript
triageAutomatica(chamadoId, criterios, profissionaisDisponiveis)
```
- Executa triagem automática completa
- Calcula score para cada profissional (0-100)
- Atualiza status do chamado para `TRIADO`
- Retorna top 5 profissionais + recomendação principal
- **Automatiza se score ≥ 75%**

```typescript
triageAssistida(criterios, profissionaisDisponiveis)
```
- Retorna recomendações SEM atualizar status
- Útil para validação manual antes de atualizar

```typescript
retriage(chamadoId, criterios)
```
- Re-executa triagem para reassignação

### 2. TriagemController (Backend)
**Arquivo**: `backend/src/chamado/controllers/triagem.controller.ts`

#### Endpoints:

**POST** `/chamados/{chamadoId}/triagem`
- Executa triagem automática
- Body: `CriteriosTriagemDto`
- Response: `ResultadoTriagemDto`

**POST** `/chamados/triagem/simular`
- Simula triagem com dados demo
- Útil para testes
- Body: `CriteriosTriagemDto`
- Response: `ResultadoTriagemDto`

### 3. DTOs (Data Transfer Objects)
**Arquivo**: `backend/src/chamado/dtos/triagem.dto.ts`

#### CriteriosTriagemDto
```typescript
{
  chamadoId: string;
  especialidadeRequerida: enum (REFORMA, LIMPEZA, JARDIM, ...);
  prioridade: enum (BAIXA, NORMAL, ALTA, URGENTE);
  valorMaximoHora?: number;
  ratingMinimoRequired?: number;
  preferirAvaliados?: boolean;
  localizacao?: string;
}
```

#### ResultadoTriagemDto
```typescript
{
  chamadoId: string;
  triageType: "AUTOMATICA" | "ASSISTIDA";
  timestamp: Date;
  profissionaisOrdenados: ProfissionalScoreDto[];
  profissionalRecomendado: ProfissionalScoreDto;
  podeSerAutomatizado: boolean;
  justificativa: string;
}
```

## Algoritmo de Scoring

Score total = 0-100 pontos

### Fatores Considerados:

| Fator | Pontos | Descrição |
|-------|--------|-----------|
| **Especialidade** | 40 | Match exato = 40 pts; Relacionado = 10 pts |
| **Rating** | 30 | Normalizado de 0-5 → 0-30 |
| **Carga de Trabalho** | 20 | Menos chamados em andamento = mais pontos |
| **Urgentes** | 10 | +10 se aceita urgentes e chamado é URGENTE |
| **Valor Hora** | ±5 | +5 se ≤ máximo; -10 se > máximo |
| **Rating Mínimo** | ±15 | -15 se abaixo do mínimo requerido |

### Exemplo de Cálculo

```
Reforma, Prioridade ALTA
Profissional: João Silva (Rating 4.8, 1 chamado em andamento)

Especialidade: 40 (match exato)
Rating: (4.8/5)*30 = 28.8
Carga: (1-1/5)*20 = 16
Urgentes: 5 (não é urgente)
Valor: +5 (aceita)
Rating Mín: 0 (ok)

Score Total = 40 + 28.8 + 16 + 5 + 5 = 94.8%
→ Pode ser automatizado ✓
```

## Fluxo de Integração

### Ao Criar Novo Chamado (NovoChamado)

1. **Frontend** submete FormNovoChamado com:
   - titulo
   - descricao
   - prioridade
   - contexto/opcao
   - anexos

2. **Backend** (ChamadoService.criarChamado):
   - Cria registro em Chamado
   - Extrai especialidade do contexto/opcao
   - Chama TriagemService.triageAutomatica()

3. **TriagemService**:
   - Consulta Profissional repository
   - Filtra por especialidade
   - Calcula scores
   - Atualiza status para TRIADO
   - Retorna recomendação

4. **ChamadoService**:
   - Salva profissionalRecomendado_id no Chamado (se score ≥ 75%)
   - Envia notificação ao profissional
   - Retorna resultado ao cliente

### Triagem Manual (Reassignação)

1. **Admin/Operador** acessa chamado em status TRIADO
2. Vê recomendação automática + top 5 alternativas
3. Pode aceitar ou escolher outro profissional
4. Chama TriagemService.retriage() para recalcular

## Estados do Chamado

```
Novo → [Triagem Automática] → Triado → Atribuído → Em Execução → Fechado
                    ↓
             [Se score < 75%]
                    ↓
             Aguardando Atribuição Manual
```

## Exemplo de Resposta

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
    "score": 94.8,
    "matchPercentual": 94.8
  },
  "profissionaisOrdenados": [
    {"id": "prof-001", "score": 94.8, ...},
    {"id": "prof-003", "score": 82.5, ...},
    {"id": "prof-002", "score": 78.3", ...}
  ],
  "justificativa": "Profissional: João Silva | Rating: 4.8/5.0 | Especialidade: REFORMA | Carga atual: 1 chamado(s) | ✓ Pode ser automatizado (score > 75%)"
}
```

## Próximos Passos (Issue #11)

- **Frontend**: Componente para exibir resultado de triagem
- **Frontend**: UI para aceitar/rejeitar recomendação
- **Backend**: Integração com ChamadoService para atualizar profissional atribuído
- **Backend**: Endpoint para reassignação com novos critérios
