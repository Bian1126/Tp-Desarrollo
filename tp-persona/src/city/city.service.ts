import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from '../entities/city';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly repo: Repository<City>,
  ) {}
  
  paginate(options: IPaginationOptions): Promise<Pagination<City>> {
    return paginate<City>(
      this.repo.createQueryBuilder('city')
      .leftJoinAndSelect('city.province', 'province')
      .leftJoinAndSelect('province.country', 'country'),
      options
    );
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['province', 'province.country'],
    });
  }

  create(data: Partial<City>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<City>) {
    const entity = await this.findOne(id);
    return this.repo.save({ ...entity, ...data });
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    if (entity) return this.repo.remove(entity);
  }
}
