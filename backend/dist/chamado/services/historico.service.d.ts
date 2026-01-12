import { Repository } from 'typeorm';
import { ChamadoHistorico } from '../entities/chamado-historico.entity';
import { CriarHistoricoDto } from '../dtos/historico.dto';
export declare class HistoricoService {
    private historicoRepository;
    constructor(historicoRepository: Repository<ChamadoHistorico>);
    registrarEvento(chamadoId: string, dto: CriarHistoricoDto): Promise<ChamadoHistorico>;
    listarPorChamado(chamadoId: string): Promise<ChamadoHistorico[]>;
    registrarStatus(chamadoId: string, descricao: string, metadata?: Record<string, any>): Promise<ChamadoHistorico>;
    registrarTriagem(chamadoId: string, descricao: string, metadata?: Record<string, any>): Promise<ChamadoHistorico>;
    registrarAgendamento(chamadoId: string, descricao: string, metadata?: Record<string, any>): Promise<ChamadoHistorico>;
    registrarNota(chamadoId: string, descricao: string, metadata?: Record<string, any>): Promise<ChamadoHistorico>;
    registrarSistema(chamadoId: string, descricao: string, metadata?: Record<string, any>): Promise<ChamadoHistorico>;
}
