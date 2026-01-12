import { Repository } from 'typeorm';
import { Agendamento } from '../entities/agendamento.entity';
import { CriarAgendamentoDto, ConfirmarAgendamentoDto, CancelarAgendamentoDto } from '../dtos/agendamento.dto';
import { Chamado } from '../../chamado/entities/chamado.entity';
import { SlotService } from './slot.service';
import { HistoricoService } from '../../chamado/services/historico.service';
export declare class AgendamentoService {
    private agendamentoRepository;
    private chamadoRepository;
    private slotService;
    private historicoService;
    constructor(agendamentoRepository: Repository<Agendamento>, chamadoRepository: Repository<Chamado>, slotService: SlotService, historicoService: HistoricoService);
    agendar(dto: CriarAgendamentoDto): Promise<Agendamento>;
    confirmar(agendamentoId: string, dto: ConfirmarAgendamentoDto): Promise<Agendamento>;
    cancelar(agendamentoId: string, dto: CancelarAgendamentoDto): Promise<Agendamento>;
    obterPorId(id: string): Promise<Agendamento>;
    obterPorChamado(chamadoId: string): Promise<Agendamento | null>;
    listarPendentesDeConfirmacao(limite?: number): Promise<Agendamento[]>;
    iniciarAtendimento(agendamentoId: string): Promise<Agendamento>;
    concluirAtendimento(agendamentoId: string): Promise<Agendamento>;
}
