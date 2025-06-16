import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Province } from './province';
import { Person } from './person';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @ManyToOne(() => Province, province => province.cities)
  province: Province;

  @OneToMany(() => Person, person => person.city)
  persons: Person[];
}
