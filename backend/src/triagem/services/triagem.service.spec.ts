import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TriagemService } from './triagem.service';
import { Triagem, TriagemResultado, TriagemTipo } from '../entities/triagem.entity';
import { Chamado } from '../../chamado/entities/chamado.entity';
import { ProfissionalService } from '../../profissional/services/profissional.service';
import { HistoricoService } from '../../chamado/services/historico.service';

const createRepoMock = <T>() => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
}) as unknown as jest.Mocked<Repository<T>>;

describe('TriagemService', () => {
  let service: TriagemService;
  let triagemRepo: jest.Mocked<Repository<Triagem>>;
  let chamadoRepo: jest.Mocked<Repository<Chamado>>;
  let profService: ProfissionalService;
  let historicoService: HistoricoService;

  beforeEach(async () => {
    triagemRepo = createRepoMock<Triagem>();
    chamadoRepo = createRepoMock<Chamado>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TriagemService,
        { provide: getRepositoryToken(Triagem), useValue: triagemRepo },
        { provide: getRepositoryToken(Chamado), useValue: chamadoRepo },
        {
          provide: ProfissionalService,
          useValue: { listarAtivos: jest.fn(), obterPorId: jest.fn() },
        },
        {
          provide: HistoricoService,
          useValue: { registrarTriagem: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(TriagemService);
    profService = module.get(ProfissionalService);
    historicoService = module.get(HistoricoService);
  });

  it('retorna SEM_PROFISSIONAL quando não há profissionais', async () => {
    (chamadoRepo.findOne as any).mockResolvedValue({ id: 'c1', contexto: 'hidraulica' });
    (profService.listarAtivos as any).mockResolvedValue([]);
    (triagemRepo.create as any).mockImplementation((d: any) => d);
    (triagemRepo.save as any).mockImplementation((d: any) => Promise.resolve({ id: 't1', ...d }));

    const triagem = await service.realizar({ chamadoId: 'c1', critérios: {} } as any);

    expect(triagem.resultado).toBe(TriagemResultado.SEM_PROFISSIONAL);
    expect(historicoService.registrarTriagem).toHaveBeenCalled();
  });

  it('calcula confiança considerando score/distância', async () => {
    (chamadoRepo.findOne as any).mockResolvedValue({ id: 'c2', contexto: 'eletrica' });
    (profService.listarAtivos as any).mockResolvedValue([
      { id: 'p1', nome: 'Top', score: 4.9, distancia: 1 },
      { id: 'p2', nome: 'Segundo', score: 4.5, distancia: 2 },
    ]);
    (triagemRepo.create as any).mockImplementation((d: any) => d);
    (triagemRepo.save as any).mockImplementation((d: any) => Promise.resolve({ id: 't2', ...d }));

    const triagem = await service.realizar({ chamadoId: 'c2', tipo: TriagemTipo.AUTOMATICA } as any);

    expect(triagem.resultado).toBe(TriagemResultado.MULTIPLAS_OPCOES);
    expect(triagem.confiança).toBeGreaterThanOrEqual(75);
    expect(triagem.opcoesProfissionais?.length).toBe(2);
  });
});
