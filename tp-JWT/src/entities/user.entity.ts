import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
import { UserI } from '../interfaces/user.interface';

@Entity('users')
export class UserEntity extends BaseEntity implements UserI {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, role => role.users, { cascade: true })
  @JoinTable()
  roles: Role[];

  get permissionCodes(): string[] {
    if (!this.roles) return [];
    return this.roles.flatMap(role => role.permissions.map(p => p.name));
  }
}

