import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avaliacao } from '../entities/avaliacao.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';

@Injectable()
export class AvaliacaoService {
  constructor(
    @InjectRepository(Avaliacao)
    private avaliacaoRepository: Repository<Avaliacao>,
    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,
  ) {}

  async criar(dto: any) {
    const avaliacao = this.avaliacaoRepository.create(dto);
    const saved = await this.avaliacaoRepository.save(avaliacao);

    // Atualizar score do profissional
    await this.recalcularScore(dto.profissionalId);

    return saved;
  }

  async listarPorProfissional(profissionalId: string): Promise<Avaliacao[]> {
    return await this.avaliacaoRepository.find({
      where: { profissionalId },
      order: { criadoEm: 'DESC' },
    });
  }

  async recalcularScore(profissionalId: string): Promise<void> {
    const avaliacoes = await this.avaliacaoRepository.find({
      where: { profissionalId },
    });

    if (avaliacoes.length === 0) return;

    const somaNotas = avaliacoes.reduce((sum, av) => sum + av.notaGeral, 0);
    const novoScore = somaNotas / avaliacoes.length;

    const recomendacoes = avaliacoes.filter(av => av.recomenda).length;
    const taxaSatisfacao = (recomendacoes / avaliacoes.length) * 100;

    await this.profissionalRepository.update(profissionalId, {
      score: Number(novoScore.toFixed(2)),
      totalServiços: avaliacoes.length,
      serviçosConcluídos: avaliacoes.length,
      taxaSatisfação: Number(taxaSatisfacao.toFixed(2)),
    });
  }
}
