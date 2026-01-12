# 👥 De Onde Vêm os Profissionais?

## 📊 Cadastro no Banco de Dados

Os profissionais são **cadastrados no banco de dados PostgreSQL** através de 3 formas:

### 1️⃣ **Cadastro Manual via API** (Atual)

Profissionais são adicionados fazendo requisição POST para:

```bash
POST http://31.97.64.250/api/profissionais
Content-Type: application/json
Authorization: Bearer {seu_token_jwt}

{
  "nome": "João Silva - Encanador",
  "email": "joao@email.com",
  "telefone": "(11) 98765-4321",
  "descricao": "Especialista em vazamentos e reparos",
  "contextos": "RESIDENCIAL",
  "categorias": "ENCANADOR",
  "status": "ATIVO"
}
```

### 2️⃣ **Inserção Direta no Banco** (Temporário)

Para testes, inserimos dados SQL direto:

```sql
INSERT INTO profissionais (
  nome, email, telefone, descricao, 
  contextos, categorias, status, 
  score, "totalServiços", "serviçosConcluídos"
)
VALUES (
  'Carlos - Eletricista',
  'carlos@email.com',
  '(11) 96543-2109',
  'Instalações elétricas em geral',
  'RESIDENCIAL',
  'ELETRICISTA',
  'ATIVO',
  4.9,
  320,
  310
);
```

### 3️⃣ **Portal de Cadastro** (Futuro - P2.5 do roadmap)

Haverá uma tela onde profissionais se auto-cadastram:

```
📝 Cadastro de Profissional

Nome: [____________]
Email: [____________]
Telefone: [____________]
Área de Atuação: [Residencial ▼]
Profissão: [Encanador ▼]
Descrição: [____________]
Regiões de Atendimento: [____________]

[Enviar Documentos] [Cadastrar]
```

---

## 📦 Profissionais Atualmente no Sistema

Acabamos de inserir **15 profissionais** de exemplo:

### 🏠 RESIDENCIAL (7 profissionais)

**Encanadores (2):**
- João Silva ⭐ 4.8 - 245 atendimentos
- Pedro Santos ⭐ 4.5 - 180 atendimentos

**Eletricistas (3):**
- Carlos Almeida ⭐ 4.9 - 320 atendimentos  
- José Roberto ⭐ 4.7 - 210 atendimentos
- Ana Paula ⭐ 4.6 - 155 atendimentos

**Pedreiros (2):**
- Marcos Pereira ⭐ 4.7 - 190 atendimentos
- Roberto Costa ⭐ 4.8 - 210 atendimentos

### 🏥 SAÚDE (4 profissionais)

**Médicos (2):**
- Dra. Maria Oliveira ⭐ 4.9 - 450 atendimentos
- Dr. Paulo Mendes ⭐ 4.7 - 380 atendimentos

**Dentistas (2):**
- Dr. Fernando Lima ⭐ 4.8 - 520 atendimentos
- Dra. Juliana Rocha ⭐ 4.6 - 290 atendimentos

### 🚗 AUTOMOTIVO (2 profissionais)

**Mecânicos:**
- Antônio Souza ⭐ 4.7 - 340 atendimentos
- Ricardo Barbosa ⭐ 4.5 - 280 atendimentos

### ⚖️ JURÍDICO (2 profissionais)

**Advogados:**
- Dra. Beatriz Martins ⭐ 4.8 - 180 atendimentos
- Dr. Gabriel Santos ⭐ 4.6 - 145 atendimentos

---

## 🔄 Fluxo Completo: Do Cadastro à Recomendação

