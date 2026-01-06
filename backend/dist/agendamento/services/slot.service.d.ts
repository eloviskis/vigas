import { Repository } from 'typeorm';
import { Slot } from '../entities/slot.entity';
import { CriarSlotDto, AtualizarSlotDisponibilidadeDto } from '../dtos/slot.dto';
export declare class SlotService {
    private slotRepository;
    constructor(slotRepository: Repository<Slot>);
    criar(dto: CriarSlotDto): Promise<Slot>;
    criarEmLote(profissionalId: string, dataInicio: Date, dataFim: Date, intervaloMinutos?: number): Promise<Slot[]>;
    listarDisponiveisPorProfissional(profissionalId: string, dataInicio: Date, dataFim: Date): Promise<Slot[]>;
    obterPorId(id: string): Promise<Slot>;
    marcarComoOcupado(slotId: string, agendamentoId: string): Promise<Slot>;
    marcarComoDisponivel(slotId: string): Promise<Slot>;
    atualizar(id: string, dto: AtualizarSlotDisponibilidadeDto): Promise<Slot>;
    deletar(id: string): Promise<void>;
    limparSlotsAntigos(diasRetentao?: number): Promise<number>;
}
