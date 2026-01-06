# Guia Completo: Criar e Publicar APK Android - VITAS

**Data**: 06/01/2026  
**App**: VITAS - Encontre o profissional certo  
**Bundle ID**: br.com.vitas

---

## 📱 PARTE 1: GERAR APK ANDROID

### ✅ PASSOS CONCLUÍDOS

1. **Capacitor Instalado**
   ```bash
   ✅ @capacitor/core
   ✅ @capacitor/cli
   ✅ @capacitor/android
   ```

2. **Projeto Android Criado**
   ```bash
   ✅ Pasta android/ criada
   ✅ Estrutura Gradle configurada
   ✅ Web assets copiados
   ```

3. **Configuração**
   ```
   ✅ App Name: VITAS
   ✅ Bundle ID: br.com.vitas
   ✅ Web Dir: dist/
   ✅ Backend URL: http://31.97.64.250
   ```

---

### 🎨 PRÓXIMOS PASSOS: Ícones e Assets

#### Passo 4A: Criar Ícone do App (Obrigatório)

**Você precisa**:
- Ícone 1024x1024px (PNG, fundo transparente ou sólido)
- Software: Figma, Photoshop, Canva, ou GIMP

**Sugestão de design**:
```
Fundo: Azul (#2563eb)
Texto: "V" estilizado em branco
Estilo: Moderno, clean, profissional
```

**Opções para criar**:

1. **Online (Grátis)**:
   - https://www.canva.com (templates prontos)
   - https://www.figma.com (design do zero)
   - https://icon.kitchen (gerador automático)

2. **Usar ferramenta de geração**:
   ```bash
   # Instalar cordova-res (gera todos os tamanhos)
   npm install -g cordova-res
   
   # Colocar ícone 1024x1024 em:
   # /home/eloi/VITAS/frontend/resources/icon.png
   
   # Gerar automaticamente
   cordova-res android --skip-config --copy
   ```

3. **Manual** (criar cada tamanho):
   - `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
   - `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
   - `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
   - `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
   - `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

#### Passo 4B: Splash Screen (Opcional mas recomendado)

**Criar imagem**:
- Tamanho: 2732x2732px
- Fundo: Azul VITAS (#2563eb)
- Logo branco centralizado
- Salvar em: `resources/splash.png`

**Gerar automaticamente**:
```bash
cordova-res android --skip-config --copy
```

---

### 🔧 Passo 5: Atualizar Versão e Permissões

**Editar**: `android/app/build.gradle`

```gradle
android {
    namespace "br.com.vitas"
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "br.com.vitas"
        minSdkVersion 22  // Android 5.1+
        targetSdkVersion 34
        versionCode 1  // Incrementar a cada release
        versionName "1.0.0"  // Versão visível ao usuário
    }
}
```

**Adicionar permissões** em `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <!-- Permissões necessárias para VITAS -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />
    
    <application>
        <!-- Configurações existentes -->
    </application>
</manifest>
```

---

### 🔨 Passo 6: Sincronizar Build

```bash
cd /home/eloi/VITAS/frontend

# Garantir que frontend está buildado
npm run build

# Copiar para Android
npx cap sync android
```

---

### 🔐 Passo 7: Gerar Keystore (Assinatura)

**Por que precisa**: Google Play exige APKs assinados

```bash
# Criar keystore (GUARDE ESSAS SENHAS!)
cd /home/eloi/VITAS/frontend/android
keytool -genkey -v -keystore vitas-release.keystore \
  -alias vitas -keyalg RSA -keysize 2048 -validity 10000

