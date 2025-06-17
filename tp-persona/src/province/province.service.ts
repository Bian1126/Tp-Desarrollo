import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from '../entities/province';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly repo: Repository<Province>,
  ) {}

  paginate(options: IPaginationOptions): Promise<Pagination<Province>> {
    return paginate<Province>(
      this.repo.createQueryBuilder('province')
        .leftJoinAndSelect('province.country', 'country'),
      options
    );
  }

  async findOne(id: number) {
    const province = await this.repo.findOne({
      where: { id },
      relations: ['country'],
    });
    if (!province) return null;
    return {
      id: province.id,
      name: province.name,
      country: {
        id: province.country.id,
        name: province.country.name,
      },
    };
  }

  async create(data: Partial<Province>) {
    const province = await this.repo.save(this.repo.create(data));
    return this.findOne(province.id);
  }

  async update(id: number, data: Partial<Province>) {
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