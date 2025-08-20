import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('应用状态')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '获取应用状态' })
  @ApiResponse({ status: 200, description: '返回应用状态信息' })
  getHello(): object {
    return this.appService.getAppStatus();
  }

  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  @ApiResponse({ status: 200, description: '返回健康状态' })
  healthCheck(): object {
    return this.appService.healthCheck();
  }
}