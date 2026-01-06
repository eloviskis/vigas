# 🔍 Como o VITAS Encontra Profissionais

## Fluxo Completo da Triagem Inteligente

### 1️⃣ **Você Cria um Chamado**

```
Exemplo:
"Está vazando água embaixo da pia da cozinha, 
preciso urgente de alguém para consertar"
```

### 2️⃣ **Sistema Analisa o Texto (Triagem Automática)**

O sistema faz análise semântica da descrição para identificar:

#### 🎯 **Contexto** (tipo de problema)
- **Residencial**: vazamento, encanamento, elétrica, pintura
- **Saúde**: dor, consulta, exame, tratamento  
- **Jurídico**: processo, contrato, advogado
- **Automotivo**: carro, motor, freio, bateria
- **Beleza**: cabelo, unha, pele, estética

No exemplo acima:
- Palavras-chave: `"vazando água"`, `"pia"`, `"consertar"`
- **Contexto detectado**: `RESIDENCIAL`
- **Categoria**: `ENCANADOR` (hidráulico)

#### ⚡ **Urgência**
- Palavras como: `urgente`, `emergência`, `agora`, `socorro`
- Aumenta prioridade na busca

### 3️⃣ **Busca Profissionais Compatíveis**

```typescript
// O sistema executa:
profissionais = buscar onde:
  - contexto = "RESIDENCIAL" 
  - categoria = "ENCANADOR"
  - ativo = true
  - disponível = true
```

**Exemplo de resultado:**
```json
[
  {
    "id": "prof-123",
    "nome": "João Silva - Encanador",
    "categoria": "ENCANADOR",
    "score": 4.8,
    "atendimentos": 245,
    "disponibilidade": "hoje às 14h"
  },
  {
    "id": "prof-456", 
    "nome": "Pedro Santos - Hidráulico",
    "categoria": "ENCANADOR",
    "score": 4.5,
    "atendimentos": 180,
    "disponibilidade": "amanhã às 9h"
  }
]
```

### 4️⃣ **Ordena por Critérios de Qualidade**

O sistema ranqueia profissionais usando:

```
Score Final = (
  Avaliação Média × 0.4 +
  Número de Atendimentos × 0.3 +
  Disponibilidade Imediata × 0.2 +
  Distância × 0.1
)
```

**No exemplo:**
1. João Silva (score 4.8, 245 atendimentos, disponível HOJE) → **Score: 92**
2. Pedro Santos (score 4.5, 180 atendimentos, disponível amanhã) → **Score: 85**

### 5️⃣ **Retorna Recomendações**

```json
{
  "resultado": "MULTIPLAS_OPCOES",
  "profissionalRecomendado": {
    "id": "prof-123",
    "nome": "João Silva",
    "score": 4.8
  },
  "opcoes": [
    { "id": "prof-123", "nome": "João Silva", "score": 92 },
    { "id": "prof-456", "nome": "Pedro Santos", "score": 85 }
  ],
  "confianca": 90,
  "justificativa": "Profissionais especializados em encanamento disponíveis"
}
```

### 6️⃣ **Você Escolhe e Agenda**

Na tela você vê:

```
✅ João Silva - Encanador ⭐ 4.8
   245 atendimentos | Disponível HOJE às 14h
   [Ver Horários] [Agendar]

✅ Pedro Santos - Hidráulico ⭐ 4.5  
   180 atendimentos | Disponível AMANHÃ às 9h
   [Ver Horários] [Agendar]
```

---

## 🧠 Lógica de Análise do Texto

### Palavras-Chave por Contexto:

**RESIDENCIAL:**
- Encanador: vazamento, pia, torneira, cano, água, esgoto
- Eletricista: tomada, luz, chuveiro, disjuntor, curto
- Pedreiro: parede, reboco, tijolo, construção
- Pintor: pintura, tinta, parede

**SAÚDE:**
- Médico: dor, febre, tosse, consulta, exame
- Dentista: dente, canal, cárie, dor de dente
- Fisioterapeuta: coluna, lesão, reabilitação

**JURÍDICO:**
- Advogado: processo, ação, contrato, direito
- Despachante: CNH, documento, DETRAN

**AUTOMOTIVO:**
- Mecânico: motor, freio, óleo, revisão, carro
- Funileiro: amassado, batida, lataria

### Níveis de Urgência:

| Palavras | Prioridade | Tempo Resposta |
|----------|-----------|----------------|
| `emergência`, `socorro`, `agora` | CRÍTICA | < 1 hora |
| `urgente`, `preciso hoje` | ALTA | < 4 horas |
| `rápido`, `logo` | MÉDIA | < 24 horas |
| nenhuma palavra urgente | NORMAL | 48 horas |

---

## 📊 Exemplo Real Passo-a-Passo

### Entrada do Usuário:
```
"Minha energia caiu, disjuntor desarmando toda hora. 
Preciso de eletricista urgente!"
```

### Processamento:

1. **Análise de Contexto:**
   - ✅ Palavras encontradas: `energia`, `disjuntor`
   - 🎯 **Contexto**: RESIDENCIAL
   - 🔧 **Categoria**: ELETRICISTA

2. **Análise de Urgência:**
   - ⚡ Palavra `urgente` detectada
   - 📈 **Prioridade**: ALTA

3. **Busca no Banco:**
   ```sql
   SELECT * FROM profissionais 
   WHERE contexto = 'RESIDENCIAL' 
   AND categoria = 'ELETRICISTA'
   AND ativo = true
   ORDER BY score DESC, atendimentos DESC
   ```

4. **Resultado:**
   - 5 eletricistas encontrados
   - 3 melhores recomendados
   - 1 com disponibilidade imediata

5. **Resposta ao Usuário:**
   ```
   ✅ Encontramos 3 eletricistas qualificados!
   
   🥇 Carlos Almeida ⭐ 4.9
      Disponível HOJE às 15h
      
   🥈 José Roberto ⭐ 4.7
      Disponível HOJE às 18h
      
   🥉 Ana Paula ⭐ 4.6
      Disponível AMANHÃ às 9h
   ```

---

## 🔮 Melhorias Futuras (IA Real)

Atualmente o sistema usa **análise de palavras-chave**.

### Próximas versões terão:

1. **Machine Learning:**
   - Treinar modelo com histórico de chamados
   - Aprender padrões de descrição → categoria

2. **NLP (Processamento de Linguagem Natural):**
   - Entender contexto completo da frase
   - Detectar sinônimos e variações

3. **Geolocalização:**
   - Recomendar profissionais mais próximos
   - Considerar raio de atendimento

4. **Histórico do Usuário:**
   - Lembrar preferências anteriores
   - Recomendar profissionais já usados

5. **Disponibilidade em Tempo Real:**
   - Verificar agenda do profissional
   - Mostrar apenas horários realmente livres

---

## 💡 Resumo Simplificado

```
Você descreve o problema
        ↓
Sistema lê e identifica:
  - Tipo de problema (residencial, saúde, etc)
  - Profissão necessária (encanador, médico, etc)  
  - Urgência (normal, urgente, emergência)
        ↓
Busca profissionais que atendem esse tipo
        ↓
Ordena por avaliação e disponibilidade
        ↓
Mostra os 3 melhores para você escolher
        ↓
Você agenda com o que preferir
```

**É como ter um assistente inteligente que entende seu problema e te conecta com quem pode resolver!** 🚀
