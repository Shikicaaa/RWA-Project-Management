import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Task } from 'src/tasks/task.entity';
import { OneToMany } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  MEMBER = 'member',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 1 })
  level: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}