```
1. CADASTRO
   ↓
   Profissional se cadastra (ou é cadastrado)
   ↓
   Dados salvos na tabela "profissionais"
   
2. VALIDAÇÃO  
   ↓
   Admin aprova (muda status para ATIVO)
   ↓
   Profissional fica visível no sistema

3. DISPONIBILIDADE
   ↓
   Profissional define horários disponíveis
   ↓
   Slots salvos na tabela "slots"

4. BUSCA
   ↓
   Usuário cria chamado
   ↓
   Sistema busca: WHERE contexto = X AND categoria = Y
   ↓
   Retorna profissionais ATIVOS ordenados por score

5. RECOMENDAÇÃO
   ↓
   Top 3 profissionais mostrados ao usuário
   ↓
   Usuário escolhe e agenda
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `profissionais`

| Campo | Tipo | Exemplo |
|-------|------|---------|
| `id` | UUID | `550e8400-e29b-41d4-a716-...` |
| `nome` | String | `João Silva - Encanador` |
| `email` | String | `joao@email.com` |
| `telefone` | String | `(11) 98765-4321` |
| `contextos` | String | `RESIDENCIAL` |
| `categorias` | String | `ENCANADOR` |
| `status` | String | `ATIVO` / `INATIVO` / `PENDENTE` |
| `score` | Decimal | `4.8` (média de avaliações) |
| `totalServiços` | Integer | `245` |
| `serviçosConcluídos` | Integer | `230` |
| `taxaSatisfação` | Decimal | `4.8` |

### Consulta que o Sistema Faz:

```sql
-- Quando você descreve "vazamento na pia"
SELECT * FROM profissionais
WHERE contextos = 'RESIDENCIAL'
  AND categorias = 'ENCANADOR'
  AND status = 'ATIVO'
ORDER BY score DESC, "totalServiços" DESC
LIMIT 3;

-- Resultado:
-- 1. João Silva (4.8, 245 atendimentos)
-- 2. Pedro Santos (4.5, 180 atendimentos)
```

---

## 🔮 Futuras Fontes de Profissionais

### **P2.5 - Portal de Cadastro Público** (próximo passo)

- Profissionais se cadastram sozinhos
- Upload de documentos (RG, CPF, certificados)
- Verificação automática por email
- Aprovação manual por admin

### **P3.1 - Integração com Plataformas**

- Importar de GetNinjas, 99jobs, WorkAna
- API de sincronização automática
- Evita duplicação de cadastros

### **P4.2 - Geolocalização**

- Profissionais informam CEP/endereço
- Sistema calcula distância do usuário
- Recomenda os mais próximos

---

## 📊 Estatísticas Atuais

```
Total de Profissionais: 15
├─ Residencial: 7 (47%)
├─ Saúde: 4 (27%)
├─ Automotivo: 2 (13%)
└─ Jurídico: 2 (13%)

Status:
├─ ATIVO: 15 (100%)
├─ INATIVO: 0
└─ PENDENTE: 0

Média Geral de Avaliação: 4.7 ⭐
```

---

## 🧪 Como Testar Agora

### 1. Criar um chamado de encanamento:

```
Acesse: http://31.97.64.250
Login: admin@example.com / 123456

Criar Chamado:
"Está vazando água embaixo da pia"
```

### 2. Sistema vai recomendar:

```
✅ João Silva - Encanador ⭐ 4.8
   245 atendimentos concluídos
   
✅ Pedro Santos - Hidráulico ⭐ 4.5  
   180 atendimentos concluídos
```

### 3. Criar chamado de eletricista:

```
"Chuveiro queimou, disjuntor desarmando"
```

### Sistema recomenda:

```
✅ Carlos Almeida ⭐ 4.9
   320 atendimentos concluídos
   
✅ José Roberto ⭐ 4.7
   210 atendimentos concluídos
   
✅ Ana Paula ⭐ 4.6
   155 atendimentos concluídos
```

---

## 💡 Resumo Simples

**De onde vêm?**
→ Banco de dados PostgreSQL (tabela `profissionais`)

**Como chegam lá?**
→ Cadastro manual via API ou SQL (por enquanto)
→ Em breve: portal de auto-cadastro

**Quantos tem?**
→ 15 profissionais de exemplo cadastrados

**Como são escolhidos?**
→ Sistema busca por contexto + categoria
→ Ordena por avaliação (score)
→ Mostra top 3 para você escolher

🎯 **Pense assim:** É como o Uber tem motoristas cadastrados, o VITAS tem profissionais cadastrados!
