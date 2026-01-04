import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Profissional } from '../entities/profissional.entity';
import { ProfissionalStatus } from '../entities/profissional.entity';
import { CriarProfissionalDto, AtualizarProfissionalDto } from '../dtos/profissional.dto';

@Injectable()
export class ProfissionalService {
  constructor(
    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,
  ) {}

  async criar(dto: CriarProfissionalDto): Promise<Profissional> {
    const existente = await this.profissionalRepository.findOne({
      where: { email: dto.email },
    });

    if (existente) {
      throw new BadRequestException(`Email ${dto.email} já registrado`);
    }

    const profissional = this.profissionalRepository.create(dto);
    return await this.profissionalRepository.save(profissional);
  }

  async listarAtivos(contexto?: string): Promise<Profissional[]> {
    const query = this.profissionalRepository.createQueryBuilder('p')
      .where('p.status = :status', { status: ProfissionalStatus.ATIVO });

    if (contexto) {
      query.andWhere(':contexto = ANY(p.contextos)', { contexto });
    }

    return query.orderBy('p.score', 'DESC').getMany();
  }

  async listarPorContextoECategoria(
    contexto: string,
    categoria: string,
  ): Promise<Profissional[]> {
    return this.profissionalRepository
      .createQueryBuilder('p')
      .where(':contexto = ANY(p.contextos)', { contexto })
      .andWhere(':categoria = ANY(p.categorias)', { categoria })
      .andWhere('p.status = :status', { status: ProfissionalStatus.ATIVO })
      .orderBy('p.score', 'DESC')
      .getMany();
  }

  async obterPorId(id: string): Promise<Profissional> {
    const profissional = await this.profissionalRepository.findOne({
      where: { id },
    });

    if (!profissional) {
      throw new NotFoundException(`Profissional ${id} não encontrado`);
    }

    return profissional;
  }

  async atualizar(id: string, dto: AtualizarProfissionalDto): Promise<Profissional> {
    const profissional = await this.obterPorId(id);
    Object.assign(profissional, dto);
    return await this.profissionalRepository.save(profissional);
  }

  async atualizarScore(id: string, novoScore: number): Promise<Profissional> {
    const profissional = await this.obterPorId(id);
    profissional.score = Math.max(0, Math.min(5, novoScore)); // 0-5 range
    return await this.profissionalRepository.save(profissional);
  }

  async incrementarServiço(id: string, concluído: boolean = false): Promise<Profissional> {
    const profissional = await this.obterPorId(id);
    profissional.totalServiços += 1;
    if (concluído) {
      profissional.serviçosConcluídos += 1;
    }
    return await this.profissionalRepository.save(profissional);
  }

  async calcularTaxaSatisfação(id: string): Promise<number> {
    const profissional = await this.obterPorId(id);
    if (profissional.totalServiços === 0) return 0;
    return (profissional.serviçosConcluídos / profissional.totalServiços) * 100;
  }
}
