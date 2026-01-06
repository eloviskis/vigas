# VITAS - User Flows (Fluxos de Usuário)

Documentação detalhada dos fluxos de interação entre usuários e o sistema VITAS.

## 1. Fluxo de Autenticação

### Objetivo
Permitir que novos usuários se registrem e usuários existentes façam login.

### Atores
- **Novo Cliente**: Primeiro acesso, não tem conta
- **Profissional**: Primeira vez usando a plataforma
- **Usuário Retornando**: Já tem conta, faz login

### Fluxo Principal: Login
```
1. Usuário abre app
2. Sistema detecta: não autenticado
3. Mostra tela de login
4. Usuário insere email
5. Sistema valida em tempo real (email existe?)
6. Usuário insere senha
7. Clica "ENTRAR"
8. Sistema valida credenciais (bcrypt)
9. SE credenciais corretas:
   - Gera JWT token (7 dias)
   - Salva em localStorage
   - Redireciona para Dashboard
10. SE credenciais erradas:
   - Mostra erro "Email ou senha inválidos"
   - Focusa no campo de senha
```

### Fluxo Alternativo: Primeiro Acesso (Registro)
```
1. Usuário na tela de login
2. Clica "CRIAR CONTA"
3. Vai para tela de Registro
4. Insere:
   - Nome completo
   - Email
   - Senha (min 6 caracteres)
   - Confirma senha
5. OPCIONAL: Marca "Sou Profissional"
   - Se marcado, mostra campos adicionais:
     - CPF/CNPJ
     - Especialidades (multi-select)
     - Documento de identidade (upload)
6. Clica "CRIAR CONTA"
7. Sistema valida:
   - Email não existe
   - Senhas combinam
   - Nome tem mín 3 caracteres
8. SE válido:
   - Cria usuário no banco
   - Hash de senha (bcrypt)
   - Gera JWT token
   - Redireciona para Dashboard
9. SE inválido:
   - Mostra erro específico
   - Permite corrigir
```

### Fluxo Alternativo: Esqueceu Senha
```
1. Usuário na tela de login
2. Clica "Esqueceu a senha?"
3. Vai para tela de recuperação
4. Insere email
5. Sistema verifica:
   - SE email existe: envia link de reset por email
   - SE não existe: "Email não encontrado"
6. Usuário clica link do email
7. Vai para tela de reset de senha
8. Insere nova senha 2x
9. Clica "Atualizar Senha"
10. Sistema atualiza no banco
11. Redireciona para login
```

---

## 2. Fluxo do Cliente: Criar Chamado

### Objetivo
Cliente descreve problema e sistema encontra profissionais adequados.

### Fluxo Principal
```
1. Cliente no Dashboard
2. Clica botão "Novo Chamado" ou "➕"
3. Vai para tela "Criar Chamado"
4. Preenche:
   
   4.1 TIPO DE SERVIÇO
       - Dropdown com categorias
       - Opções: Hidráulica, Eletricidade, Carpintaria, AC, Pintura, Outro
       - Obrigatório
   
   4.2 DESCRIÇÃO
       - Textarea com placeholder
       - Mín 10, máx 500 caracteres
       - Obrigatório
       - Sugestões de texto (auto-complete)
   
   4.3 FOTOS (opcional)
       - Botão "Adicionar Foto"
       - Câmera ou galeria
       - Máx 5 fotos
       - Máx 10MB cada
       - Preview com remover
   
   4.4 LOCALIZAÇÃO
       - Mostra endereço atual (Google Maps)
       - Botão "Usar Localização Atual"
       - Ou insira endereço manualmente
       - Obrigatório
   
   4.5 URGÊNCIA (opcional)
       - Radio: Normal / Urgente / Emergencial
       - Padrão: Normal
   
   4.6 ORÇAMENTO MÁXIMO (opcional)
       - Slider ou input
       - De R$ 0 a R$ 10.000
       - Padrão: Vazio
       - Mostra apenas profissionais abaixo deste valor

5. Usuário clica "SOLICITAR SERVIÇO"
6. Sistema valida:
   - Todos campos obrigatórios preenchidos?
   - Email do usuário confirmado?
   - Localização válida?
   
7. SE válido:
   - Mostra "Aguardando Triagem" (loading)
   - Faz requisição POST /chamados
   - Backend cria Chamado
   - Backend executa Triagem:
     * Calcula score (0-100)
     * Busca profissionais por especialidade
     * Filtra por distância (raio configurável)
     * Ordena por rating + proximidade
     * Retorna top 5-10
   
8. Após ~3-5 segundos:
   - Mostra tela "Profissionais Sugeridos"
   - Lista profissionais com rating, distância, preço estimado
   
9. Cliente seleciona profissional
   - Vai para "Detalhes do Profissional"
   - Pode ver reviews, especialidades, contato
   
10. Clica "SOLICITAR ORÇAMENTO"
    - Sistema envia notificação para profissional
    - Profissional recebe: "Novo chamado disponível"
    - Cliente volta para Dashboard
    - Status muda para "Aguardando Orçamento"

SE inválido:
- Mostra erro específico (qual campo?)
- Permite corrigir
- Mantém dados já inseridos
```