# Perguntas que aparecerão:
# - Senha do keystore: [CRIAR UMA SENHA FORTE]
# - Nome e sobrenome: VITAS Servicos
# - Unidade organizacional: Tecnologia
# - Organização: VITAS
# - Cidade: Sao Paulo
# - Estado: SP
# - Código do país: BR
```

**⚠️ IMPORTANTE**: 
- Anote a senha em local seguro
- Nunca compartilhe o arquivo .keystore
- Se perder, não consegue atualizar o app na Play Store

---

### 🏗️ Passo 8: Configurar Assinatura Automática

**Criar**: `android/key.properties`

```properties
storePassword=SUA_SENHA_AQUI
keyPassword=SUA_SENHA_AQUI
keyAlias=vitas
storeFile=vitas-release.keystore
```

**⚠️ NUNCA COMMITAR `key.properties` NO GIT**

**Editar**: `android/app/build.gradle`

Adicionar antes de `android {`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... configurações existentes ...
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

### 📦 Passo 9: GERAR APK

```bash
cd /home/eloi/VITAS/frontend/android

# Gerar APK de release (assinado)
./gradlew assembleRelease

# APK estará em:
# android/app/build/outputs/apk/release/app-release.apk
```

**Ou gerar AAB (recomendado para Play Store)**:

```bash
./gradlew bundleRelease

# AAB estará em:
# android/app/build/outputs/bundle/release/app-release.aab
```

**Diferença**:
- **APK**: Arquivo instalável diretamente
- **AAB**: Android App Bundle, otimizado pela Play Store (menor download)

---

### ✅ Passo 10: Testar APK

**Opção 1: Emulador Android Studio**
```bash
# Instalar Android Studio primeiro
# Abrir AVD Manager
# Criar dispositivo virtual
# Arrastar APK para emulador
```

**Opção 2: Dispositivo Físico**
```bash
# Habilitar "Opções do desenvolvedor" no Android
# Ativar "Instalação via USB"
# Conectar celular via USB
adb install android/app/build/outputs/apk/release/app-release.apk
```

**Opção 3: Compartilhar APK**
```bash
# Copiar APK para Downloads
cp android/app/build/outputs/apk/release/app-release.apk ~/Downloads/vitas-v1.0.0.apk

# Enviar por Google Drive/Telegram/WhatsApp
# Instalar no celular (aceitar "Fontes desconhecidas")
```

---

## 🚀 PARTE 2: PUBLICAR NA GOOGLE PLAY STORE

### Passo 1: Criar Conta Google Play Console

**URL**: https://play.google.com/console/signup

**Requisitos**:
- Conta Google
- Taxa única de **$25 USD** (cartão de crédito)
- Documentos (CPF/CNPJ se empresa)

**Tempo**: Aprovação em 48 horas

---

### Passo 2: Criar Novo Aplicativo

1. Acesse: https://play.google.com/console
2. Clique "Criar app"
3. Preencha:
   - **Nome**: VITAS - Encontre o profissional certo
   - **Idioma padrão**: Português (Brasil)
   - **Tipo**: Aplicativo
   - **Gratuito ou pago**: Gratuito
   - **Aceitar termos**

---

### Passo 3: Preparar Assets da Play Store

#### 3A: Ícone do App
- **Tamanho**: 512x512px
- **Formato**: PNG 32-bit
- **Sem transparência**
- Upload em: "Presença na loja > Ícone do app"

#### 3B: Imagem de Recursos
- **Tamanho**: 1024x500px
- **Formato**: PNG ou JPG
- **Banner promocional** (opcional)

#### 3C: Screenshots (OBRIGATÓRIO)
**Mínimo 2, máximo 8 por tipo**:

**Telefone** (obrigatório):
- 16:9 ou 9:16
- Mínimo: 320px
- Máximo: 3840px
- Formatos: PNG, JPG

**Tablet 7"** (recomendado):
- Mesmas regras

**Sugestões de screenshots**:
1. Tela inicial (Landing)
2. Login
3. Lista de chamados
4. Detalhes de chamado
5. Lista de orçamentos
6. Checkout PIX
7. Avaliação de serviço

**Como tirar screenshots**:
```bash
# Opção 1: No emulador Android Studio
# Clicar no ícone de câmera

# Opção 2: No navegador (antes de gerar APK)
# Usar DevTools > Toggle device toolbar
# Definir dimensões: 1080x1920 (9:16)
# F12 > Ctrl+Shift+P > "Capture screenshot"
```

#### 3D: Descrição do App

**Título curto** (max 30 caracteres):
```
VITAS - Profissionais
```

**Descrição curta** (max 80 caracteres):
```
Encontre os melhores profissionais para sua casa em 1 clique
```

**Descrição completa** (max 4000 caracteres):
```
🏠 VITAS - Seu profissional ideal está aqui!

Precisa de um eletricista? Encanador? Pedreiro? Pintor?

Com o VITAS, você encontra profissionais verificados e avaliados pela comunidade em segundos!

⚡ COMO FUNCIONA
1. Descreva o serviço que precisa
2. Receba orçamentos de profissionais próximos
3. Compare preços e avaliações
4. Aprove e pague com segurança
5. Profissional realiza o serviço
6. Avalie a experiência

✅ POR QUE ESCOLHER O VITAS?
• Profissionais verificados com documentos
• Sistema de avaliações real
• Pagamento seguro via PIX
• Busca por localização (profissionais próximos)
• Garantia de 30 dias
• Suporte dedicado

🔒 SEGURANÇA
• Dados protegidos (LGPD)
• Pagamento retido até conclusão do serviço
• Profissionais com antecedentes checados
• Sistema de mediação de conflitos

💰 TRANSPARÊNCIA
• Compare múltiplos orçamentos
• Sem taxas escondidas
• Histórico completo de transações

📱 FUNCIONALIDADES
• Triagem automática por especialidade
• Notificações em tempo real
• Histórico de chamados
• Chat com profissionais
• Avaliações detalhadas

🛠️ SERVIÇOS DISPONÍVEIS
Elétrica, Hidráulica, Pintura, Alvenaria, Marcenaria, Jardinagem, Limpeza, Reformas, Reparos e muito mais!

Baixe agora e resolva seus problemas domésticos com praticidade!

Suporte: suporte@vitas.com.br
Site: http://31.97.64.250
```

---

### Passo 4: Configurar Classificação de Conteúdo

1. **Categorias**:
   - Violência: Nenhuma
   - Conteúdo sexual: Nenhum
   - Linguagem imprópria: Nenhuma
   - Álcool/drogas: Nenhum

2. **Público-alvo**: 18+ (por envolver transações financeiras)

3. **Questionário**: Responder perguntas sobre o app

---

### Passo 5: Política de Privacidade

**Obrigatório**: URL pública da política

**Usar**: http://31.97.64.250/politica-privacidade

---

### Passo 6: Upload do Aplicativo

**Opção A: Produção (Recomendado)**:
1. Ir em "Produção > Criar nova versão"
2. Upload do **AAB** (não APK)
3. Preencher "Notas da versão":
   ```
   Versão 1.0.0 - Lançamento inicial
   
   • Criação de chamados
   • Recebimento de orçamentos
   • Comparação de profissionais
   • Pagamento via PIX
   • Sistema de avaliações
   • Busca por localização
   ```

**Opção B: Teste Interno** (para validar primeiro):
1. "Teste interno > Criar nova versão"
2. Upload AAB
3. Adicionar emails de testadores
4. Testadores recebem link para instalar
5. Após testes, promover para produção

---

### Passo 7: Configurar Faixas de Países

1. **Países e regiões**:
   - Selecionar: Brasil
   - (Pode adicionar mais depois)

2. **Idiomas**:
   - Português (Brasil)

---

### Passo 8: Revisar e Publicar

**Checklist final**:
- ✅ Ícone 512x512
- ✅ Screenshots (mín 2)
- ✅ Descrições completas
- ✅ AAB uploadado
- ✅ Classificação de conteúdo
- ✅ Política de privacidade
- ✅ Preço: Gratuito
- ✅ Faixa de países: Brasil

**Submeter**:
1. Clicar "Revisar versão"
2. Resolver problemas (se houver)
3. Clicar "Iniciar lançamento para produção"

**Tempo de análise**: 
- Primeira submissão: 3-7 dias
- Atualizações: 1-3 dias

---

## 📊 PÓS-PUBLICAÇÃO

### Monitoramento

**Google Play Console > Painel**:
- Instalações diárias
- Desinstalações
- Avaliações de usuários
- Relatórios de falhas
- Estatísticas de uso

### Atualizações

**Incrementar versão**:
```gradle
// android/app/build.gradle
versionCode 2       // era 1
versionName "1.0.1" // era 1.0.0
```

**Processo**:
1. Fazer alterações no código
2. `npm run build`
3. `npx cap sync android`
4. `./gradlew bundleRelease`
5. Upload novo AAB na Play Console
6. Preencher "Notas da versão"
7. Publicar atualização

---

## 🆘 PROBLEMAS COMUNS

### "App não instalado"
**Causa**: Assinatura diferente  
**Solução**: Desinstalar versão anterior antes

### "Aplicativo não responde"
**Causa**: URL do backend inacessível  
**Solução**: Verificar `capacitor.config.ts`

### "Rejeitado pela Play Store"
**Causas comuns**:
- Política de privacidade inexistente/inválida
- Descrição com erros ortográficos
- Screenshots de baixa qualidade
- Falta de permissões declaradas

### Build falha
```bash
# Limpar cache
cd android
./gradlew clean

# Recriar build
./gradlew assembleRelease
```

---

## 📚 RECURSOS ÚTEIS

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Developer**: https://developer.android.com
- **Play Console Help**: https://support.google.com/googleplay/android-developer
- **cordova-res**: https://github.com/ionic-team/cordova-res
- **Icon Generator**: https://icon.kitchen

---

## ✅ CHECKLIST COMPLETO

**Desenvolvimento**:
- [ ] Capacitor instalado
- [ ] Plataforma Android adicionada
- [ ] Ícone 1024x1024 criado
- [ ] Splash screen criado
- [ ] Permissões configuradas
- [ ] Build sincronizado
- [ ] Keystore gerado e salvo
- [ ] APK/AAB gerado
- [ ] Testado em dispositivo

**Play Store**:
- [ ] Conta criada ($25 pago)
- [ ] App criado no console
- [ ] Ícone 512x512 uploaded
- [ ] Screenshots tirados (mín 2)
- [ ] Descrições preenchidas
- [ ] Classificação respondida
- [ ] Política de privacidade linkada
- [ ] AAB uploaded
- [ ] Países configurados
- [ ] Versão revisada
- [ ] Publicação iniciada

---

**Próximo passo**: Criar o ícone do app (1024x1024px) e colocar em `resources/icon.png`

Quer que eu te ajude a criar o ícone ou prefere fazer você mesmo?
