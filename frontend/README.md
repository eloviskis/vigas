# VITAS Frontend

Frontend em React + Vite para VITAS - Sistema de Gestão de Chamados e Agendamento de Profissionais.

## 📋 Estructura do Projeto

```
frontend/
├── src/
│   ├── pages/              # Páginas da aplicação
│   │   ├── Landing.tsx      # Landing page pública
│   │   ├── auth/            # Páginas de autenticação
│   │   ├── chamado/         # Fluxo de chamados (cliente)
│   │   ├── dashboard/       # Dashboards
│   │   └── admin/           # Fluxo de operador
│   ├── components/          # Componentes reutilizáveis
│   ├── services/            # API client e serviços
│   ├── stores/              # Zustand stores (state management)
│   ├── layouts/             # Layouts base
│   ├── styles/              # CSS global
│   ├── types/               # TypeScript types
│   ├── App.tsx              # Roteamento principal
│   └── main.tsx             # Entry point
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## 🚀 Quick Start

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesso em: http://localhost:5173

O frontend usa proxy para `/api` → http://localhost:3000/api

### Build para Produção

```bash
npm run build
```

Output em `dist/`

### Preview da Build

```bash
npm run preview
```

## 🔧 Configuração

### Variáveis de Ambiente

Criar arquivo `.env.local`:

```
VITE_API_URL=http://localhost:3000/api
```

## 📱 Fluxos Implementados

### 1. Landing Page (Pública)
- Hero section com CTA
- Seção "Como funciona" (3 steps)
- Features
- CTA final
- Footer

**Rota**: `/`

### 2. Autenticação
- Login com email/senha
- Validação com Zod
- Armazenamento de token em localStorage
- Proteção de rotas

**Rota**: `/login`

### 3. Dashboard Cliente
- Listar meus chamados
- Criar novo chamado
- Ver detalhes e timeline
- Confirmar/cancelar agendamentos

**Rotas**:
- `/chamados` - Listar
- `/chamados/new` - Criar
- `/chamados/:id` - Detalhes

### 4. Dashboard Operador
- Listar chamados abertos
- Executar triagem automática
- Visualizar resultado
- Agendar com profissional

**Rotas**:
- `/admin` - Dashboard
- `/admin/chamados/:id/triagem` - Executar triagem
- `/admin/chamados/:id/agendamento` - Agendar

## 🔌 API Integration

Todos os serviços estão em `src/services/`:

- `authService.ts` - Login/Logout
- `chamadoService.ts` - Chamados e histórico
- `profissionalService.ts` - Profissionais
- `triagemService.ts` - Triagem
- `agendamentoService.ts` - Slots e agendamentos

**Exemplo de uso:**

```typescript
import { chamadoService } from '@/services/chamadoService'

const chamados = await chamadoService.listarPorUsuario(usuarioId)
```

## 🛡️ Autenticação

Token JWT armazenado em localStorage e enviado em todas as requisições.

**Interceptor automático:**
- ✅ Adiciona `Authorization: Bearer {token}`
- ✅ Redireciona para `/login` se 401

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS
- **Responsive design** - Mobile-first
- **Cores**: Blue (#2563eb) como primary

### Customizar cores:

Editar `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#2563eb',
    },
  },
}
```

## 📦 Dependencies

| Package | Propósito |
|---------|-----------|
| `react` | Library principal |
| `react-router-dom` | Roteamento |
| `axios` | HTTP client |
| `zustand` | State management (auth) |
| `react-hook-form` | Forms |
| `zod` | Validação |
| `tailwindcss` | Styling |

## ✅ TODO

### Phase 1 (MVP)
- [ ] Integração completa com API
- [ ] Notificações toast (react-toastify)
- [ ] Loading states em todos endpoints
- [ ] Error handling completo
- [ ] Validações em tempo real

### Phase 2
- [ ] Filtros avançados
- [ ] Paginação
- [ ] WebSocket para real-time
- [ ] Dark mode
- [ ] Analytics

### Phase 3
- [ ] Ratings & reviews
- [ ] Chat em tempo real
- [ ] Geolocalização
- [ ] Payment integration

## 🧪 Testes

```bash
npm run test
```

## 📝 Licença

MIT
