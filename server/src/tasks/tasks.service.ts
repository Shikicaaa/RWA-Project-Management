import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Task, TaskDifficulty, TaskStatus } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
  ) {}

  private getXpForDifficulty(difficulty: TaskDifficulty): number {
    switch (difficulty) {
      case TaskDifficulty.EASY:
        return 10;
      case TaskDifficulty.MEDIUM:
        return 25;
      case TaskDifficulty.HARD:
        return 50;
      default:
        return 0;
    }
  }

  async createTask(createTaskDto: any, user: User): Promise<Task> {
    const { title, description, difficulty } = createTaskDto;
    
    const xpValue = this.getXpForDifficulty(difficulty);

    const task = this.tasksRepository.create({
      title,
      description,
      difficulty,
      xpValue,
      user,
    });

    return this.tasksRepository.save(task);
  }

  async completeTask(id: string, user: User): Promise<User> {
    const task = await this.tasksRepository.findOne({ where: { id }, relations: ['user'] });
    
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    if (task.user.id !== user.id) {
        throw new UnauthorizedException('You are not authorized to complete this task');
    }
    
    if(task.status === TaskStatus.DONE) {
        console.log("Task already completed");
        return user;
    }

    task.status = TaskStatus.DONE;
    await this.tasksRepository.save(task);

    const owner = await this.usersRepository.findOneBy({ id: user.id });
    if (!owner) {
      throw new NotFoundException(`User with ID "${user.id}" not found`);
    }
    owner.xp += task.xpValue;
    
    await this.usersRepository.save(owner);

    const updatedUserWithLevel = await this.usersService.checkLevelUp(owner);

    return updatedUserWithLevel;

  }
}