import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { Slot } from '../entities/slot.entity';
import { CriarSlotDto, AtualizarSlotDisponibilidadeDto } from '../dtos/slot.dto';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
  ) {}

  async criar(dto: CriarSlotDto): Promise<Slot> {
    // Validar se slot não sobrepõe outro
    const slotExistente = await this.slotRepository.findOne({
      where: {
        profissionalId: dto.profissionalId,
        dataHora: dto.dataHora,
      },
    });

    if (slotExistente) {
      throw new BadRequestException(
        `Slot já existe para profissional ${dto.profissionalId} em ${dto.dataHora}`,
      );
    }

    const slot = this.slotRepository.create(dto);
    return await this.slotRepository.save(slot);
  }

  async criarEmLote(
    profissionalId: string,
    dataInicio: Date,
    dataFim: Date,
    intervaloMinutos: number = 60,
  ): Promise<Slot[]> {
    const slots: Slot[] = [];
    let data = new Date(dataInicio);

    while (data < dataFim) {
      const slotExistente = await this.slotRepository.findOne({
        where: {
          profissionalId,
          dataHora: data,
        },
      });

      if (!slotExistente) {
        const slot = this.slotRepository.create({
          profissionalId,
          dataHora: new Date(data),
          duracao: intervaloMinutos,
          disponivel: true,
        });

        slots.push(await this.slotRepository.save(slot));
      }

      data.setMinutes(data.getMinutes() + intervaloMinutos);
    }

    return slots;
  }

  async listarDisponiveisPorProfissional(
    profissionalId: string,
    dataInicio: Date,
    dataFim: Date,
  ): Promise<Slot[]> {
    return this.slotRepository.find({
      where: {
        profissionalId,
        disponivel: true,
        dataHora: Between(dataInicio, dataFim),
      },
      order: { dataHora: 'ASC' },
    });
  }

  async obterPorId(id: string): Promise<Slot> {
    const slot = await this.slotRepository.findOne({
      where: { id },
      relations: ['profissional'],
    });

    if (!slot) {
      throw new NotFoundException(`Slot ${id} não encontrado`);
    }

    return slot;
  }

  async marcarComoOcupado(slotId: string, agendamentoId: string): Promise<Slot> {
    const slot = await this.obterPorId(slotId);

    if (!slot.disponivel) {
      throw new BadRequestException(`Slot ${slotId} não está disponível`);
    }

    slot.disponivel = false;
    slot.agendamentoId = agendamentoId;
    return await this.slotRepository.save(slot);
  }

  async marcarComoDisponivel(slotId: string): Promise<Slot> {
    const slot = await this.obterPorId(slotId);
    slot.disponivel = true;
    slot.agendamentoId = undefined;
    return await this.slotRepository.save(slot);
  }

  async atualizar(id: string, dto: AtualizarSlotDisponibilidadeDto): Promise<Slot> {
    const slot = await this.obterPorId(id);
    Object.assign(slot, dto);
    return await this.slotRepository.save(slot);
  }

  async deletar(id: string): Promise<void> {
    const slot = await this.obterPorId(id);
    await this.slotRepository.remove(slot);
  }

  async limparSlotsAntigos(diasRetentao: number = 30): Promise<number> {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - diasRetentao);

    const resultado = await this.slotRepository.delete({
      dataHora: LessThan(dataLimite),
      disponivel: true,
    });

    return resultado.affected || 0;
  }
}
