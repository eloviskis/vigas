import { TriagemService } from '../services/triagem.service';
import { CriarTriagemDto, RecomendarProfissionalDto } from '../dtos/triagem.dto';
export declare class TriagemController {
    private readonly triagemService;
    constructor(triagemService: TriagemService);
    realizar(chamadoId: string, dto: CriarTriagemDto): Promise<import("../entities/triagem.entity").Triagem>;
    obter(chamadoId: string): Promise<import("../entities/triagem.entity").Triagem>;
    recomendarManualmente(dto: RecomendarProfissionalDto): Promise<import("../entities/triagem.entity").Triagem>;
}
