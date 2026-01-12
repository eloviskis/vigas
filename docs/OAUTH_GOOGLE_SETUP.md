# Configuração OAuth Google

## 📋 Pré-requisitos

1. Conta no Google Cloud Platform
2. Projeto criado no GCP

## 🔧 Passo a Passo

### 1. Criar Credenciais OAuth 2.0

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto (ou crie um novo)
3. Vá para **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth Client ID**
5. Escolha **Web application**
6. Configure:
   - **Name**: VITAS OAuth
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (desenvolvimento)
     - `https://vitas.app.br` (produção)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/google/callback` (dev)
     - `https://vitas.app.br/api/auth/google/callback` (prod)

7. Clique em **Create**
8. Copie **Client ID** e **Client Secret**

### 2. Configurar Variáveis de Ambiente

Backend `.env`:
```bash
# Google OAuth
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Produção
GOOGLE_CALLBACK_URL=https://vitas.app.br/api/auth/google/callback
FRONTEND_URL=https://vitas.app.br
```

Frontend `.env.local`:
```bash
VITE_API_URL=http://localhost:3000/api
```

### 3. Testar OAuth

1. Inicie o backend: `cd backend && npm run start:dev`
2. Inicie o frontend: `cd frontend && npm run dev`
3. Acesse `http://localhost:5173/login`
4. Clique em "Google"
5. Faça login com conta Google
6. Você será redirecionado de volta para o app logado

## 🔒 Segurança

### Produção

1. **Habilite apenas domínios confiáveis** nas configurações OAuth
2. **Use HTTPS** obrigatoriamente
3. **Mantenha secrets seguros** (nunca commite no git)

### Consent Screen

1. No Google Cloud Console, vá para **OAuth consent screen**
2. Configure:
   - **User Type**: External
   - **App name**: VITAS
   - **User support email**: seu@email.com
   - **Developer contact**: seu@email.com
   - **Scopes**: email, profile
   - **Logo**: (opcional) 120x120px
3. Salve

### Verificação do App

Para produção com > 100 usuários:
1. Google exige **verificação do app**
2. Processo leva ~1 semana
3. Acesse **OAuth consent screen** → **Submit for verification**

## 🚀 Deploy

Backend em produção:
```bash
# SSH no servidor
ssh root@31.97.64.250

# Adicionar variáveis de ambiente
cd /var/www/vitas/backend
nano .env

# Adicionar:
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://vitas.app.br/api/auth/google/callback
FRONTEND_URL=https://vitas.app.br

# Restart
pm2 restart vitas-backend
```

## 🐛 Troubleshooting

### Error: redirect_uri_mismatch

**Causa**: URI de callback não autorizado

**Solução**: Adicione a URI exata em **Authorized redirect URIs** no GCP

### Error: access_denied

**Causa**: Usuário negou permissão ou app não verificado

**Solução**: 
- Modo dev: Clique em "Advanced" → "Go to app (unsafe)"
- Produção: Complete verificação do app

### Token não é salvo

**Causa**: CORS ou callback mal configurado

**Solução**: Verifique `FRONTEND_URL` no backend `.env`

## 📚 Referências

- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Passport Google OAuth20](https://www.passportjs.org/packages/passport-google-oauth20/)
- [NestJS Passport](https://docs.nestjs.com/security/authentication#implementing-passport-google)
