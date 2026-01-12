import { OrcamentoService } from '../services/orcamento.service';
import { CriarOrcamentoDto, AprovarOrcamentoDto, RecusarOrcamentoDto, OrcamentoResponseDto } from '../dtos/orcamento.dto';
export declare class OrcamentoController {
    private readonly orcamentoService;
    constructor(orcamentoService: OrcamentoService);
    criar(dto: CriarOrcamentoDto): Promise<import("../entities/orcamento.entity").Orcamento>;
    listarPorChamado(chamadoId: string): Promise<OrcamentoResponseDto[]>;
    listarPorProfissional(profissionalId: string): Promise<import("../entities/orcamento.entity").Orcamento[]>;
    obterPorId(id: string): Promise<import("../entities/orcamento.entity").Orcamento>;
    aprovar(dto: AprovarOrcamentoDto): Promise<import("../entities/orcamento.entity").Orcamento>;
    recusar(dto: RecusarOrcamentoDto): Promise<import("../entities/orcamento.entity").Orcamento>;
    cancelar(id: string): Promise<import("../entities/orcamento.entity").Orcamento>;
}