### Fluxo Alternativo: Ver Múltiplos Profissionais
```
1. Cliente na tela "Profissionais Sugeridos"
2. Pode filtrar por:
   - Distância (slider)
   - Rating (mín 3 estrelas?)
   - Preço (range slider)
3. Pode ver detalhes de cada profissional
4. Pode enviar solicitude para múltiplos
5. Sistema permite aceitar múltiplos orçamentos
```

### Fluxo Alternativo: Cancelar Chamado
```
1. Cliente no Dashboard
2. Vê chamado em progresso
3. Clica no chamado
4. Abre detalhes
5. Clica "Cancelar Chamado"
6. Sistema pede confirmação:
   "Tem certeza? Profissionais serão notificados"
7. SE confirmar:
   - Status muda para "Cancelado"
   - Profissionais recebem notificação
   - Nenhum valor é debitado (se em "Aguardando")
8. SE não:
   - Volta para detalhes
```

---

## 3. Fluxo de Triagem e Matching

### Objetivo
Sistema encontra melhores profissionais para cada chamado baseado em algoritmo.

### Algoritmo de Scoring
```
score = (
  urgencia * 0.30 +           // Cliente marcou como Urgente?
  complexidade * 0.25 +       // Análise de descrição/fotos
  historico_cliente * 0.20 +  // Cliente confiável?
  disponibilidade * 0.15 +    // Profissionais disponíveis próximos?
  sazonalidade * 0.10         // Época (mais demanda = maior score)
)

Resultado: 0-100 (usado para ordenação de profissionais)
```

### Matching de Profissionais
```
1. Backend recebe Chamado criado
2. Para cada Profissional na categoria:
   a) Verificar: Está ativo?
   b) Calcular distância (Maps API):
      - SE > 10km: DESCARTA (configurável)
      - SE < 1km: +5 pontos
      - SE 1-5km: +3 pontos
      - SE 5-10km: +1 ponto
   c) Adicionar rating:
      - Média de avaliações
      - SE rating < 3.0: DESCARTA (opcional)
   d) Verificar disponibilidade:
      - Agenda tem slots nos próximos 7 dias?
      - SE não: DESCARTA
   e) Comparar com orçamento máximo:
      - Preço médio <= orçamento máximo?
      - SE não: DESCARTA
3. Ordenar resultado por:
   - Primeiro: Score do chamado (DESC)
   - Segundo: Rating (DESC)
   - Terceiro: Distância (ASC)
4. Retornar TOP 5-10 profissionais
```

### Notificações de Triagem
```
1. Cliente vê "Aguardando Triagem"
2. Backend executa triagem (async)
3. Triagem completa:
   - SE encontrou profissionais:
     * Notifica cliente: "Encontramos X profissionais!"
     * Mostra tela com sugestões
   - SE não encontrou:
     * Notifica cliente: "Nenhum profissional disponível no momento"
     * Sugere: Aumentar raio, reduzir orçamento máximo, tentar depois
```

---

## 4. Fluxo de Agendamento

### Objetivo
Cliente marca data/hora do serviço com profissional aprovado.

