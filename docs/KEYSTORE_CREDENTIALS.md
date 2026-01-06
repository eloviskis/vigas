# VITAS - Credenciais de Assinatura Android

## 🔐 Keystore Gerado

**Arquivo**: `android/vitas-release.keystore`

**Detalhes**:
- **Alias**: vitas
- **Senha do keystore**: vitas2026
- **Senha da chave**: vitas2026
- **Algoritmo**: RSA 2048 bits
- **Validade**: 10.000 dias (~27 anos)

**Informações do certificado**:
```
CN=VITAS Servicos
OU=Tecnologia
O=VITAS
L=Sao Paulo
ST=SP
C=BR
```

---

## ⚠️ IMPORTANTE - GUARDAR EM LOCAL SEGURO

**NUNCA**:
- Compartilhar o arquivo .keystore
- Commitar no Git (já está no .gitignore)
- Perder a senha

**Se perder o keystore**:
- ❌ NÃO consegue atualizar o app na Play Store
- ❌ Precisa publicar como novo app
- ❌ Perde todos os downloads e avaliações

---

## 📱 Próximos Passos para Gerar APK

### Opção 1: Instalar Android Studio (Recomendado)

```bash
# Baixar Android Studio
# https://developer.android.com/studio

# Instalar e abrir
# Tools > SDK Manager
# Instalar:
#   - Android SDK Platform 34
#   - Android SDK Build-Tools 34
#   - Android SDK Platform-Tools
#   - Android SDK Command-line Tools

# Configurar ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Gerar APK
cd /home/eloi/VITAS/frontend/android
./gradlew assembleRelease

# APK estará em:
# app/build/outputs/apk/release/app-release.apk
```

### Opção 2: Usar Docker (Sem instalar Android Studio)

```bash
# Voltar para pasta do projeto
cd /home/eloi/VITAS/frontend

# Criar Dockerfile
cat > Dockerfile.android <<'EOF'
FROM openjdk:17-jdk-slim

# Instalar dependências
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Instalar Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    cd $ANDROID_HOME/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
    unzip commandlinetools-linux-11076708_latest.zip && \
    rm commandlinetools-linux-11076708_latest.zip && \
    mv cmdline-tools latest

# Aceitar licenças
RUN yes | sdkmanager --licenses

# Instalar componentes necessários
RUN sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

WORKDIR /app
EOF

# Build da imagem Docker
docker build -f Dockerfile.android -t android-builder .

# Gerar APK usando Docker
docker run --rm -v $(pwd)/android:/app android-builder \
  bash -c "cd /app && ./gradlew assembleRelease"
```

### Opção 3: EAS Build (Expo) - Cloud Build

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar build
eas build:configure

# Build na nuvem (grátis até certo limite)
eas build --platform android
```

### Opção 4: GitHub Actions (CI/CD Automático)

Criar `.github/workflows/android-build.yml`:

```yaml
name: Android Build

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build frontend
        run: |
          cd frontend
          npm run build
      
      - name: Sync Capacitor
        run: |
          cd frontend
          npx cap sync android
      
      - name: Build APK
        run: |
          cd frontend/android
          chmod +x gradlew
          ./gradlew assembleRelease
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release
          path: frontend/android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 Qual Opção Usar?

**Para DESENVOLVIMENTO**:
- ✅ **Opção 1** (Android Studio): Melhor para desenvolvimento contínuo

**Para BUILD ÚNICO**:
- ✅ **Opção 2** (Docker): Não precisa instalar nada permanente
- ✅ **Opção 3** (EAS): Mais fácil, build na nuvem

**Para AUTOMAÇÃO**:
- ✅ **Opção 4** (GitHub Actions): Build automático a cada commit

---

## 📊 Status Atual

✅ **Completo**:
- Capacitor configurado
- Plataforma Android adicionada
- Ícones gerados (74 arquivos)
- Splash screens criados
- Keystore gerado
- Build.gradle configurado com assinatura
- Frontend buildado e sincronizado

⏳ **Pendente**:
- Android SDK instalado
- Gerar APK/AAB

---

## 🚀 Recomendação

Escolha uma das opções acima. Se preferir a mais rápida:

**Opção Docker** (5-10 minutos):
```bash
# Criar Dockerfile.android conforme acima
docker build -f Dockerfile.android -t android-builder .
docker run --rm -v $(pwd)/android:/app android-builder \
  bash -c "cd /app && ./gradlew assembleRelease"
```

**Ou** vou criar um script que faz tudo automaticamente?
