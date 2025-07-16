import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('products')
  getProductStats(
    @Query('shgId') shgId?: string,
    @Query('voId') voId?: string,
    @Query('clfId') clfId?: string,
  ) {
    return this.analyticsService.getProductStats(shgId, voId, clfId);
  }
}