### Fluxo Principal
```
1. Cliente recebeu orçamento e clicou "APROVAR & AGENDAR"
2. Vai para tela "Escolher Data e Hora"
3. Mostra slots disponíveis do profissional:
   - Próximos 7 dias
   - Apenas 8h-18h (horário comercial)
   - Slots de 1-4 horas (conforme duração do orçamento)
4. Cliente seleciona slot
5. Clica "CONFIRMAR AGENDAMENTO"
6. Sistema valida:
   - Slot ainda disponível?
   - Cliente tem saldo para pagar?
7. SE válido:
   - Reserva slot
   - Cria Agendamento no banco
   - Notifica ambos: "Serviço agendado para [data]"
   - Vai para tela de PAGAMENTO
8. SE não:
   - Mostra erro
   - Permite selecionar outro slot
```

### Fluxo Alternativo: Mudança de Horário
```
1. Cliente já tem serviço agendado
2. Clica "Reagendar"
3. Vai para tela similar (Escolher Nova Data)
4. Seleciona novo slot
5. Sistema valida:
   - Não é < 24h do agendamento original?
     SE sim: Aviso "Você pode reagendar até 24h antes"
   - Já reagendou 2x neste serviço?
     SE sim: "Limite de reagendamentos atingido"
6. SE válido:
   - Libera slot antigo
   - Reserva slot novo
   - Notifica profissional: "Agendamento mudado para [data]"
7. SE não válido:
   - Mostra erro
   - Sugere contato direto com profissional
```

---

## 5. Fluxo de Pagamento

### Objetivo
Cliente paga pelo serviço antes da execução.

### Fluxo Principal: PIX
```
1. Cliente na tela de Pagamento
2. Vê resumo:
   - Profissional + rating
   - Data/hora/local
   - Descrição do serviço
   - Valor total (serviço + taxa)
3. Seleciona "PIX" como forma de pagamento
4. Clica "GERAR QR CODE PIX"
5. Sistema faz requisição:
   - POST /pagamentos/pix
   - Body: { chamadoId, valor, profissionalId }
6. Backend:
   - Conecta com gateway de pagamento
   - Gera QR Code com chave PIX
   - Salva Pagamento (status: "pendente")
   - Retorna QR Code para frontend
7. Frontend mostra:
   - QR Code visual grande
   - Botão "COPIAR PIX COPIA" (copia string)
   - Botão "Abrir App do Banco" (deep link)
   - Timer de expiração (10 minutos)
   - Status: "Aguardando confirmação"
8. Cliente:
   - Opção A: Escaneia QR com app do banco
   - Opção B: Abre app do banco e copia código PIX
9. Realiza transferência PIX
10. Gateway notifica backend via webhook:
    - POST /webhooks/pix-callback
    - Body: { transacao_id, status: "aprovado" }
11. Backend:
    - Atualiza Pagamento: status = "confirmado"
    - Notifica cliente: "Pagamento confirmado!"
    - Notifica profissional: "Novo agendamento para você!"
12. Frontend automaticamente:
    - Mostra "Pagamento Confirmado" ✓
    - Detalhes da visita
    - Botões: Chat, Contato Emergencial, Rastrear
13. Cliente pode ir para Dashboard
```

### Fluxo Principal: Cartão de Crédito
```
1. Cliente na tela de Pagamento
2. Seleciona "Cartão de Crédito"
3. Clica "PAGAR COM CARTÃO"
4. Vai para tela de dados do cartão:
   - Número (16 dígitos)
   - Nome (como no cartão)
   - Data de validade (MM/YY)
   - CVV (3 dígitos)
   - Parcelamento (1x a 12x)
5. Clica "CONFIRMAR PAGAMENTO"
6. Frontend valida:
   - Números válidos?
   - Data válida?
   - CVV válido?
7. Envia para backend:
   - POST /pagamentos/cartao
   - Body: { cartao, valor, parceladasAtéx }
8. Backend (PCI-DSS):
   - NUNCA salva dados do cartão
   - Conecta com gateway (ex: Stripe, PagSeguro)
   - Gateway processa pagamento
9. Gateway retorna:
   - SE aprovado:
     * Transacao_id
     * Status: "confirmado"
   - SE recusado:
     * Motivo (cartão expirado, fundos insuficientes, etc.)
     * Status: "recusado"
10. Backend atualiza Pagamento
11. Frontend mostra resultado (igual ao PIX)
```

