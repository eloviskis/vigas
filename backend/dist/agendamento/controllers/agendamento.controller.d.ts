import { AgendamentoService } from '../services/agendamento.service';
import { CriarAgendamentoDto, ConfirmarAgendamentoDto, CancelarAgendamentoDto, AgendamentoResponseDto } from '../dtos/agendamento.dto';
export declare class AgendamentoController {
    private readonly agendamentoService;
    constructor(agendamentoService: AgendamentoService);
    criar(chamadoId: string, dto: CriarAgendamentoDto): Promise<AgendamentoResponseDto>;
    obter(chamadoId: string): Promise<AgendamentoResponseDto | null>;
    confirmar(agendamentoId: string, dto: ConfirmarAgendamentoDto): Promise<AgendamentoResponseDto>;
    cancelar(agendamentoId: string, dto: CancelarAgendamentoDto): Promise<AgendamentoResponseDto>;
    iniciar(agendamentoId: string): Promise<AgendamentoResponseDto>;
    concluir(agendamentoId: string): Promise<AgendamentoResponseDto>;
}
