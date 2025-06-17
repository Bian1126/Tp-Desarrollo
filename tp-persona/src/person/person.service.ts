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

  async findOne(id: number) {
    const person = await this.repo.findOne({
      where: { id },
      relations: ['city', 'city.province', 'city.province.country'],
    });
    if (!person) return null;
    return {
      id: person.id,
      name: person.name, // Asegúrate de tener el campo 'name' en la entidad
      email: person.email,
      birthDate: person.birthDate,
      city: {
        id: person.city.id,
        name: person.city.name,
        province: {
          id: person.city.province.id,
          name: person.city.province.name,
          country: {
            id: person.city.province.country.id,
            name: person.city.province.country.name,
          },
        },
      },
    };
  }

  async create(data: Partial<Person>) {
    const person = await this.repo.save(this.repo.create(data));
    return this.findOne(person.id);
  }

  async update(id: number, data: Partial<Person>) {
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