import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository, In } from 'typeorm';
import { Task, TaskDifficulty, TaskStatus } from './task.entity';
import { Project } from 'src/projects/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
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
  
  async getTasks(user: User): Promise<Task[]> {
    return this.tasksRepository.find({ where: { user: { id: user.id } } });
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, user: { id: user.id } } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async updateTask(id: string, updateTaskDto: any, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    
    const { title, description, difficulty, status } = updateTaskDto;
    if(title) task.title = title;
    if(description) task.description = description;
    if(status) task.status = status;
    
    if(difficulty) {
        task.difficulty = difficulty;
        task.xpValue = this.getXpForDifficulty(difficulty);
    }
    
    return this.tasksRepository.save(task);
  }

  async createTask(createTaskDto: any, projectId: string, user: User): Promise<Task> {
    const project = await this.projectsRepository.findOne({ where: { id: projectId }, relations: ['members'] });
    if (!project) {
        throw new NotFoundException('Project not found');
    }

    const isMember = project.members.some(member => member.id === user.id);
    if (!isMember) {
        throw new UnauthorizedException('You are not a member of this project');
    }

    const { title, description, difficulty } = createTaskDto;
    const xpValue = this.getXpForDifficulty(difficulty);

    const task = this.tasksRepository.create({
      title,
      description,
      difficulty,
      xpValue,
      project,
      assignees: [],
    });

    return this.tasksRepository.save(task);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['project', 'project.members'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    const isMember = task.project.members.some(member => member.id === user.id);
    if (!isMember) {
      throw new UnauthorizedException('You are not authorized to delete this task');
    }

    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" could not be deleted`);
    }
  }

  async completeTask(id: string, user: User): Promise<User> {
    const task = await this.tasksRepository.findOne({ 
      where: { id }, 
      relations: ['project', 'project.members'] 
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    const isMember = task.project.members.some(member => member.id === user.id);
    if (!isMember) {
      throw new UnauthorizedException('You are not a member of this project');
    }

    if (task.status === TaskStatus.DONE) {
      console.log('Task already completed');
      return user;
    }

    task.status = TaskStatus.DONE;
    await this.tasksRepository.save(task);

    user.xp += task.xpValue;
    const updatedUser = await this.usersRepository.save(user);

    return this.usersService.checkLevelUp(updatedUser);
  }

  async assignTaskToMembers(taskId: string, memberIds: string[], currentUser: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['project', 'project.members'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }

    const isCurrentUserMember = task.project.members.some(member => member.id === currentUser.id);
    if (!isCurrentUserMember) {
      throw new UnauthorizedException('You are not a member of this project.');
    }

    const membersToAssign = await this.usersRepository.findBy({ id: In(memberIds) });

    const projectMemberIds = new Set(task.project.members.map(m => m.id));
    const allAssigneesAreProjectMembers = membersToAssign.every(assignee => projectMemberIds.has(assignee.id));
    
    if (!allAssigneesAreProjectMembers) {
      throw new UnauthorizedException('One or more users you are trying to assign are not members of the project.');
    }

    task.assignees = membersToAssign;
    return this.tasksRepository.save(task);
  }
}