import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from '../entities/person';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';


@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly repo: Repository<Person>,
  ) {}
  
  paginate(options: IPaginationOptions): Promise<Pagination<Person>> {
    return paginate<Person>(
      this.repo.createQueryBuilder('person')
      .leftJoinAndSelect('person.city', 'city')
      .leftJoinAndSelect('city.province', 'province')
      .leftJoinAndSelect('province.country', 'country'),
      options
    );
  }

  findAllWithRelations(): Promise<Person[]> {
  return this.repo.find({
    relations: ['city', 'city.province', 'city.province.country'],
  });
  }


  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['city', 'city.province', 'city.province.country'] });
  }

  create(data: Partial<Person>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Person>) {
    const entity = await this.findOne(id);
    return this.repo.save({ ...entity, ...data });
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    if(entity)
    return this.repo.remove(entity);
  }
}
