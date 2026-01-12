import { Repository } from 'typeorm';
import { Profissional } from '../entities/profissional.entity';
import { CriarProfissionalDto, AtualizarProfissionalDto } from '../dtos/profissional.dto';
export declare class ProfissionalService {
    private profissionalRepository;
    constructor(profissionalRepository: Repository<Profissional>);
    criar(dto: CriarProfissionalDto): Promise<Profissional>;
    listarAtivos(contexto?: string, userLat?: number, userLon?: number): Promise<Profissional[]>;
    listarPorContextoECategoria(contexto: string, categoria: string, userLat?: number, userLon?: number): Promise<Profissional[]>;
    obterPorId(id: string): Promise<Profissional>;
    atualizar(id: string, dto: AtualizarProfissionalDto): Promise<Profissional>;
    atualizarScore(id: string, novoScore: number): Promise<Profissional>;
    incrementarServiço(id: string, concluído?: boolean): Promise<Profissional>;
    calcularTaxaSatisfação(id: string): Promise<number>;
}
