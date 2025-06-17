import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly repo: Repository<Country>,
  ) {}

  paginate(options: IPaginationOptions): Promise<Pagination<Country>> {
    return paginate<Country>(
      this.repo.createQueryBuilder('country'),
      options
    );
  }

  async findOne(id: number) {
    const country = await this.repo.findOneBy({ id });
    if (!country) return null;
    return {
      id: country.id,
      name: country.name,
    };
  }

  async create(data: Partial<Country>) {
    const country = await this.repo.save(this.repo.create(data));
    return this.findOne(country.id);
  }

  async update(id: number, data: Partial<Country>) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) return null;
    await this.repo.save({ ...entity, ...data });
    return this.findOne(id);
  }

  async remove(id: number) {
    const entity = await this.repo.findOneBy({ id });
    if (entity) {
      await this.repo.remove(entity);
      return { message: 'deleted' };
    }
    return null;
  }
}