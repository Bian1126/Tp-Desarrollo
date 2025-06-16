import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './permission.entity';
import { UserEntity } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
  
  @ManyToMany(() => Permission, permission => permission.roles, { cascade: true })
  @JoinTable({
    name: 'role_permissions_permission',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' }
  })
  permissions: Permission[];

  @ManyToMany(() => UserEntity, user => user.roles)
  users: UserEntity[];
}