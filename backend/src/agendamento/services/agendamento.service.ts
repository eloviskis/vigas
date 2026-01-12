import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento, AgendamentoStatus } from '../entities/agendamento.entity';
import { CriarAgendamentoDto, ConfirmarAgendamentoDto, CancelarAgendamentoDto } from '../dtos/agendamento.dto';
import { Chamado } from '../../chamado/entities/chamado.entity';
import { SlotService } from './slot.service';
import { HistoricoService } from '../../chamado/services/historico.service';

@Injectable()
export class AgendamentoService {
  constructor(
    @InjectRepository(Agendamento)
    private agendamentoRepository: Repository<Agendamento>,
    @InjectRepository(Chamado)
    private chamadoRepository: Repository<Chamado>,
    private slotService: SlotService,
    private historicoService: HistoricoService,
  ) {}

  async agendar(dto: CriarAgendamentoDto): Promise<Agendamento> {
    // Validar chamado
    const chamado = await this.chamadoRepository.findOne({
      where: { id: dto.chamadoId },
    });

    if (!chamado) {
      throw new NotFoundException(`Chamado ${dto.chamadoId} não encontrado`);
    }

    // Validar se já existe agendamento pendente/confirmado
    const agendamentoExistente = await this.agendamentoRepository.findOne({
      where: {
        chamadoId: dto.chamadoId,
        status: 'CONFIRMADO' as any,
      },
    });

    if (agendamentoExistente) {
      throw new BadRequestException(`Chamado ${dto.chamadoId} já possui agendamento confirmado`);
    }

    // Criar agendamento
    const agendamento = this.agendamentoRepository.create(dto);
    agendamento.status = AgendamentoStatus.PENDENTE;

    const agendamentoSalvo = await this.agendamentoRepository.save(agendamento);

    // Marcar slot como ocupado se fornecido
    if (dto.slotId) {
      try {
        await this.slotService.marcarComoOcupado(dto.slotId, agendamentoSalvo.id);
      } catch (error) {
        // Se falhar ao marcar slot, deletar agendamento
        await this.agendamentoRepository.remove(agendamentoSalvo);
        throw error;
      }
    }

    // Log na timeline
    await this.historicoService.registrarAgendamento(
      dto.chamadoId,
      `Agendamento criado com profissional para ${dto.dataHora.toLocaleString()}`,
      {
        agendamento_id: agendamentoSalvo.id,
        profissional_id: dto.profissionalId,
        data_hora: dto.dataHora,
      },
    );

    return agendamentoSalvo;
  }

  async confirmar(agendamentoId: string, dto: ConfirmarAgendamentoDto): Promise<Agendamento> {
    const agendamento = await this.obterPorId(agendamentoId);

    if (agendamento.status !== AgendamentoStatus.PENDENTE) {
      throw new BadRequestException(
        `Agendamento ${agendamentoId} não pode ser confirmado (status: ${agendamento.status})`,
      );
    }

    agendamento.status = AgendamentoStatus.CONFIRMADO;
    agendamento.confirmadoEm = new Date();

    const agendamentoAtualizado = await this.agendamentoRepository.save(agendamento);

    // Log na timeline
    await this.historicoService.registrarAgendamento(
      agendamento.chamadoId,
      `Agendamento confirmado para ${agendamento.dataHora.toLocaleString()}`,
      {
        agendamento_id: agendamentoId,
        confirmado_em: agendamentoAtualizado.confirmadoEm,
      },
    );

    return agendamentoAtualizado;
  }

  async cancelar(agendamentoId: string, dto: CancelarAgendamentoDto): Promise<Agendamento> {
    const agendamento = await this.obterPorId(agendamentoId);

    if ([AgendamentoStatus.CONCLUIDO, AgendamentoStatus.CANCELADO].includes(agendamento.status)) {
      throw new BadRequestException(
        `Agendamento ${agendamentoId} não pode ser cancelado (status: ${agendamento.status})`,
      );
    }

    agendamento.status = AgendamentoStatus.CANCELADO;
    agendamento.canceladoEm = new Date();
    agendamento.motivoCancelamento = dto.motivo;

    const agendamentoAtualizado = await this.agendamentoRepository.save(agendamento);

    // Liberar slot se estava ocupado
    if (agendamento.slotId) {
      try {
        await this.slotService.marcarComoDisponivel(agendamento.slotId);
      } catch (error) {
        // Log mas não falha o cancelamento
        console.error('Erro ao liberar slot:', error);
      }
    }

    // Log na timeline
    await this.historicoService.registrarAgendamento(
      agendamento.chamadoId,
      `Agendamento cancelado: ${dto.motivo}`,
      {
        agendamento_id: agendamentoId,
        motivo: dto.motivo,
      },
    );

    return agendamentoAtualizado;
  }

  async obterPorId(id: string): Promise<Agendamento> {
    const agendamento = await this.agendamentoRepository.findOne({
      where: { id },
      relations: ['chamado', 'profissional', 'slot'],
    });

    if (!agendamento) {
      throw new NotFoundException(`Agendamento ${id} não encontrado`);
    }

    return agendamento;
  }

  async obterPorChamado(chamadoId: string): Promise<Agendamento | null> {
    return this.agendamentoRepository.findOne({
      where: { chamadoId },
      relations: ['profissional', 'slot'],
      order: { criadoEm: 'DESC' },
    });
  }

  async listarPendentesDeConfirmacao(limite: number = 20): Promise<Agendamento[]> {
    return this.agendamentoRepository.find({
      where: { status: AgendamentoStatus.PENDENTE },
      relations: ['chamado', 'profissional'],
      order: { dataHora: 'ASC' },
      take: limite,
    });
  }

  async iniciarAtendimento(agendamentoId: string): Promise<Agendamento> {
    const agendamento = await this.obterPorId(agendamentoId);

    if (agendamento.status !== AgendamentoStatus.CONFIRMADO) {
      throw new BadRequestException(
        `Agendamento ${agendamentoId} não pode ser iniciado (status: ${agendamento.status})`,
      );
    }

    agendamento.status = AgendamentoStatus.EM_ATENDIMENTO;
    agendamento.inicioAtendimento = new Date();

    return await this.agendamentoRepository.save(agendamento);
  }

  async concluirAtendimento(agendamentoId: string): Promise<Agendamento> {
    const agendamento = await this.obterPorId(agendamentoId);

    if (agendamento.status !== AgendamentoStatus.EM_ATENDIMENTO) {
      throw new BadRequestException(
        `Agendamento ${agendamentoId} não está em atendimento`,
      );
    }

    agendamento.status = AgendamentoStatus.CONCLUIDO;
    agendamento.fimAtendimento = new Date();

    const agendamentoAtualizado = await this.agendamentoRepository.save(agendamento);

    // Log na timeline
    await this.historicoService.registrarAgendamento(
      agendamento.chamadoId,
      `Atendimento concluído em ${agendamentoAtualizado.fimAtendimento?.toLocaleString() || 'agora'}`,
      {
        agendamento_id: agendamentoId,
        duracao_minutos: agendamento.duracao,
      },
    );

    return agendamentoAtualizado;
  }
}
