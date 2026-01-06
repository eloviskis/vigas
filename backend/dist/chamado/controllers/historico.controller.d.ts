import { HistoricoService } from '../services/historico.service';
import { CriarHistoricoDto, HistoricoResponseDto } from '../dtos/historico.dto';
export declare class HistoricoController {
    private readonly historicoService;
    constructor(historicoService: HistoricoService);
    listar(chamadoId: string): Promise<HistoricoResponseDto[]>;
    registrar(chamadoId: string, dto: CriarHistoricoDto): Promise<HistoricoResponseDto>;
}
