import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orcamento, OrcamentoStatus } from '../entities/orcamento.entity';
import { CriarOrcamentoDto, OrcamentoResponseDto } from '../dtos/orcamento.dto';
import { Profissional } from '../../profissional/entities/profissional.entity';

@Injectable()
export class OrcamentoService {
  constructor(
    @InjectRepository(Orcamento)
    private orcamentoRepository: Repository<Orcamento>,
    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,
  ) {}

  async criar(dto: CriarOrcamentoDto): Promise<Orcamento> {
    const valorDeslocamento = dto.valorDeslocamento || 0;
    const valorMateriais = dto.valorMateriais || 0;
    const valorTotal = dto.valorServico + valorDeslocamento + valorMateriais;

    // Validade de 7 dias
    const validadeAte = new Date();
    validadeAte.setDate(validadeAte.getDate() + 7);

    const orcamento = this.orcamentoRepository.create({
      ...dto,
      valorDeslocamento,
      valorMateriais,
      valorTotal,
      validadeAte,
      status: OrcamentoStatus.ENVIADO,
    });

    return await this.orcamentoRepository.save(orcamento);
  }

  async listarPorChamado(chamadoId: string): Promise<OrcamentoResponseDto[]> {
    const orcamentos = await this.orcamentoRepository.find({
      where: { chamadoId },
      order: { criadoEm: 'DESC' },
    });

    // Carregar informações dos profissionais
    const orcamentosComProfissional = await Promise.all(
      orcamentos.map(async (orc) => {
        const profissional = await this.profissionalRepository.findOne({
          where: { id: orc.profissionalId },
        });

        return {
          ...orc,
          profissionalNome: profissional?.nome,
          profissionalScore: profissional?.score,
        } as OrcamentoResponseDto;
      }),
    );

    return orcamentosComProfissional;
  }

  async listarPorProfissional(profissionalId: string): Promise<Orcamento[]> {
    return await this.orcamentoRepository.find({
      where: { profissionalId },
      order: { criadoEm: 'DESC' },
    });
  }

  async obterPorId(id: string): Promise<Orcamento> {
    const orcamento = await this.orcamentoRepository.findOne({
      where: { id },
    });

    if (!orcamento) {
      throw new NotFoundException(`Orçamento ${id} não encontrado`);
    }

    return orcamento;
  }

  async aprovar(orcamentoId: string, usuarioId: string): Promise<Orcamento> {
    const orcamento = await this.obterPorId(orcamentoId);

    if (orcamento.status !== OrcamentoStatus.ENVIADO) {
      throw new BadRequestException('Orçamento não está pendente de aprovação');
    }

    // Verificar validade
    if (orcamento.validadeAte && new Date() > orcamento.validadeAte) {
      orcamento.status = OrcamentoStatus.EXPIRADO;
      await this.orcamentoRepository.save(orcamento);
      throw new BadRequestException('Orçamento expirado');
    }

    // Recusar outros orçamentos do mesmo chamado
    await this.orcamentoRepository.update(
      {
        chamadoId: orcamento.chamadoId,
        status: OrcamentoStatus.ENVIADO,
      },
      {
        status: OrcamentoStatus.RECUSADO,
        motivoRecusa: 'Cliente aprovou outro orçamento',
      },
    );

    // Aprovar este
    orcamento.status = OrcamentoStatus.APROVADO;
    orcamento.aprovadoEm = new Date();
    return await this.orcamentoRepository.save(orcamento);
  }

  async recusar(orcamentoId: string, motivoRecusa?: string): Promise<Orcamento> {
    const orcamento = await this.obterPorId(orcamentoId);

    if (orcamento.status !== OrcamentoStatus.ENVIADO) {
      throw new BadRequestException('Orçamento não está pendente');
    }

    orcamento.status = OrcamentoStatus.RECUSADO;
    orcamento.motivoRecusa = motivoRecusa;
    return await this.orcamentoRepository.save(orcamento);
  }

  async cancelar(orcamentoId: string): Promise<Orcamento> {
    const orcamento = await this.obterPorId(orcamentoId);

    if (orcamento.status === OrcamentoStatus.APROVADO) {
      throw new BadRequestException('Não é possível cancelar orçamento já aprovado');
    }

    orcamento.status = OrcamentoStatus.CANCELADO;
    return await this.orcamentoRepository.save(orcamento);
  }

  async expirarOrcamentosVencidos(): Promise<void> {
    const agora = new Date();
    await this.orcamentoRepository.update(
      {
        status: OrcamentoStatus.ENVIADO,
        validadeAte: Repository['LessThan'](agora),
      },
      {
        status: OrcamentoStatus.EXPIRADO,
      },
    );
  }
}
