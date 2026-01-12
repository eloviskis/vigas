# Configuração Storage S3/DigitalOcean Spaces

## 📋 Opções de Storage

O sistema suporta dois tipos de storage:
1. **Local Filesystem** (padrão, atual)
2. **AWS S3 / DigitalOcean Spaces** (recomendado para produção)

## 🔧 Configuração S3/Spaces

### Opção 1: AWS S3

#### 1. Criar Bucket S3

1. Acesse [AWS Console](https://console.aws.amazon.com/s3/)
2. Clique em **Create bucket**
3. Configure:
   - **Bucket name**: `vitas-uploads` (ou outro nome único)
   - **Region**: `us-east-1` (ou mais próxima)
   - **Block Public Access**: Desmarque (precisamos de acesso público)
   - **Versioning**: Disabled (opcional)
4. Crie o bucket

#### 2. Configurar CORS

1. Vá para o bucket → **Permissions** → **CORS**
2. Adicione:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://vitas.app.br", "http://localhost:5173"],
    "ExposeHeaders": ["ETag"]
  }
]
```

#### 3. Criar IAM User

1. Acesse [IAM Console](https://console.aws.amazon.com/iam/)
2. **Users** → **Add user**
3. Nome: `vitas-s3-uploader`
4. **Attach policies directly**:
   - `AmazonS3FullAccess` (ou crie policy custom mais restritiva)
5. Crie o usuário
6. **Security credentials** → **Create access key**
7. Copie **Access Key ID** e **Secret Access Key**

### Opção 2: DigitalOcean Spaces (Mais barato)

#### 1. Criar Space

1. Acesse [DigitalOcean Spaces](https://cloud.digitalocean.com/spaces)
2. **Create a Space**
3. Configure:
   - **Datacenter region**: NYC3 (ou mais próximo)
   - **Space name**: `vitas-uploads`
   - **CDN**: Enable (recomendado)
4. Crie

#### 2. Configurar CORS

1. Vá para Space → **Settings** → **CORS**
2. Adicione regra:
   - **Origin**: `https://vitas.app.br`
   - **Methods**: GET, PUT, POST, DELETE
   - **Headers**: `*`

#### 3. Criar API Key

1. **API** → **Spaces access keys**
2. **Generate New Key**
3. Nome: `vitas-s3`
4. Copie **Access Key** e **Secret Key**

## 🔐 Variáveis de Ambiente

Backend `.env`:

### Para AWS S3:
```bash
# Storage Configuration
STORAGE_TYPE=s3
AWS_REGION=us-east-1
S3_BUCKET_NAME=vitas-uploads
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### Para DigitalOcean Spaces:
```bash
# Storage Configuration
STORAGE_TYPE=s3
AWS_REGION=nyc3
S3_BUCKET_NAME=vitas-uploads
AWS_ACCESS_KEY_ID=DO00ABCDEFGHIJ1234567
AWS_SECRET_ACCESS_KEY=xyz123abc456def789
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
```

### Para manter Local (padrão):
```bash
# Storage Configuration
STORAGE_TYPE=local
LOCAL_STORAGE_PATH=./uploads
```

## 🚀 Migração de Arquivos Locais para S3

Script para migrar arquivos existentes:

```bash
cd backend

# Criar script de migração
cat > migrate-to-s3.js << 'EOF'
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function migrateFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      await migrateFiles(filePath);
    } else {
      const fileContent = fs.readFileSync(filePath);
      const key = filePath.replace('./uploads/', '');
      
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileContent,
      }));
      
      console.log(`Migrated: ${key}`);
    }
  }
}

migrateFiles('./uploads').then(() => {
  console.log('Migration complete!');
});
EOF

# Executar migração
node migrate-to-s3.js
```

## 📊 Custos

### AWS S3

- **Storage**: $0.023/GB/mês (primeiros 50TB)
- **Transfer OUT**: $0.09/GB
- **Requests**: 
  - GET: $0.0004 por 1000 requests
  - PUT: $0.005 por 1000 requests

**Estimativa VITAS (100 usuários)**:
- 5GB storage: $0.12/mês
- 10GB transfer: $0.90/mês
- 10k requests: $0.05/mês
- **Total**: ~$1.10/mês

### DigitalOcean Spaces

- **Flat rate**: $5/mês
- Inclui:
  - 250GB storage
  - 1TB bandwidth
- **Mais barato** para volumes médios/altos

## 🔒 Segurança

### Bucket Policy (AWS S3)

Adicione em **Permissions** → **Bucket policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::vitas-uploads/*"
    }
  ]
}
```

### IAM Policy (recomendada, mais segura)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::vitas-uploads/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::vitas-uploads"
    }
  ]
}
```

## ✅ Testar Configuração

```typescript
// No backend
import { StorageService } from './storage/storage.service';

// Upload teste
const file = {
  buffer: Buffer.from('Hello S3!'),
  originalname: 'test.txt',
  mimetype: 'text/plain',
};

const result = await storageService.uploadFile(file, 'test');
console.log('Uploaded to:', result.url);
```

## 🐛 Troubleshooting

### Error: Access Denied

**Causa**: Credenciais inválidas ou permissões insuficientes

**Solução**: 
- Verifique `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`
- Confirme IAM policy

### CORS Error

**Causa**: CORS não configurado no bucket

**Solução**: Adicione configuração CORS (veja acima)

### Uploads lentos

**Causa**: Region distante ou conexão lenta

**Solução**: 
- Use region mais próxima (us-east-1 para Brasil)
- Ative CDN (CloudFront ou DigitalOcean CDN)

## 📝 Próximos Passos

- [ ] Configurar CDN CloudFront
- [ ] Lifecycle policy (deletar arquivos antigos)
- [ ] Backup automático
- [ ] Compressão de imagens (Sharp)
- [ ] Thumbnails automáticos
