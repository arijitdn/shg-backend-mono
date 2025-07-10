import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Health Check Endpoint',
    description: 'This endpoint checks the health of the application.',
    tags: ['Health'],
    operationId: 'healthCheck',
  })
  @Get('health')
  healthCheck() {
    return this.appService.healthCheck();
  }
}
