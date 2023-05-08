import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Hello world!',
    description: 'See if nest is working!',
  })
  @Get()
  getStatus(): string {
    return this.appService.getStatus();
  }
}
