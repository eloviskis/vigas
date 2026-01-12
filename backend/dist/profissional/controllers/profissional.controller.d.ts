import { ProfissionalService } from '../services/profissional.service';
import { CriarProfissionalDto, AtualizarProfissionalDto, ProfissionalResponseDto } from '../dtos/profissional.dto';
export declare class ProfissionalController {
    private readonly profissionalService;
    constructor(profissionalService: ProfissionalService);
    criar(dto: CriarProfissionalDto): Promise<ProfissionalResponseDto>;
    listar(contexto?: string, lat?: string, lon?: string): Promise<ProfissionalResponseDto[]>;
    buscarPorContextoECategoria(contexto: string, categoria: string, lat?: string, lon?: string): Promise<ProfissionalResponseDto[]>;
    obter(id: string): Promise<ProfissionalResponseDto>;
    atualizar(id: string, dto: AtualizarProfissionalDto): Promise<ProfissionalResponseDto>;
    calcularTaxaSatisfação(id: string): Promise<{
        taxa: number;
    }>;
}
