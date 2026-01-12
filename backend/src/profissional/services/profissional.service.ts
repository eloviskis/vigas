import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Profissional } from '../entities/profissional.entity';
import { ProfissionalStatus } from '../entities/profissional.entity';
import { CriarProfissionalDto, AtualizarProfissionalDto } from '../dtos/profissional.dto';

/**
 * Calcula distância entre dois pontos usando fórmula de Haversine
 * @returns distância em quilômetros
 */
function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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

  async listarAtivos(contexto?: string, userLat?: number, userLon?: number): Promise<Profissional[]> {
    const query = this.profissionalRepository.createQueryBuilder('p')
      .where('p.status = :status', { status: ProfissionalStatus.ATIVO });

    if (contexto) {
      query.andWhere('p.contextos LIKE :contexto', { contexto: `%${contexto}%` });
    }

    const profissionais = await query.getMany();

    // Se localização fornecida, ordenar por distância
    if (userLat && userLon) {
      return profissionais
        .map(prof => ({
          ...prof,
          distancia: prof.latitude && prof.longitude 
            ? calcularDistancia(userLat, userLon, prof.latitude, prof.longitude)
            : 9999
        }))
        .sort((a, b) => {
          // Ordenar por distância primeiro, depois por score
          if (a.distancia !== b.distancia) {
            return a.distancia - b.distancia;
          }
          return Number(b.score) - Number(a.score);
        });
    }

    // Ordenar apenas por score se não houver localização
    return profissionais.sort((a, b) => Number(b.score) - Number(a.score));
  }

  async listarPorContextoECategoria(
    contexto: string,
    categoria: string,
    userLat?: number,
    userLon?: number,
  ): Promise<Profissional[]> {
    const profissionais = await this.profissionalRepository
      .createQueryBuilder('p')
      .where('p.contextos LIKE :contexto', { contexto: `%${contexto}%` })
      .andWhere('p.categorias LIKE :categoria', { categoria: `%${categoria}%` })
      .andWhere('p.status = :status', { status: ProfissionalStatus.ATIVO })
      .getMany();

    // Se localização fornecida, ordenar por distância
    if (userLat && userLon) {
      return profissionais
        .map(prof => ({
          ...prof,
          distancia: prof.latitude && prof.longitude 
            ? calcularDistancia(userLat, userLon, prof.latitude, prof.longitude)
            : 9999
        }))
        .sort((a, b) => {
          // Ordenar por distância primeiro, depois por score
          if (a.distancia !== b.distancia) {
            return a.distancia - b.distancia;
          }
          return Number(b.score) - Number(a.score);
        });
    }

    // Ordenar apenas por score se não houver localização
    return profissionais.sort((a, b) => Number(b.score) - Number(a.score));
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
