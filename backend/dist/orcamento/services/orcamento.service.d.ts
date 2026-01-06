import { Repository } from 'typeorm';
import { Orcamento } from '../entities/orcamento.entity';
import { CriarOrcamentoDto, OrcamentoResponseDto } from '../dtos/orcamento.dto';
import { Profissional } from '../../profissional/entities/profissional.entity';
export declare class OrcamentoService {
    private orcamentoRepository;
    private profissionalRepository;
    constructor(orcamentoRepository: Repository<Orcamento>, profissionalRepository: Repository<Profissional>);
    criar(dto: CriarOrcamentoDto): Promise<Orcamento>;
    listarPorChamado(chamadoId: string): Promise<OrcamentoResponseDto[]>;
    listarPorProfissional(profissionalId: string): Promise<Orcamento[]>;
    obterPorId(id: string): Promise<Orcamento>;
    aprovar(orcamentoId: string, usuarioId: string): Promise<Orcamento>;
    recusar(orcamentoId: string, motivoRecusa?: string): Promise<Orcamento>;
    cancelar(orcamentoId: string): Promise<Orcamento>;
    expirarOrcamentosVencidos(): Promise<void>;
}
