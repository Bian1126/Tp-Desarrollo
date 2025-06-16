import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { City } from './city';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToOne(() => City, city => city.persons)
  city: City;
}