### Fluxo Alternativo: Pagamento Recusado
```
1. Gateway retorna erro (cartão expirado, saldo insuficiente, etc.)
2. Frontend mostra erro com motivo
3. Cliente pode:
   - Tentar outro cartão
   - Escolher PIX
   - Cancelar (volta para agendamento)
4. SE cancela:
   - Agendamento é mantido
   - Cliente pode tentar pagar depois (até 1h)
   - Após 1h: Agendamento é liberado para outro cliente
```

### Fluxo Alternativo: Pagamento Expirado
```
1. Cliente não conclui pagamento em 10 minutos (PIX)
2. QR Code expira
3. Frontend mostra: "QR Code expirou"
4. Cliente pode:
   - Clicar "Gerar Novo QR"
   - Cancelar agendamento
5. SE gera novo:
   - Volta ao passo 7 (gerar novo QR)
```

---

## 6. Fluxo de Execução do Serviço

### Objetivo
Profissional realiza serviço e cliente confirma conclusão.

### Dia do Agendamento
```
1. Profissional:
   - Recebe notificação 1h antes
   - Abre agenda do dia
   - Vê serviço agendado
2. Sai para local
3. Usa app para:
   - "Check-in" quando chega (GPS)
   - Tira fotos do antes/durante
   - Registra problemas encontrados
   - Marca como "Iniciado"
4. Realiza serviço
5. Marca como "Concluído"
6. Tira fotos do depois
7. Clica "FINALIZAR SERVIÇO"
8. Sistema:
   - Notifica cliente: "Serviço concluído!"
   - Libera link para pagamento (se não pago ainda)
```

### Confirmação do Cliente
```
1. Cliente recebe notificação: "Serviço concluído por João Silva"
2. Abre app
3. Vê detalhes:
   - Fotos do antes/depois
   - Descrição do trabalho realizado
   - Observações do profissional
4. Pode:
   - ✓ CONFIRMAR: "Serviço OK"
   - ✗ CONTESTAR: "Não ficou bem feito"
5. SE confirma:
   - Status: "Concluído"
   - Profissional pode sacar pagamento
   - Notifica para avaliar
6. SE contesta:
   - Abre chat com profissional
   - Descreve problema
   - Profissional pode:
     * Voltar para refazer
     * Discutir valor
     * Escalar para Admin
```

---

## 7. Fluxo de Avaliação

### Objetivo
Cliente deixa feedback, profissional constrói reputação.

### Fluxo Principal
```
1. Serviço foi concluído e confirmado
2. Sistema notifica cliente:
   "Como foi o serviço com João Silva?"
3. Cliente vai para tela de Avaliação
4. Preenche:
   - ⭐ Classificação (1-5 estrelas, obrigatório)
   - 💬 Comentário (texto, opcional, até 500 chars)
   - 👍 "Recomenda para amigos?" (checkbox)
5. Clica "ENVIAR AVALIAÇÃO"
6. Sistema salva no banco
7. Atualiza rating médio do profissional
8. Notifica profissional:
   "João Silva deixou uma avaliação ⭐⭐⭐⭐⭐"
9. Mostra página de agradecimento
10. Cliente volta para Dashboard
```

### Fluxo Alternativo: Follow-ups Automatizados
```
Depois do serviço, sistema dispara emails automáticos:

D+7 (7 dias):
- Email: "Como foi o serviço? Deixe sua avaliação"
- Link para tela de avaliação

D+30 (30 dias):
- Email: "Precisou de novo serviço? Conheça mais profissionais"
- Link para Dashboard

D+90 (90 dias):
- Email: "Recomende este profissional para seus amigos"
- Link para compartilhar (referência)

SE cliente clica:
- Vai para tela de avaliação
- Pode deixar comentário (mesmo se venceu 7 dias)
```

---

## 8. Fluxo do Profissional: Receber Chamado

### Objetivo
Profissional é notificado de novo chamado e pode enviar orçamento.

### Notificação de Novo Chamado
```
1. Cliente cria chamado
2. Backend executa triagem
3. Profissional é identificado como potencial match
4. Sistema envia notificação:
   - Push notification
   - Email
   - In-app banner
5. Notificação contém:
   - Resumo do chamado
   - Localização (distância)
   - Score de compatibilidade
   - Botão "Ver Detalhes"
```

