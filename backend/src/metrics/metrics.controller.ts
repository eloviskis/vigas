import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Métricas')
@ApiBearerAuth()
@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter métricas do dashboard' })
  @ApiResponse({ status: 200, description: 'Métricas retornadas com sucesso' })
  async getDashboardMetrics() {
    return this.metricsService.getDashboardMetrics();
  }
}
