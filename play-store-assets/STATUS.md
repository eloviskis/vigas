# 🎯 Play Store Assets - Status

## ✅ Concluído

### 1. AAB Gerado (Android App Bundle)
- **Arquivo**: `/home/eloi/VITAS/play-store-assets/app-release.aab`
- **Tamanho**: 3.1 MB
- **Status**: ✅ Pronto para upload na Play Store
- **Vantagem**: Otimizado pela Google (downloads menores que APK)

### 2. Ícone Alta Resolução
- **Arquivo**: `/home/eloi/VITAS/play-store-assets/app-icon-512x512.png`
- **Dimensões**: 512x512 px
- **Formato**: PNG
- **Status**: ✅ Pronto para Play Store

### 3. Feature Graphic (Banner)
- **Arquivo**: `/home/eloi/VITAS/play-store-assets/feature-graphic.svg`
- **Dimensões**: 1024x500 px
- **Conteúdo**: 
  - Logo "V" grande
  - Texto "VITAS - Encontre o profissional certo em 1 clique"
  - Badges: ⭐ Avaliado | 🔒 Seguro | 💰 PIX
- **Status**: ✅ SVG criado (precisa converter para PNG se necessário)

---

## ⚠️ Pendente: Screenshots

### Onde capturar manualmente:

**Método recomendado: Chrome DevTools**

1. Abrir Chrome: http://31.97.64.250/
2. F12 → Ctrl+Shift+M (modo responsivo)
3. Definir: **1080 x 1920**
4. Ctrl+Shift+P → "Capture screenshot"

### Páginas sugeridas (mín 2, máx 8):

1. **Landing Hero** - `/` - Tela inicial
2. **Como Funciona** - `/` (scroll) - Processo em 3 passos
3. **Login** - `/login` - Formulário de acesso
4. **FAQ** - `/faq` - Perguntas frequentes
5. **Cadastro** - `/cadastro` - Criar conta (OPCIONAL)
6. **Chamados** - `/chamados` (após login) - Lista de serviços (OPCIONAL)

### Salvar em:
`/home/eloi/VITAS/play-store-assets/screenshots/`

**Nomes**: `01-landing.png`, `02-login.png`, etc.

---

## 📋 Checklist Play Store

### Obrigatório:
- [x] AAB gerado e assinado
- [x] Ícone 512x512
- [ ] Mínimo 2 screenshots (1080x1920)
- [x] Descrição do app (já no guia)
- [ ] Política de privacidade (URL: http://31.97.64.250/politica-privacidade)
- [ ] Classificação de conteúdo
- [ ] Conta Google Play Console ($25 USD)

### Recomendado:
- [x] Feature Graphic 1024x500
- [ ] 4-8 screenshots de qualidade
- [ ] Vídeo promocional (YouTube - OPCIONAL)
- [ ] Descrição em inglês (expansão futura)

---

## 📁 Estrutura Final

```
/home/eloi/VITAS/play-store-assets/
├── app-release.aab ✅ (3.1 MB)
├── app-icon-512x512.png ✅ (14 KB)
├── feature-graphic.svg ✅ (1.7 KB)
├── COMO-CAPTURAR-SCREENSHOTS.md ✅
└── screenshots/ ⏳ (capturar manualmente)
    ├── 01-landing.png (TODO)
    ├── 02-login.png (TODO)
    └── ... (mínimo 2)
```

---

## 🚀 Próximos Passos

1. **Capturar 2-4 screenshots** usando Chrome DevTools
2. **Criar conta Play Console**: https://play.google.com/console/signup
3. **Upload do AAB**: Na aba "Produção" ou "Teste Interno"
4. **Preencher informações**: Nome, descrição, categoria, classificação
5. **Submeter para revisão**: 3-7 dias para aprovação

---

## 💡 Dica

Se quiser testar antes de publicar na Play Store:
1. Use "Teste Interno" no Play Console
2. Adicione emails de testadores (até 100)
3. Eles recebem link para instalar versão beta
4. Após validação, promova para "Produção"
