# 📱 Guia de Instalação PWA no Android

## ✅ PWA Implementado com Sucesso!

### 🎯 O que foi feito:

1. **Manifest.json configurado**
   - Nome: "VITAS - Encontre o Profissional Certo"
   - Tema: #2563eb (azul)
   - Ícones: 192x192 e 512x512 (PNG gerados)
   - Shortcuts: "Criar Chamado", "Meus Chamados"

2. **Service Worker com Workbox**
   - Cache de API (NetworkFirst)
   - Atualização automática
   - Offline support

3. **Meta tags PWA**
   - theme-color, viewport-fit
   - apple-mobile-web-app-capable
   - manifest linkado

4. **Componente de instalação**
   - Prompt de instalação automático
   - UI responsiva e acessível

---

## 🧪 Como Testar no Android

### Método 1: Localhost via USB (Recomendado)

1. **Habilite USB Debugging no Android:**
   - Configurações → Sobre o telefone → Toque 7x em "Número da compilação"
   - Configurações → Opções do desenvolvedor → Ativar "Depuração USB"

2. **Conecte via USB e configure port forwarding:**
   ```bash
   # Instale Android SDK Platform Tools
   sudo apt install adb
   
   # Conecte o celular via USB
   adb devices
   
   # Configure port forwarding
   adb reverse tcp:4173 tcp:4173
   adb reverse tcp:3000 tcp:3000
   ```

3. **Acesse no Chrome do Android:**
   - Abra: `http://localhost:4173`
   - Menu (⋮) → "Instalar app"
   - Aceite a instalação

### Método 2: Rede Local (sem cabo)

1. **Inicie com --host:**
   ```bash
   cd frontend
   npm run preview -- --host
   ```

2. **Encontre seu IP local:**
   ```bash
   ip addr show | grep "inet " | grep -v 127.0.0.1
   ```

3. **No Android, acesse:**
   - `http://[SEU_IP]:4173`
   - Ex: `http://192.168.1.100:4173`

4. **Instale:**
   - Chrome → Menu → "Adicionar à tela inicial"

### Método 3: Deploy Temporário (Ngrok)

1. **Instale ngrok:**
   ```bash
   snap install ngrok
   ```

2. **Exponha localhost:**
   ```bash
   ngrok http 4173
   ```

3. **Use URL HTTPS gerada** (ex: `https://abc123.ngrok.io`)

---

## ✨ Funcionalidades PWA

- ✅ Instalável na home screen
- ✅ Ícone personalizado
- ✅ Splash screen automático
- ✅ Modo standalone (sem barra do navegador)
- ✅ Offline básico (cache de assets)
- ✅ Atalhos na home screen
- ✅ Atualizações automáticas

---

## 🔍 Verificar se PWA está OK

### No Chrome DevTools (Desktop):

1. **Lighthouse:**
   ```
   DevTools → Lighthouse → "Progressive Web App" → Run
   ```
   Deve ter score 90+ em PWA

2. **Application Tab:**
   ```
   DevTools → Application →
   - Manifest: deve mostrar ícones e metadata
   - Service Workers: deve estar "activated"
   - Cache Storage: deve ter entradas após navegar
   ```

3. **Network Tab:**
   ```
   Offline mode → Recarregar página
   Assets devem carregar do cache
   ```

### No Android (Chrome):

1. **Installability:**
   - Menu → Deve aparecer "Instalar app"
   - Se não aparecer: não é installable PWA

2. **Após Instalação:**
   - Ícone na home screen
   - Abrir sem barra de navegação
   - Splash screen com cor azul

---

## 📊 Status Atual

### ✅ Completo:
- Manifest com metadata completa
- Service worker com caching
- Ícones PNG (192, 512)
- Meta tags PWA
- Install prompt UI
- Build de produção

### 🔄 Próximos Passos (Opcional):
- [ ] Push notifications
- [ ] Background sync
- [ ] Add to home screen banner
- [ ] Update UI quando nova versão disponível
- [ ] Offline fallback page customizada

---

## 🐛 Troubleshooting

**"Instalar app" não aparece:**
- PWA precisa HTTPS (ou localhost)
- Manifest precisa estar acessível
- Service worker precisa registrar
- Verificar no DevTools → Application → Manifest

**Service Worker não registra:**
```javascript
// Verificar no console
navigator.serviceWorker.getRegistrations()
  .then(regs => console.log(regs))
```

**Cache não funciona:**
- Verificar DevTools → Application → Cache Storage
- Limpar cache: `Clear site data`
- Reconstruir: `npm run build`

---

## 🚀 Build Final

```bash
# Gerar build de produção
cd frontend
npm run build

# Testar localmente
npm run preview

# Deploy (Hostinger, Vercel, Netlify)
# Upload da pasta dist/
```

---

## 📱 Teste Realizado

**Build gerado com sucesso:**
```
✓ built in 2.81s
PWA v1.2.0
mode      generateSW
precache  11 entries (334.55 KiB)
files generated
  dist/sw.js
  dist/workbox-3896e580.js
```

**Pronto para:**
- ✅ Instalação Android
- ✅ Modo offline
- ✅ Home screen shortcuts
- ✅ Deploy produção
