import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Chamado } from '../chamado/entities/chamado.entity';
import { Pagamento } from '../pagamento/entities/pagamento.entity';
import { Avaliacao } from '../avaliacao/entities/avaliacao.entity';

export interface UserDataExport {
  usuario: Partial<User>;
  chamados: Partial<Chamado>[];
  pagamentos: Partial<Pagamento>[];
  avaliacoes: Partial<Avaliacao>[];
  dataExportacao: Date;
}

@Injectable()
export class LgpdService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Chamado)
    private chamadoRepository: Repository<Chamado>,
    @InjectRepository(Pagamento)
    private pagamentoRepository: Repository<Pagamento>,
    @InjectRepository(Avaliacao)
    private avaliacaoRepository: Repository<Avaliacao>,
  ) {}

  /**
   * Exporta todos os dados pessoais do usuário (LGPD Art. 18, II)
   */
  async exportUserData(userId: string): Promise<UserDataExport> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Buscar todos os chamados do usuário
    const chamados = await this.chamadoRepository.find({
      where: { cliente: { id: userId } },
      relations: ['triagem', 'agendamento', 'fotos'],
    });

    // Buscar todos os pagamentos relacionados aos chamados
    const pagamentos = await this.pagamentoRepository.find({
      where: { orcamento: { chamado: { cliente: { id: userId } } } },
      relations: ['orcamento'],
    });

    // Buscar todas as avaliações do usuário
    const avaliacoes = await this.avaliacaoRepository.find({
      where: { cliente: { id: userId } },
    });

    // Remover dados sensíveis antes de exportar
    const { password, fcmToken, ...userData } = user;

    return {
      usuario: userData,
      chamados: chamados.map(chamado => ({
        id: chamado.id,
        descricao: chamado.descricao,
        endereco: chamado.endereco,
        cidade: chamado.cidade,
        estado: chamado.estado,
        status: chamado.status,
        createdAt: chamado.createdAt,
        updatedAt: chamado.updatedAt,
      })),
      pagamentos: pagamentos.map(pagamento => ({
        id: pagamento.id,
        valor: pagamento.valor,
        metodoPagamento: pagamento.metodoPagamento,
        status: pagamento.status,
        createdAt: pagamento.createdAt,
      })),
      avaliacoes: avaliacoes.map(avaliacao => ({
        id: avaliacao.id,
        nota: avaliacao.nota,
        comentario: avaliacao.comentario,
        createdAt: avaliacao.createdAt,
      })),
      dataExportacao: new Date(),
    };
  }

  /**
   * Solicita exclusão de conta (LGPD Art. 18, VI)
   * A exclusão real ocorrerá após 30 dias (período de retenção legal)
   */
  async requestDeletion(userId: string): Promise<{ message: string; dataExclusao: Date }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Marcar usuário como inativo e definir data de exclusão
    const dataExclusao = new Date();
    dataExclusao.setDate(dataExclusao.getDate() + 30); // 30 dias a partir de hoje

    user.ativo = false;
    // Adicionar campo deletionRequestedAt se existir na entidade
    // user.deletionRequestedAt = new Date();

    await this.userRepository.save(user);

    return {
      message: 'Sua solicitação de exclusão foi registrada e será processada em até 30 dias',
      dataExclusao,
    };
  }

  /**
   * Obter status de consentimento do usuário
   */
  async getConsent(userId: string): Promise<{
    termsAccepted: boolean;
    privacyPolicyAccepted: boolean;
    marketingConsent: boolean;
  }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Por enquanto, retornar valores padrão
    // No futuro, adicionar campos específicos na entidade User
    return {
      termsAccepted: true, // Assume que aceitou ao se cadastrar
      privacyPolicyAccepted: true,
      marketingConsent: false, // Padrão: não consentiu marketing
    };
  }

  /**
   * Anonimizar dados do usuário após período de retenção
   * (Para ser executado por um cron job)
   */
  async anonymizeUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return;
    }

    // Anonimizar dados pessoais
    user.email = `deleted_${user.id}@anonymized.com`;
    user.nome = 'Usuário Excluído';
    user.password = 'ANONYMIZED';
    user.fcmToken = null;
    user.ativo = false;

    await this.userRepository.save(user);

    // Anonimizar chamados relacionados
    const chamados = await this.chamadoRepository.find({
      where: { cliente: { id: userId } },
    });

    for (const chamado of chamados) {
      chamado.endereco = 'ENDEREÇO ANONIMIZADO';
      chamado.descricao = 'Descrição removida por solicitação do usuário';
      await this.chamadoRepository.save(chamado);
    }
  }
}
