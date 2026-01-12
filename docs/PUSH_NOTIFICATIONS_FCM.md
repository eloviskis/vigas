# Configuração Push Notifications FCM

## 📋 Visão Geral

Sistema de push notifications usando **Firebase Cloud Messaging (FCM)** para:
- Notificações em tempo real sobre chamados
- Atualizações de status (triagem, agendamento, conclusão)
- Mensagens do operador/profissional
- Funciona em web, Android e iOS

## 🔧 Configuração Firebase

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **Add project**
3. Nome: `vitas-production`
4. Desative Google Analytics (opcional)
5. Crie o projeto

### 2. Adicionar Web App

1. No projeto Firebase, clique em **Web** (ícone `</>`)
2. Nome do app: `VITAS Web`
3. **NÃO** marque Firebase Hosting
4. Clique em **Register app**
5. Copie o `firebaseConfig` object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "vitas-production.firebaseapp.com",
  projectId: "vitas-production",
  storageBucket: "vitas-production.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 3. Habilitar Cloud Messaging

1. No menu lateral, vá para **Engage** → **Messaging**
2. Clique em **Get started**
3. Selecione **Web** como plataforma

### 4. Gerar Chave VAPID

1. Vá para **Project Settings** (⚙️)
2. Aba **Cloud Messaging**
3. Em **Web configuration**, clique em **Generate key pair**
4. Copie a **Key pair** (começa com `B...`)

### 5. Criar Service Account (Backend)

1. Ainda em **Project Settings**, vá para **Service accounts**
2. Clique em **Generate new private key**
3. Confirme e baixe o arquivo JSON
4. Salve como `firebase-service-account.json` no servidor

## 🔐 Variáveis de Ambiente

### Backend `.env`

```bash
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/firebase-service-account.json
```

### Frontend `.env`

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBPc_xyz123
VITE_FIREBASE_AUTH_DOMAIN=vitas-production.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vitas-production
VITE_FIREBASE_STORAGE_BUCKET=vitas-production.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_VAPID_KEY=BPi5dU...xyz
```

## 📱 Service Worker

O service worker já está configurado em [firebase-messaging-sw.js](../frontend/public/firebase-messaging-sw.js).

**Importante**: Edite as credenciais Firebase no arquivo:

```javascript
// frontend/public/firebase-messaging-sw.js
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

## 🚀 Como Funciona

### Fluxo de Registro

1. **Usuário faz login** → Frontend solicita permissão de notificações
2. **Permissão concedida** → Firebase gera FCM token único
3. **Token registrado** → Frontend envia token para `PATCH /api/notifications/register-token`
4. **Token salvo** → Backend salva `fcmToken` na tabela `users`

### Envio de Notificações

#### Exemplo: Novo Chamado

```typescript
// No backend, quando chamado é criado
import { PushNotificationService } from './notification/push-notification.service';

async criarChamado(data: CriarChamadoDto, userId: string) {
  const chamado = await this.chamadoRepository.save(data);
  
  // Buscar operadores ativos
  const operadores = await this.userRepository.find({
    where: { role: 'operador', fcmToken: Not(IsNull()) }
  });

  // Enviar notificação para todos operadores
  const tokens = operadores.map(op => op.fcmToken).filter(Boolean);
  
  await this.pushNotificationService.sendToMultipleDevices(tokens, {
    title: 'Novo Chamado! 🔔',
    body: `${chamado.descricao.slice(0, 50)}...`,
    data: {
      chamadoId: chamado.id,
      url: `/admin/chamados/${chamado.id}`
    }
  });
}
```

#### Exemplo: Status Atualizado

```typescript
async atualizarStatus(chamadoId: string, novoStatus: string) {
  const chamado = await this.chamadoRepository.findOne({
    where: { id: chamadoId },
    relations: ['cliente']
  });

  chamado.status = novoStatus;
  await this.chamadoRepository.save(chamado);

  // Notificar cliente
  if (chamado.cliente.fcmToken) {
    await this.pushNotificationService.sendToDevice(
      chamado.cliente.fcmToken,
      {
        title: 'Chamado Atualizado 📢',
        body: `Seu chamado foi ${novoStatus}`,
        data: {
          chamadoId: chamado.id,
          url: `/chamados/${chamado.id}`
        }
      }
    );
  }
}
```

## 📊 API Endpoints

### `PATCH /api/notifications/register-token`

