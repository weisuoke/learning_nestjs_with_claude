import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppStatus(): object {
    return {
      success: true,
      message: '电商平台 API 服务运行正常',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  healthCheck(): object {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      },
    };
  }
}