### Fluxo: Enviar Orçamento
```
1. Profissional clica notificação ou abre lista de chamados
2. Vai para "Detalhes do Chamado"
3. Vê:
   - Descrição do cliente
   - Fotos (se enviou)
   - Localização e distância
   - Cliente é novo? Histórico dele
4. Clica "ENVIAR ORÇAMENTO"
5. Vai para tela "Criar Orçamento"
6. Preenche:
   - Valor (R$)
   - Duração estimada (horas)
   - Descrição do trabalho
   - Disponibilidades (slots)
7. Clica "ENVIAR ORÇAMENTO"
8. Sistema:
   - Salva Orcamento no banco
   - Notifica cliente: "João Silva enviou orçamento de R$ 150"
   - Profissional retorna para lista de chamados
9. Próximas 24-48h:
   - Cliente pode aceitar, recusar ou pedir ajustes
   - Profissional recebe notificação da decisão
```

### Fluxo Alternativo: Cliente Pede Ajuste no Orçamento
```
1. Cliente clica "NEGOCIAR VALOR"
2. Abre chat com profissional
3. Sugere outro preço ou pede redução
4. Profissional:
   - Vê mensagem em tempo real
   - Pode aceitar, contra-oferecer, ou recusar
   - Clica "ACEITAR NOVO VALOR" ou "RECUSAR"
5. SE aceita:
   - Orçamento atualizado
   - Cliente pode pagar
6. SE recusa:
   - Chat continua (pode falar)
   - Cliente pode tentar com outro profissional
```

### Fluxo Alternativo: Recusar Chamado
```
1. Profissional vê chamado
2. Clica "RECUSAR"
3. Sistema pede motivo:
   - "Já tenho agendamentos"
   - "Longe demais"
   - "Não tenho expertise"
   - "Outro"
4. Profissional seleciona motivo
5. Sistema:
   - Remove notificação
   - Registra recusa (para análise)
   - Oferece chamado para próximo profissional na lista
```

---

## 9. Fluxo de Saque (Profissional)

### Objetivo
Profissional recebe seu pagamento.

### Quando Recebe?
```
1. Cliente confirmou serviço (status: Concluído)
2. Após 3 dias úteis (segurança contra chargebacks)
3. Sistema automaticamente:
   - Calcula valor (desconta taxa VITAS)
   - Transfere para conta bancária do profissional
   - Notifica: "Valores depositados em sua conta"
4. Profissional vê no Dashboard:
   - Histórico de saques
   - Próximos valores a receber
```

### Tela de Extrato
```
Profissional pode ver:
- Saldo atual
- Pendente (ainda não recebido)
- Histórico de transações
- Transferências realizadas
- Taxa VITAS (ex: 10%)
```

---

## 10. Fluxo de Suporte e Disputas

### Problema: Cliente Diz que Serviço Ficou Ruim
```
1. Cliente na tela de confirmação de serviço
2. Clica "❌ NÃO FOI BOM"
3. Sistema abre chat de disputa
4. Cliente descreve problema
5. Profissional é notificado
6. Conversa ocorre em chat
7. Opções:
   - Profissional volta para refazer
   - Acordam em desconto
   - Escalam para Admin
8. Admin analisa e decide
```

### Problema: Profissional Não Apareceu
```
1. Cliente aguarda horário
2. Após 30 minutos, clica "Profissional não apareceu"
3. Sistema:
   - Notifica profissional
   - Inicia processo de disputa
4. Admin:
   - Pode refundar cliente
   - Pode avisar ou remover profissional
```

---

## 📊 Estatísticas de Fluxo

### Taxa Esperada de Conversão
```
Visualizações de Chamado: 100
└─ Enviam Orçamento: 40 (40%)
   └─ Cliente Aceita: 28 (70%)
      └─ Pagamento Realizado: 26 (93%)
         └─ Serviço Concluído: 25 (96%)
            └─ Cliente Avalia: 22 (88%)
               └─ Rating >= 4 estrelas: 20 (91%)
```

### Tempo Médio
```
Criação de Chamado → Triagem: 3-5 segundos
Triagem → Sugestões: 0 (imediato)
Chamado → Primeiro Orçamento: 15 minutos
Orçamento Aceito → Pagamento: 5 minutos
Pagamento Aprovado → Serviço: ~24 horas
Serviço Concluído → Avaliação: ~1 hora
```

---

**Última atualização**: 6 de janeiro de 2026  
**Versão**: 1.0.0
