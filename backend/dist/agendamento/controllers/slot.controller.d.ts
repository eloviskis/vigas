import { SlotService } from '../services/slot.service';
import { CriarSlotDto, SlotResponseDto } from '../dtos/slot.dto';
export declare class SlotController {
    private readonly slotService;
    constructor(slotService: SlotService);
    criar(dto: CriarSlotDto): Promise<SlotResponseDto>;
    listarDisponiveis(profissionalId: string, dataInicio?: string, dataFim?: string): Promise<SlotResponseDto[]>;
    obter(slotId: string): Promise<SlotResponseDto>;
}
