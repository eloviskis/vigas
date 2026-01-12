import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagamentoService } from './pagamento.service';
import { MercadoPagoService } from './mercado-pago.service';
import { Pagamento, StatusPagamento, MetodoPagamento } from '../entities/pagamento.entity';
import { Orcamento } from '../../orcamento/entities/orcamento.entity';

const createRepoMock = <T>() => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
}) as unknown as jest.Mocked<Repository<T>>;

describe('PagamentoService', () => {
  let service: PagamentoService;
  let pagamentoRepo: jest.Mocked<Repository<Pagamento>>;
  let orcamentoRepo: jest.Mocked<Repository<Orcamento>>;
  let mpService: MercadoPagoService;

  beforeEach(async () => {
    pagamentoRepo = createRepoMock<Pagamento>();
    orcamentoRepo = createRepoMock<Orcamento>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagamentoService,
        {
          provide: getRepositoryToken(Pagamento),
          useValue: pagamentoRepo,
        },
        {
          provide: getRepositoryToken(Orcamento),
          useValue: orcamentoRepo,
        },
        {
          provide: MercadoPagoService,
          useValue: {
            criarPagamentoPix: jest.fn(),
            obterPagamento: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PagamentoService>(PagamentoService);
    mpService = module.get<MercadoPagoService>(MercadoPagoService);
  });

  it('deve iniciar pagamento PIX com mock quando MP não disponível', async () => {
    const orcamento: Partial<Orcamento> = {
      id: 'ORC123',
      profissionalId: '1',
      status: 'APROVADO' as any,
      valorTotal: 100,
    };

    (orcamentoRepo.findOne as any).mockResolvedValue(orcamento);
    (pagamentoRepo.findOne as any).mockResolvedValue(null);
    (pagamentoRepo.create as any).mockImplementation((data: any) => ({ id: 10, ...data }));
    (pagamentoRepo.save as any).mockImplementation((data: any) => Promise.resolve(data));
    (mpService.criarPagamentoPix as any).mockResolvedValue(null);

    const pagamento = await service.iniciarPagamento({
      orcamentoId: 'ORC123',
      metodoPagamento: MetodoPagamento.PIX,
    } as any);

    expect(pagamento.status).toBe(StatusPagamento.PENDENTE);
    expect(pagamento.valorPlataforma).toBe(12); // 12%
    expect(pagamento.valorProfissional).toBe(88);
    expect(pagamento.pixQrCodeData).toBeDefined();
    expect(pagamento.pixQrCode).toBeDefined();
  });

  it('deve iniciar pagamento PIX via Mercado Pago quando disponível', async () => {
    const orcamento: Partial<Orcamento> = {
      id: 'ORC999',
      profissionalId: '2',
      status: 'APROVADO' as any,
      valorTotal: 150,
    };

    (orcamentoRepo.findOne as any).mockResolvedValue(orcamento);
    (pagamentoRepo.findOne as any).mockResolvedValue(null);
    (pagamentoRepo.create as any).mockImplementation((data: any) => ({ id: 20, ...data }));
    (pagamentoRepo.save as any).mockImplementation((data: any) => Promise.resolve(data));
    (mpService.criarPagamentoPix as any).mockResolvedValue({
      id: 'mp-123',
      status: 'pending',
      point_of_interaction: {
        transaction_data: {
          qr_code: 'QR-DATA',
          qr_code_base64: 'BASE64IMAGE',
        },
      },
    });

    const pagamento = await service.iniciarPagamento({
      orcamentoId: 'ORC999',
      metodoPagamento: MetodoPagamento.PIX,
      email: 'user@example.com',
      cpf: '12345678901',
    } as any);

    expect(pagamento.mercadoPagoId).toBe('mp-123');
    expect(pagamento.pixQrCodeData).toBe('QR-DATA');
    expect(pagamento.pixQrCode).toBe('BASE64IMAGE');
  });
});
