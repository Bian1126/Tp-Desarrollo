import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Country } from './country';
import { City } from './city';

@Entity()
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @ManyToOne(() => Country, country => country.provinces, { nullable: false })
  country: Country;

  @OneToMany(() => City, city => city.province)
  cities: City[];
}
