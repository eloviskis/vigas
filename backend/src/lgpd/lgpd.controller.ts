import { Controller, Get, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LgpdService } from './lgpd.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('LGPD')
@ApiBearerAuth()
@Controller('lgpd')
export class LgpdController {
  constructor(private lgpdService: LgpdService) {}

  @Get('my-data')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Exportar todos os dados do usuário (LGPD Art. 18)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dados exportados em formato JSON',
    schema: {
      example: {
        usuario: { id: '...', email: '...', nome: '...' },
        chamados: [],
        pagamentos: [],
        avaliacoes: []
      }
    }
  })
  async exportMyData(@Request() req) {
    return this.lgpdService.exportUserData(req.user.userId);
  }

  @Delete('delete-account')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Solicitar exclusão de conta (LGPD Art. 18)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Solicitação de exclusão registrada',
    schema: {
      example: {
        message: 'Sua solicitação de exclusão foi registrada e será processada em até 30 dias',
        dataExclusao: '2026-02-10T00:00:00.000Z'
      }
    }
  })
  async requestAccountDeletion(@Request() req) {
    return this.lgpdService.requestDeletion(req.user.userId);
  }

  @Get('consent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter status de consentimento do usuário' })
  async getConsent(@Request() req) {
    return this.lgpdService.getConsent(req.user.userId);
  }
}
