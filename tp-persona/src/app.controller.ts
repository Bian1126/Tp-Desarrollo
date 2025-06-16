import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Country } from './entities/country';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHellos(): Promise<Country[]> {
    return await this.appService.find();
  }
}
