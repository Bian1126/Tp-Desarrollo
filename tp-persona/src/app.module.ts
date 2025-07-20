import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Reflector } from '@nestjs/core';
import { entities, City, Province } from './entities';
import { Person } from './entities/person';
import { Country } from './entities/country';
import { PersonController } from './person/person.controller';
import { PersonService } from './person/person.service';
import { CountryController } from './country/country.controller';
import { CountryService } from './country/country.service';
import { CityController } from './city/city.controller';
import { CityService } from './city/city.service';
import { ProvinceController } from './province/province.controller';
import { ProvinceService } from './province/province.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'bp21012021',
      database: 'mybd_persona',
      entities,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Person, City, Country, Province]),
  ],
  controllers: [
    AppController,
    PersonController,
    CountryController,
    CityController,
    ProvinceController,
  ],
  providers: [
    AppService,
    Reflector,
    PersonService,
    CountryService,
    CityService,
    ProvinceService,
  ],
})
export class AppModule {}