Registra FCM token do usuário.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "fcmToken": "fX8y...:APA91..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "FCM token registered"
}
```

### `POST /api/notifications/send`

Envia notificação para um dispositivo específico.

**Body:**
```json
{
  "token": "fX8y...:APA91...",
  "title": "Título da notificação",
  "body": "Corpo da mensagem",
  "data": {
    "chamadoId": "123",
    "url": "/chamados/123"
  },
  "imageUrl": "https://..."
}
```

### `POST /api/notifications/send-multiple`

Envia para múltiplos dispositivos.

**Body:**
```json
{
  "tokens": ["token1", "token2", "token3"],
  "title": "Título",
  "body": "Mensagem",
  "data": {}
}
```

**Response:**
```json
{
  "success": true,
  "successCount": 2,
  "failureCount": 1,
  "total": 3
}
```

### `POST /api/notifications/send-to-topic`

Broadcast para todos inscritos em um tópico.

**Body:**
```json
{
  "topic": "todos-operadores",
  "title": "Atenção!",
  "body": "Manutenção agendada para hoje às 22h"
}
```

## 🔔 Tipos de Notificações

### 1. Novo Chamado (para operadores)

```typescript
{
  title: "Novo Chamado! 🔔",
  body: "Descrição do problema...",
  data: {
    type: "novo_chamado",
    chamadoId: "123",
    url: "/admin/chamados/123"
  }
}
```

### 2. Status Atualizado (para cliente)

```typescript
{
  title: "Chamado Atualizado 📢",
  body: "Seu chamado foi triado e profissional selecionado",
  data: {
    type: "status_update",
    chamadoId: "123",
    status: "triado"
  }
}
```

### 3. Mensagem Nova (para cliente/operador)

```typescript
{
  title: "Nova Mensagem 💬",
  body: "O operador respondeu seu chamado",
  data: {
    type: "nova_mensagem",
    chamadoId: "123"
  }
}
```

### 4. Agendamento Confirmado (para cliente)

```typescript
{
  title: "Agendamento Confirmado ✅",
  body: "Profissional confirmado para 15/01/2025 às 14:00",
  data: {
    type: "agendamento",
    chamadoId: "123",
    dataAgendamento: "2025-01-15T14:00:00Z"
  }
}
```

## 🧪 Testar Notificações

### Via Postman/cURL

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "token": "fX8y...:APA91...",
    "title": "Teste",
    "body": "Notificação de teste"
  }'
```

### Via Firebase Console

1. Vá para **Engage** → **Messaging**
2. Clique em **Create your first campaign**
3. Selecione **Firebase Notification messages**
4. Preencha título e texto
5. **Send test message** → Cole seu FCM token
6. Clique em **Test**

## 🐛 Troubleshooting

### Error: "Notification permission denied"

**Causa**: Usuário bloqueou notificações no navegador

**Solução**: 
- Chrome: `chrome://settings/content/notifications`
- Remover bloqueio para `localhost` ou domínio

### Error: "FCM token not registered"

**Causa**: Token não foi salvo no backend

**Solução**:
```typescript
// Verificar se token foi enviado
const user = await userRepository.findOne({ where: { id: userId } });
console.log('FCM Token:', user.fcmToken);
```

### Notifications não aparecem em background

**Causa**: Service worker não registrado

**Solução**:
```javascript
// Verificar no DevTools → Application → Service Workers
// Deve aparecer "firebase-messaging-sw.js" como ativado
```

### Error: "Invalid VAPID key"

**Causa**: Chave VAPID incorreta ou não configurada

**Solução**: Verifique `VITE_FIREBASE_VAPID_KEY` no `.env`

## 📈 Métricas Firebase

No Firebase Console → **Engage** → **Messaging** você vê:

- **Impressions**: Quantas notificações foram entregues
- **Opens**: Quantas foram abertas (clicadas)
- **Conversion rate**: Taxa de conversão

## 🔒 Segurança

### Validar Tokens

```typescript
// Nunca confie 100% em tokens FCM
// Sempre validar userId no backend
@UseGuards(JwtAuthGuard)
async enviarNotificacao(@Request() req, @Body() dto) {
  const user = await userRepository.findOne({ 
    where: { id: req.user.userId } 
  });
  
  // Enviar apenas para token do próprio usuário
  if (user.fcmToken) {
    await pushNotificationService.sendToDevice(user.fcmToken, payload);
  }
}
```

### Rate Limiting

```typescript
// Prevenir spam de notificações
@Throttle(10, 60) // 10 notificações por minuto
@Post('send')
async sendNotification() { ... }
```

## 📝 Próximos Passos

- [ ] Implementar notificações in-app (badge counter)
- [ ] Histórico de notificações
- [ ] Preferências de notificação por usuário
- [ ] Rich notifications com imagens
- [ ] Action buttons (Aceitar/Recusar)
- [ ] Topics por área geográfica
- [ ] Analytics de engajamento
