import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from '../entities/province';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions, IPaginationMeta } from 'nestjs-typeorm-paginate';


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



  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['country'] });
  }

  create(data: Partial<Province>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Province>) {
    const entity = await this.findOne(id);
    return this.repo.save({ ...entity, ...data });
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    if(entity)
    return this.repo.remove(entity);
  }
}
