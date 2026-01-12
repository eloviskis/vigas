import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FollowupService } from './followup.service';
import { Followup, FollowupStatus, FollowupTipo } from '../entities/followup.entity';
import { NotFoundException } from '@nestjs/common';

describe('FollowupService', () => {
  let service: FollowupService;
  let mockRepository: any;

  const mockFollowup: Followup = {
    id: '1',
    agendamentoId: 'agd-123',
    tipo: FollowupTipo.CONFIRMACAO,
    status: FollowupStatus.PENDENTE,
    mensagem: 'Confirme seu agendamento',
    avaliacaoGeral: null,
    avaliacaoProfissional: null,
    resposta: null,
    comentarios: null,
    criadoEm: new Date(),
    dataEnvio: null,
    dataResposta: null,
    agendamento: null,
    usuario: null,
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockReturnValue(mockFollowup),
      save: jest.fn().mockResolvedValue(mockFollowup),
      findOne: jest.fn().mockResolvedValue(mockFollowup),
      find: jest.fn().mockResolvedValue([mockFollowup]),
      count: jest.fn().mockResolvedValue(1),
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ media: 4.5 }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowupService,
        {
          provide: getRepositoryToken(Followup),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FollowupService>(FollowupService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('criar', () => {
    it('deve criar um novo followup', async () => {
      const dto = {
        agendamentoId: 'agd-123',
        tipo: FollowupTipo.CONFIRMACAO,
        mensagem: 'Confirme seu agendamento',
      };

      const result = await service.criar(dto as any);

      expect(mockRepository.create).toHaveBeenCalledWith({
        agendamentoId: dto.agendamentoId,
        tipo: dto.tipo,
        mensagem: dto.mensagem,
        status: FollowupStatus.PENDENTE,
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockFollowup);
    });
  });

  describe('enviar', () => {
    it('deve atualizar status para ENVIADO', async () => {
      const result = await service.enviar('1');

      expect(result.status).toEqual(FollowupStatus.ENVIADO);
      expect(result.dataEnvio).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('responder', () => {
    it('deve registrar resposta e avaliações', async () => {
      const dto = {
        resposta: 'Confirmado',
        avaliacaoGeral: 5,
        avaliacaoProfissional: 4,
        comentarios: 'Ótimo serviço',
      };

      const result = await service.responder('1', dto as any);

      expect(result.status).toEqual(FollowupStatus.RESPONDIDO);
      expect(result.avaliacaoGeral).toEqual(5);
      expect(result.avaliacaoProfissional).toEqual(4);
      expect(result.dataResposta).toBeDefined();
    });
  });

  describe('obterPorId', () => {
    it('deve retornar um followup', async () => {
      const result = await service.obterPorId('1');
      expect(result).toEqual(mockFollowup);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['agendamento', 'usuario'],
      });
    });

    it('deve lançar NotFoundException se não encontrar', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.obterPorId('invalid')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('listarPorAgendamento', () => {
    it('deve retornar lista de followups', async () => {
      const result = await service.listarPorAgendamento('agd-123');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { agendamentoId: 'agd-123' },
        order: { criadoEm: 'DESC' },
      });
      expect(result).toEqual([mockFollowup]);
    });
  });

  describe('obterMetricas', () => {
    it('deve retornar métricas de followups', async () => {
      mockRepository.count.mockResolvedValueOnce(10); // total
      mockRepository.count.mockResolvedValueOnce(8); // respondidos

      const result = await service.obterMetricas();

      expect(result.totalFollowups).toEqual(10);
      expect(result.respondidos).toEqual(8);
      expect(result.taxaResposta).toEqual(80);
      expect(result.avaliacaoMedia).toEqual(4.5);
    });
  });
});
