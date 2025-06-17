import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { City } from './city';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Cambiar de firstName/lastName a name

  @Column()
  email: string;

  @Column({ type: 'date' })
  birthDate: string;

  @ManyToOne(() => City, city => city.persons, { nullable: false })
  city: City;
}

