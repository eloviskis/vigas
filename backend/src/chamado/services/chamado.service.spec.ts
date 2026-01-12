import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChamadoService } from './chamado.service';
import { Chamado, ChamadoStatus } from '../entities/chamado.entity';
import { HistoricoService } from './historico.service';

const createRepoMock = <T>() => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
}) as unknown as jest.Mocked<Repository<T>>;

describe('ChamadoService', () => {
  let service: ChamadoService;
  let repo: jest.Mocked<Repository<Chamado>>;
  let historico: HistoricoService;

  beforeEach(async () => {
    repo = createRepoMock<Chamado>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChamadoService,
        { provide: getRepositoryToken(Chamado), useValue: repo },
        {
          provide: HistoricoService,
          useValue: {
            registrarSistema: jest.fn(),
            registrarStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ChamadoService);
    historico = module.get(HistoricoService);
  });

  it('cria chamado e registra histórico', async () => {
    const criado = { id: 'c1' } as Chamado;
    (repo.create as any).mockReturnValue(criado);
    (repo.save as any).mockResolvedValue(criado);

    const res = await service.criar({ contexto: 'hidraulica', descricao: 'vazamento' } as any);

    expect(res.id).toBe('c1');
    expect(historico.registrarSistema).toHaveBeenCalledWith('c1', 'Chamado criado', expect.any(Object));
  });

  it('altera status e registra histórico', async () => {
    const chamado = { id: 'c2', status: ChamadoStatus.ABERTO } as Chamado;
    (repo.findOne as any).mockResolvedValue(chamado);
    (repo.save as any).mockImplementation((c: any) => Promise.resolve(c));

    const res = await service.mudarStatus('c2', ChamadoStatus.TRIADO, 'andamento');

    expect(res.status).toBe(ChamadoStatus.TRIADO);
    expect(historico.registrarStatus).toHaveBeenCalledWith('c2', 'andamento', expect.any(Object));
  });
});
