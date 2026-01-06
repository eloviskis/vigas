# 📍 Busca por Localização - VITAS

## Como Funciona

O sistema VITAS agora busca profissionais considerando **proximidade geográfica**, conectando você aos melhores profissionais **mais perto de você**.

---

## 🎯 Algoritmo de Busca

### 1. **Cadastro do Profissional**

Ao se cadastrar, o profissional informa:
- ✅ **CEP** (obrigatório)
- ✅ **Cidade** (obrigatório)
- ✅ **Estado** (obrigatório)

Exemplo:
```
CEP: 01310-100
Cidade: São Paulo
Estado: SP
```

### 2. **Criação do Chamado**

Quando você cria um chamado, o sistema:
1. **Captura sua localização** (com sua permissão) através do navegador
2. **Extrai latitude e longitude** do seu dispositivo
3. **Usa sua localização** para buscar profissionais próximos

### 3. **Cálculo de Distância**

O sistema calcula a distância usando a **Fórmula de Haversine**:

```javascript
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * π / 180;
  const dLon = (lon2 - lon1) * π / 180;
  
  const a = sin²(dLat/2) + cos(lat1) * cos(lat2) * sin²(dLon/2);
  const c = 2 * atan2(√a, √(1-a));
  
  return R * c; // Distância em km
}
```

### 4. **Ordenação dos Resultados**

Os profissionais são ordenados por:

**PRIORIDADE 1**: Distância (mais próximo primeiro)
- 0-5 km: Alta prioridade
- 5-15 km: Média prioridade
- 15-30 km: Baixa prioridade
- 30+ km: Muito distante

**PRIORIDADE 2**: Avaliação (score)
- Profissionais com mesma distância são ordenados por score

---

## 🔍 Exemplo de Busca

### Cenário:
Você está em **São Paulo (Avenida Paulista)** e precisa de um **encanador**.

**Sua localização:**
- Latitude: -23.5558
- Longitude: -46.6596

### Profissionais encontrados:

| Nome | Categoria | Score | Distância | Ordem |
|------|-----------|-------|-----------|-------|
| João Silva | Encanador | 4.8 ★ | **2.3 km** | 🥇 1º |
| Pedro Santos | Encanador | 4.9 ★ | 5.1 km | 🥈 2º |
| Carlos Almeida | Encanador | 4.5 ★ | 8.7 km | 🥉 3º |
| Roberto Costa | Encanador | 5.0 ★ | 25.4 km | 4º |

**Resultado:**
- **João Silva** aparece em 1º lugar mesmo tendo score menor que Pedro Santos, pois está **3 km mais próximo**
- **Roberto Costa** tem o melhor score (5.0), mas está muito distante (25 km)

---

## 🌐 Permissões de Localização

### No Navegador (PWA Web)
Ao criar um chamado, você verá:
```
┌─────────────────────────────────────────┐
│ 📍 VITAS quer acessar sua localização   │
│                                         │
│ [Permitir]    [Bloquear]                │
└─────────────────────────────────────────┘
```

### No App Android (PWA Instalado)
O app solicita permissão de localização no primeiro uso:
```
Permitir que VITAS acesse a localização
deste dispositivo?

[Somente quando estiver usando o app]
[Perguntar sempre]
[Não permitir]
```

---

## 🔐 Privacidade e Segurança

### O que armazenamos:

**Profissionais:**
- ✅ CEP, Cidade, Estado
- ✅ Latitude e Longitude (calculadas a partir do CEP)
- ❌ **NÃO** armazenamos endereço completo

**Clientes:**
- ✅ Localização temporária (somente durante a busca)
- ❌ **NÃO** armazenamos sua localização no banco de dados
- ❌ **NÃO** compartilhamos sua localização com profissionais

### Dados enviados na busca:

```http
GET /api/profissionais?contexto=RESIDENCIAL&lat=-23.5558&lon=-46.6596
```

**Apenas latitude e longitude** são enviadas temporariamente para calcular distância.

---

## 📊 API de Busca

### Endpoint: `GET /profissionais`

**Parâmetros:**
- `contexto` (opcional): RESIDENCIAL, SAUDE, JURIDICO, AUTOMOTIVO, etc.
- `lat` (opcional): Latitude do usuário
- `lon` (opcional): Longitude do usuário

**Exemplo de requisição:**
```bash
curl "http://31.97.64.250/api/profissionais?contexto=RESIDENCIAL&lat=-23.5558&lon=-46.6596"
```

**Resposta:**
```json
[
  {
    "id": "uuid-1234",
    "nome": "João Silva - Encanador",
    "score": 4.8,
    "totalServiços": 245,
    "distancia": 2.3,
    "cidade": "São Paulo",
    "estado": "SP"
  },
  {
    "id": "uuid-5678",
    "nome": "Pedro Santos - Hidráulico",
    "score": 4.9,
    "totalServiços": 180,
    "distancia": 5.1,
    "cidade": "São Paulo",
    "estado": "SP"
  }
]
```

---

## ❓ Perguntas Frequentes

### 1. **E se eu não permitir acesso à localização?**
O sistema ainda funciona! Os profissionais serão ordenados apenas por **score** (avaliação), sem considerar distância.

### 2. **Os profissionais veem minha localização exata?**
**NÃO.** Os profissionais veem apenas sua **cidade** e **estado**, nunca sua localização GPS exata.

### 3. **Como o sistema obtém latitude/longitude do profissional?**
Através de uma **API de Geocodificação** que converte CEP em coordenadas. Implementaremos isso em breve usando:
- **ViaCEP** (dados de CEP)
- **Google Maps Geocoding API** (conversão para lat/long)

### 4. **Posso buscar profissionais em outra cidade?**
Sim! Você pode desativar a localização e buscar manualmente por cidade/estado no filtro.

### 5. **A distância considera trânsito?**
Não. É calculada a distância **em linha reta** (distância euclidiana na superfície da Terra). Em versões futuras, integraremos APIs de roteamento para considerar tempo de deslocamento real.

---

## 🚀 Próximas Melhorias

- [ ] **Geocodificação automática** de CEP → lat/long para profissionais
- [ ] **Raio de busca personalizável** (ex: "profissionais até 10 km")
- [ ] **Tempo de deslocamento** via Google Maps Directions API
- [ ] **Filtro por bairro** para buscas mais granulares
- [ ] **Mapa interativo** mostrando profissionais próximos

---

## 📝 Resumo

✅ **Profissionais cadastram CEP + Cidade + Estado**  
✅ **Sistema solicita sua localização ao criar chamado**  
✅ **Cálculo de distância usando Fórmula de Haversine**  
✅ **Resultados ordenados por proximidade + score**  
✅ **Sua localização NÃO é armazenada permanentemente**  
✅ **Privacidade garantida - profissionais não veem seu GPS**

**Resultado:** Você encontra o melhor profissional **mais perto de você**! 🎯
