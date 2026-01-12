import { Repository } from 'typeorm';
import { Chamado, ChamadoStatus } from '../entities/chamado.entity';
import { CriarChamadoDto, AtualizarChamadoDto } from '../dtos/chamado.dto';
import { HistoricoService } from './historico.service';
export declare class ChamadoService {
    private chamadoRepository;
    private historicoService;
    constructor(chamadoRepository: Repository<Chamado>, historicoService: HistoricoService);
    criar(dto: CriarChamadoDto): Promise<Chamado>;
    listarTodos(): Promise<Chamado[]>;
    listarPorUsuario(usuarioId: string): Promise<Chamado[]>;
    obterPorId(id: string): Promise<Chamado>;
    atualizar(id: string, dto: AtualizarChamadoDto): Promise<Chamado>;
    mudarStatus(id: string, novoStatus: ChamadoStatus, motivo?: string): Promise<Chamado>;
    deletar(id: string): Promise<void>;
}
