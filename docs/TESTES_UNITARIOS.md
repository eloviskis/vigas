# Testes Unitários - Backend

## 📋 Visão Geral

Suíte de testes unitários para garantir qualidade e confiabilidade do código backend.

## 🧪 Tecnologias

- **Jest** - Framework de testes
- **@nestjs/testing** - Utilities para testar módulos NestJS
- **ts-jest** - Suporte TypeScript

## 📊 Coverage Atual

Os seguintes services possuem testes unitários:

### ✅ AuthService
- `login()` - Autenticação com credenciais válidas/inválidas
- `register()` - Criação de usuário com validação de email único
- `updateProfile()` - Atualização de perfil
- `changePassword()` - Troca de senha com validação
- `generateToken()` - Geração de JWT

### ✅ ChamadoService
- `create()` - Criação de chamado com validação de usuário
- `findAll()` - Listagem de chamados
- `findOne()` - Busca por ID
- `updateStatus()` - Atualização de status
- `delete()` - Exclusão de chamado
- `countByStatus()` - Contagem por status

### ✅ TriagemService
- `create()` - Criação de triagem com profissionais
- `findByChamado()` - Busca por chamado
- `updateProfissionais()` - Atualização de profissionais selecionados
- `countByUrgencia()` - Contagem por urgência

### ✅ PagamentoService
- `create()` - Criação de pagamento
- `confirmPayment()` - Confirmação de pagamento
- `findByOrcamento()` - Busca por orçamento
- `getTotalRevenue()` - Receita total
- `getAverageTicket()` - Ticket médio

## 🚀 Como Executar

### Todos os testes
```bash
cd backend
npm test
```

### Com coverage
```bash
npm test -- --coverage
```

### Modo watch (desenvolvimento)
```bash
npm test -- --watch
```

### Teste específico
```bash
npm test auth.service.spec.ts
```

## 📝 Estrutura de Testes

### Template Básico

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyService } from './my.service';
import { MyEntity } from './my.entity';

const createRepoMock = <T>() => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
}) as unknown as jest.Mocked<Repository<T>>;

describe('MyService', () => {
  let service: MyService;
  let repo: jest.Mocked<Repository<MyEntity>>;

  beforeEach(async () => {
    repo = createRepoMock<MyEntity>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyService,
        {
          provide: getRepositoryToken(MyEntity),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<MyService>(MyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of entities', async () => {
      const mockEntities = [{ id: '1' }, { id: '2' }] as MyEntity[];
      repo.find.mockResolvedValue(mockEntities);

      const result = await service.findAll();

      expect(result).toEqual(mockEntities);
      expect(repo.find).toHaveBeenCalled();
    });
  });
});
```

## 🔍 Boas Práticas

### 1. Arrange-Act-Assert (AAA)

```typescript
it('should create user', async () => {
  // Arrange
  const createDto = { email: 'test@example.com', nome: 'Test' };
  repo.save.mockResolvedValue({ id: '1', ...createDto });

  // Act
  const result = await service.create(createDto);

  // Assert
  expect(result.id).toBe('1');
  expect(repo.save).toHaveBeenCalledWith(createDto);
});
```

### 2. Testar Casos de Erro

```typescript
it('should throw NotFoundException when not found', async () => {
  repo.findOne.mockResolvedValue(null);

  await expect(service.findOne('123')).rejects.toThrow(NotFoundException);
});
```

### 3. Mockar Dependências

```typescript
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

// No módulo de teste
{
  provide: JwtService,
  useValue: mockJwtService,
}
```

### 4. Limpar Mocks

```typescript
afterEach(() => {
  jest.clearAllMocks(); // Limpa contadores de chamadas
});
```

## 📈 Meta de Coverage

| Métrica | Meta | Atual |
|---------|------|-------|
| Statements | >80% | 65% |
| Branches | >80% | 58% |
| Functions | >80% | 72% |
| Lines | >80% | 64% |

## 🐛 Debugging Testes

### Ver output detalhado
```bash
npm test -- --verbose
```

### Debugar com VSCode

`.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## 🔧 Configuração

`jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!main.ts',
    '!**/*.module.ts',
    '!**/*.entity.ts',
  ],
};
```

## 📝 Próximos Passos

- [ ] Aumentar coverage para >80% em todos os services
- [ ] Adicionar testes de integração (E2E)
- [ ] Implementar testes de performance
- [ ] CI/CD com bloqueio se coverage < 80%
- [ ] Testes de mutation (Stryker)

## 📚 Referências

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
