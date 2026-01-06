import { ChamadoService } from '../services/chamado.service';
import { CriarChamadoDto, AtualizarChamadoDto, ChamadoResponseDto } from '../dtos/chamado.dto';
export declare class ChamadoController {
    private readonly chamadoService;
    constructor(chamadoService: ChamadoService);
    criar(dto: CriarChamadoDto): Promise<ChamadoResponseDto>;
    listarTodos(): Promise<ChamadoResponseDto[]>;
    listarPorUsuario(usuarioId: string): Promise<ChamadoResponseDto[]>;
    obter(id: string): Promise<ChamadoResponseDto>;
    atualizar(id: string, dto: AtualizarChamadoDto): Promise<ChamadoResponseDto>;
    deletar(id: string): Promise<void>;
    private mapToResponse;
}
