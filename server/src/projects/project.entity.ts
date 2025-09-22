import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
  
  @ManyToOne(() => User, user => user.ownedProjects)
  owner: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable()
  members: User[];
}