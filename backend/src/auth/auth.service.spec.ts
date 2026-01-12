import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

const createRepoMock = <T>() => ({
  count: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
}) as unknown as jest.Mocked<Repository<T>>;

describe('AuthService', () => {
  let service: AuthService;
  let repo: jest.Mocked<Repository<User>>;
  let jwt: JwtService;

  beforeEach(async () => {
    repo = createRepoMock<User>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token-123'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('deve autenticar usuário válido', async () => {
    const user = {
      id: 'u1',
      email: 'user@example.com',
      role: 'cliente',
      nome: 'User',
      comparePassword: jest.fn().mockResolvedValue(true),
    } as any;

    (repo.findOne as any).mockResolvedValue(user);

    const result = await service.login('user@example.com', '123456');

    expect(result.token).toBe('token-123');
    expect(result.user.email).toBe('user@example.com');
    expect(jwt.signAsync).toHaveBeenCalledWith({ sub: 'u1', email: 'user@example.com', role: 'cliente' });
  });

  it('deve rejeitar credenciais inválidas', async () => {
    (repo.findOne as any).mockResolvedValue(null);

    await expect(service.login('x', 'y')).rejects.toThrow('Credenciais inválidas');
  });

  it('deve registrar usuário novo', async () => {
    (repo.findOne as any).mockResolvedValueOnce(null);
    const created: any = { hashPassword: jest.fn(), id: 'new', email: 'novo@example.com', role: 'cliente', nome: 'Novo' };
    (repo.create as any).mockReturnValue(created);
    (repo.save as any).mockResolvedValue(created);

    const res = await service.register('novo@example.com', '123', 'Novo', 'cliente');

    expect(repo.create).toHaveBeenCalled();
    expect(created.hashPassword).toHaveBeenCalled();
    expect(res.token).toBe('token-123');
    expect(res.user.email).toBe('novo@example.com');
  });
});
