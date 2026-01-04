#!/bin/bash
# Test Feature 006 endpoints

BASE_URL="http://localhost:3000/api"

echo "=== TESTE FEATURE 006: TRIAGEM E PROFISSIONAIS ==="

# 1. Criar profissional
echo -e "\n1. Criando profissional..."
PROF=$(curl -s -X POST "$BASE_URL/profissionais" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Encanador",
    "email": "joao@example.com",
    "telefone": "11999999999",
    "descricao": "Encanador com 10 anos de experiência",
    "contextos": ["Casa"],
    "categorias": ["Encanamento"]
  }')

PROF_ID=$(echo $PROF | jq -r '.id' 2>/dev/null || echo "null")
echo "Profissional criado: $PROF_ID"

# 2. Listar profissionais
echo -e "\n2. Listando profissionais..."
curl -s -X GET "$BASE_URL/profissionais?contexto=Casa" \
  -H "Content-Type: application/json" | jq .

# 3. Buscar por contexto e categoria
echo -e "\n3. Buscando por contexto e categoria..."
curl -s -X GET "$BASE_URL/profissionais/contexto/Casa/categoria/Encanamento" \
  -H "Content-Type: application/json" | jq .

# 4. Criar chamado (assumindo que já existe pelo Feature 013)
echo -e "\n4. Criando chamado..."
CHAMADO=$(curl -s -X POST "$BASE_URL/chamados" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Vazamento de água",
    "descricao": "Há vazamento na cozinha",
    "contexto": "Casa",
    "prioridade": "ALTA",
    "usuarioId": "user-123"
  }')

CHAMADO_ID=$(echo $CHAMADO | jq -r '.id' 2>/dev/null || echo "null")
echo "Chamado criado: $CHAMADO_ID"

# 5. Realizar triagem
if [ "$CHAMADO_ID" != "null" ]; then
  echo -e "\n5. Realizando triagem automática..."
  curl -s -X POST "$BASE_URL/chamados/$CHAMADO_ID/triagem" \
    -H "Content-Type: application/json" \
    -d '{
      "tipo": "AUTOMATICA",
      "critérios": {"prioridade": "ALTA"}
    }' | jq .

  # 6. Obter triagem
  echo -e "\n6. Obtendo triagem do chamado..."
  curl -s -X GET "$BASE_URL/chamados/$CHAMADO_ID/triagem" \
    -H "Content-Type: application/json" | jq .
else
  echo "AVISO: Não foi possível criar chamado. Verifique Feature 013."
fi

# 7. Obter profissional
if [ "$PROF_ID" != "null" ]; then
  echo -e "\n7. Obtendo dados do profissional..."
  curl -s -X GET "$BASE_URL/profissionais/$PROF_ID" \
    -H "Content-Type: application/json" | jq .

  # 8. Calcular taxa de satisfação
  echo -e "\n8. Calculando taxa de satisfação..."
  curl -s -X GET "$BASE_URL/profissionais/$PROF_ID/taxa-satisfacao" \
    -H "Content-Type: application/json" | jq .
fi

echo -e "\n=== TESTES CONCLUÍDOS ==="
