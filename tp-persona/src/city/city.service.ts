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

  async findOne(id: number) {
    const city = await this.repo.findOne({
      where: { id },
      relations: ['province', 'province.country'],
    });
    if (!city) return null;
    return {
      id: city.id,
      name: city.name,
      province: {
        id: city.province.id,
        name: city.province.name,
        country: {
          id: city.province.country.id,
          name: city.province.country.name,
        },
      },
    };
  }

  async create(data: Partial<City>) {
    const city = await this.repo.save(this.repo.create(data));
    return this.findOne(city.id);
  }

  async update(id: number, data: Partial<City>) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;
    await this.repo.save({ ...entity, ...data });
    return this.findOne(id);
  }

  async remove(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (entity) {
      await this.repo.remove(entity);
      return { message: 'deleted' };
    }
    return null;
  }
}