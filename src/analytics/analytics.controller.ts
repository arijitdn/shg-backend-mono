import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('products')
  @ApiOperation({ summary: 'Get Product statistics by SHG, VO, or CLF' })
  @ApiQuery({ name: 'shgId', required: false })
  @ApiQuery({ name: 'voId', required: false })
  @ApiQuery({ name: 'clfId', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns product stats',
    schema: {
      type: 'object',
      properties: {
        totalProducts: { type: 'number' },
        byShg: { type: 'number', nullable: true },
        byVo: { type: 'number', nullable: true },
        byClf: { type: 'number', nullable: true },
      },
    },
  })
  getProductStats(
    @Query('shgId') shgId?: string,
    @Query('voId') voId?: string,
    @Query('clfId') clfId?: string,
  ) {
    return this.analyticsService.getProductStats(shgId, voId, clfId);
  }
}
