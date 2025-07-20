import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from '../entities/person';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import axios from 'axios';
import { City } from '../entities/city';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly repo: Repository<Person>,
  ) {}
  
  async findAllPublic(): Promise<Person[]> {
    return this.repo.find({
      relations: ['city', 'city.province', 'city.province.country'],
    });
  }


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

  async create(data: Partial<Person> & { password?: string }) {
    if (data.password) {
      try {
        await axios.post('http://localhost:3000/register', {
          email: data.email,
          password: data.password,
        });
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message &&
          error.response.data.message.includes('already exists')
        ) {
          throw new Error('El email ya está registrado como usuario');
        }
        throw new Error('Error al registrar usuario: ' + error.message);
      }
      delete data.password;
    }
    const person = await this.repo.save(this.repo.create(data));
    return this.findOne(person.id);
  }

  async update(id: number, data: Partial<Person>) {
    const entity = await this.repo.findOne({ where: { id }, relations: ['city'] });
    if (!entity) return null;
    
    // Si viene cityId, buscar la ciudad y asignarla
    if ('cityId' in data) {
      const cityRepo = this.repo.manager.getRepository(City);
      const cityId = Number(data.cityId);
      if (!isNaN(cityId)) {
        const nuevaCiudad = await cityRepo.findOne({ where: { id: cityId } });
        if (nuevaCiudad) {
          entity.city = nuevaCiudad;
        }
      }
      delete data.cityId;
    }
    // no usar password
    if ('password' in data) {
      delete data.password;
    }

    Object.assign(entity, data);

    await this.repo.save(entity);
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