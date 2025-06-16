import { Injectable, NotFoundException } from '@nestjs/common';
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

  findOne(id: number) {
    return this.repo.findOneByOrFail({ id });
  }

  create(data: Partial<Country>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Country>) {
    const entity = await this.findOne(id);
    return this.repo.save({ ...entity, ...data });
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    return this.repo.remove(entity);
  }
}
