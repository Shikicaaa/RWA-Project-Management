import { Project } from 'src/projects/project.entity';
import { User } from 'src/users/user.entity';
import { Comment } from 'src/comments/comment.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, ManyToMany, OneToMany } from 'typeorm';

export enum TaskDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum TaskStatus {
  TO_DO = 'to_do',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TO_DO,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskDifficulty,
  })
  difficulty: TaskDifficulty;

  @Column()
  xpValue: number;

  @ManyToOne(() => User)
  creator: User;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  user: User;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @ManyToMany(() => User, user => user.assignedTasks)
  @JoinTable()
  assignees: User[];

  @OneToMany(() => Comment, (comment) => comment.task, { eager: true, cascade: true })
  comments: Comment[];

  @ManyToMany(() => Task, task => task.blocking)
  @JoinTable({
    name: 'task_dependencies',
    joinColumn: { name: 'taskId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'dependencyId', referencedColumnName: 'id' },
  })
  dependencies: Task[];

  @ManyToMany(() => Task, task => task.dependencies)
  blocking: Task[];
}