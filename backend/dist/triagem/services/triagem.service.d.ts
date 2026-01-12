import { Repository } from 'typeorm';
import { Triagem } from '../entities/triagem.entity';
import { CriarTriagemDto, RecomendarProfissionalDto } from '../dtos/triagem.dto';
import { Chamado } from '../../chamado/entities/chamado.entity';
import { ProfissionalService } from '../../profissional/services/profissional.service';
import { HistoricoService } from '../../chamado/services/historico.service';
export declare class TriagemService {
    private triagemRepository;
    private chamadoRepository;
    private profissionalService;
    private historicoService;
    constructor(triagemRepository: Repository<Triagem>, chamadoRepository: Repository<Chamado>, profissionalService: ProfissionalService, historicoService: HistoricoService);
    realizar(dto: CriarTriagemDto): Promise<Triagem>;
    private executarTriagemAutomatica;
    obterPorChamado(chamadoId: string): Promise<Triagem | null>;
    recomendarManualmente(dto: RecomendarProfissionalDto): Promise<Triagem>;
    listarPendentes(limit?: number): Promise<Triagem[]>;
}
