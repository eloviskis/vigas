import { Repository } from 'typeorm';
import { Avaliacao } from '../entities/avaliacao.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';
export declare class AvaliacaoService {
    private avaliacaoRepository;
    private profissionalRepository;
    constructor(avaliacaoRepository: Repository<Avaliacao>, profissionalRepository: Repository<Profissional>);
    criar(dto: any): Promise<Avaliacao[]>;
    listarPorProfissional(profissionalId: string): Promise<Avaliacao[]>;
    recalcularScore(profissionalId: string): Promise<void>;
}
