# Configuração do CI/CD GitHub Actions

Este projeto utiliza GitHub Actions para CI/CD automático.

## 🔧 Configuração Necessária

### Secrets do GitHub

Adicione os seguintes secrets no repositório (Settings → Secrets and variables → Actions):

```
SSH_PRIVATE_KEY=<sua_chave_privada_ssh>
REMOTE_HOST=31.97.64.250
REMOTE_USER=root
```

### Como obter a chave SSH:

```bash
cat ~/.ssh/id_ed25519
```

Copie TODO o conteúdo (incluindo `-----BEGIN` e `-----END`) e cole no secret `SSH_PRIVATE_KEY`.

## 📋 Workflows Configurados

### 1. CI Backend (`ci-backend.yml`)
- **Trigger**: Push ou PR com mudanças em `backend/**`
- **Ações**:
  - Install dependencies
  - Lint (se disponível)
  - Build TypeScript
  - Run tests (se disponível)
  - Upload artifacts

### 2. CI Frontend (`ci-frontend.yml`)
- **Trigger**: Push ou PR com mudanças em `frontend/**`
- **Ações**:
  - Install dependencies
  - Lint (se disponível)
  - Build Vite
  - Run tests (se disponível)
  - Upload artifacts

### 3. CD Production (`cd-production.yml`)
- **Trigger**: Push para `main` ou `007-agendamento`
- **Ações Backend**:
  - Build
  - Deploy dist/ para servidor
  - npm install --production
  - PM2 restart

- **Ações Frontend**:
  - Build com VITE_API_URL=https://vitas.app.br/api
  - Deploy dist/ para servidor

## 🚀 Como Usar

### Deploy Automático

1. Faça commit das mudanças:
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push
   ```

2. GitHub Actions automaticamente:
   - Roda CI (lint, build, test)
   - Se no branch main/007-agendamento: faz deploy

3. Veja o progresso em: `Actions` tab no GitHub

### Deploy Manual

Se precisar fazer deploy manual:

```bash
# Backend
cd backend && npm run build
scp -r dist/* root@31.97.64.250:/var/www/vitas/backend/dist/
ssh root@31.97.64.250 "pm2 restart vitas-backend"

# Frontend
cd frontend && npm run build
scp -r dist/* root@31.97.64.250:/var/www/vitas/frontend/
```

## 🔍 Status Badges

Adicione ao README.md:

```markdown
[![CI Backend](https://github.com/eloviskis/vitas/actions/workflows/ci-backend.yml/badge.svg)](https://github.com/eloviskis/vitas/actions/workflows/ci-backend.yml)
[![CI Frontend](https://github.com/eloviskis/vitas/actions/workflows/ci-frontend.yml/badge.svg)](https://github.com/eloviskis/vitas/actions/workflows/ci-frontend.yml)
[![CD Production](https://github.com/eloviskis/vitas/actions/workflows/cd-production.yml/badge.svg)](https://github.com/eloviskis/vitas/actions/workflows/cd-production.yml)
```

## 🐛 Troubleshooting

### Deploy falha com erro de SSH

1. Verifique se `SSH_PRIVATE_KEY` está correto
2. Teste SSH manual: `ssh -i ~/.ssh/id_ed25519 root@31.97.64.250`
3. Verifique permissões: `chmod 600 ~/.ssh/id_ed25519`

### PM2 não reinicia

1. SSH no servidor: `ssh root@31.97.64.250`
2. Verifique status: `pm2 status`
3. Restart manual: `pm2 restart vitas-backend`
4. Logs: `pm2 logs vitas-backend`

### Build falha

1. Verifique logs no Actions tab
2. Teste build local: `npm run build`
3. Verifique dependências: `npm ci`

## 📝 Próximos Passos

- [ ] Adicionar testes E2E no CI
- [ ] Adicionar Codecov para coverage
- [ ] Adicionar notificações Slack/Discord
- [ ] Ambiente de staging separado
- [ ] Rollback automático se deploy falhar
