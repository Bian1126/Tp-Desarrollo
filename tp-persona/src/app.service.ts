import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Country)
    private repository: Repository<Country>,
  ) {}

  async find(): Promise<Country[]> {
    return await this.repository.find();
  }
}
