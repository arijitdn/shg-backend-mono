import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('shg')
  getShgStats(
    @Query('shgId') shgId?: string,
    @Query('voId') voId?: string,
    @Query('clfId') clfId?: string,
  ) {
    return this.analyticsService.getShgStats(voId, clfId);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get Product statistics by SHG, VO, or CLF' })
  @ApiQuery({ name: 'shgId', required: false })
  @ApiQuery({ name: 'voId', required: false })
  @ApiQuery({ name: 'clfId', required: false })
  getProductStats(
    @Query('shgId') shgId?: string,
    @Query('voId') voId?: string,
    @Query('clfId') clfId?: string,
  ) {
    return this.analyticsService.getProductStats(shgId, voId, clfId);
  }
  @Get('orders')
  getOrderStats(
    @Query('shgId') shgId?: string,
    @Query('voId') voId?: string,
    @Query('clfId') clfId?: string,
    @Query('userId') userId?: string,
    @Query('type') type?: string,
    @Query('deliveryType') deliveryType?: string,
  ) {
    return this.analyticsService.getOrderStats(
      shgId,
      voId,
      clfId,
      userId,
      type,
      deliveryType,
    );
  }

  @Get('admin')
  getAdminStats(@Query('post') post?: string) {
    return this.analyticsService.getAdminStats(post);
  }
}
