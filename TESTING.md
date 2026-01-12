# Guia de Testes - VITAS

## Estrutura de Testes

### 1. Testes Unitários (Frontend - Vitest)

Localização: `frontend/src/__tests__/`

Componentes testados:
- **Login.test.tsx**: Validação de formulário, autenticação, erro de credenciais
- **ChamadoList.test.tsx**: Renderização de lista, filtros, navegação
- **Checkout.test.tsx**: Seleção de método de pagamento, geração de QR code
- **useAuthStore.test.ts**: Login/logout, restauração de sessão, validação de token

Executar testes unitários:

```bash
cd frontend

# Modo normal
npm test

# Modo watch (reexecuta ao salvar)
npm test:watch

# Com cobertura de código
npm test:coverage

# Interface gráfica
npm test:ui
```

### 2. Testes E2E (Playwright)

Localização: `frontend/e2e/`

Cenários testados:
- **Login**: Cliente entra no sistema
- **Criar Chamado**: Cliente cria novo chamado com contexto
- **Triagem**: Operador seleciona profissional adequado
- **Checkout PIX**: Cliente realiza pagamento com PIX
- **Admin Pagamentos**: Admin gerencia pagamentos e estornos

Executar E2E:

```bash
cd frontend

# Modo normal (headless)
npm run test:e2e

# Modo UI interativo
npm run test:e2e:ui

# Modo debug (passo a passo)
npm run test:e2e:debug
```

### 3. Testes Unitários (Backend - Jest)

Localização: `backend/src/**/*.spec.ts`

Cobertura:
- `auth.service.spec.ts`: Login, registro, JWT
- `chamado.service.spec.ts`: Criação, histórico, mudança de status
- `triagem.service.spec.ts`: Matching de profissionais, confiança
- `pagamento.service.spec.ts`: Criação, webhook, estorno

Executar testes backend:

```bash
cd backend

# Todos os testes
npm test

# Modo watch
npm test -- --watch

# Com cobertura
npm test -- --coverage

# Teste específico
npm test -- auth.service.spec
```

## Estrutura de Testes Frontend

### Padrão de Teste

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  });

  it('deve fazer algo específico', () => {
    // Arrange
    const component = render(<Component />);

    // Act
    fireEvent.click(component.getByRole('button'));

    // Assert
    expect(component.getByText('expected')).toBeInTheDocument();
  });
});
```

### Mocks Automáticos

Serviços mockados automaticamente:
- `authService`: Login, logout, validação
- `chamadoService`: CRUD de chamados
- `pagamentoService`: Processamento de pagamentos
- `firebaseService`: Notificações push

### Coverage Target

Objetivo: **≥70% cobertura**

Incluindo:
- Statements: 70%+
- Branches: 65%+
- Functions: 70%+
- Lines: 70%+

## Performance & Web Vitals

Monitoramento automático:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

Ver métricas em: `frontend/src/utils/performance.ts`

## Otimizações Implementadas

### Code Splitting
- Lazy loading de rotas com `React.lazy()`
- Chunk separado para dependências

### Image Lazy Loading
- `useLazyImage()` hook com Intersection Observer
- Componente `<LazyImage>` otimizado

### Caching
- Service Worker para assets estáticos
- Cache-first para JS/CSS/Fonts
- Network-first para API calls
- Local Storage para dados do usuário

## CI/CD Integration

Testes são executados automaticamente no:
1. **Push**: Todos os testes unitários
2. **Pull Request**: E2E + cobertura
3. **Merge**: Deploy após sucesso

Logs disponíveis em: `.github/workflows/`

## Troubleshooting

### Testes falhando?

1. Verificar se `npm install` foi executado em ambos os diretórios
2. Limpar cache: `npm test -- --clearCache`
3. Verificar se backend está rodando (para E2E)

### Performance baixa?

1. Rodar `npm run build` para simular produção
2. Verificar bundle size: `npm run build -- --analyze`
3. Usar Chrome DevTools para profile

## Próximos Passos

- [ ] Adicionar visual regression testing
- [ ] Setup de performance monitoring em produção
- [ ] Aumentar cobertura para 80%+
- [ ] Adicionar testes de acessibilidade (a11y)
