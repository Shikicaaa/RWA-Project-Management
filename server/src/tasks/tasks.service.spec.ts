import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { User, UserRole } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

const projectOwner: User = { id: 'owner-uuid', role: UserRole.MEMBER, xp: 100 } as User;
const regularUser: User = { id: 'user-uuid', role: UserRole.MEMBER, xp: 50 } as User;
const adminUser: User = { id: 'admin-uuid', role: UserRole.ADMIN, xp: 1000 } as User;

// mock projekat
const mockProject: Project = {
  id: 'project-uuid',
  owner: projectOwner,
  members: [projectOwner, regularUser],
} as Project;

// mock zadatak
const mockTask: Task = {
  id: 'task-uuid',
  title: 'Test Task',
  status: TaskStatus.IN_PROGRESS,
  xpValue: 25,
  project: mockProject,
} as Task;


describe('TasksService', () => {
  let service: TasksService;
  let tasksRepository: Repository<Task>;
  let projectsRepository: Repository<Project>;
  let usersRepository: Repository<User>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Project),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            checkLevelUp: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    tasksRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    projectsRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    const createTaskDto = { title: 'New Test Task', difficulty: 'easy' };
    it('should allow the project owner to create a task', async () => {
      jest.spyOn(projectsRepository, 'findOne').mockResolvedValue(mockProject);
      jest.spyOn(tasksRepository, 'create').mockReturnValue(createTaskDto as any);
      jest.spyOn(tasksRepository, 'save').mockResolvedValue({ id: 'task-uuid', ...createTaskDto } as any);

      await expect(
        service.createTask(createTaskDto, mockProject.id, projectOwner)
      ).resolves.toBeDefined();

      expect(projectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProject.id },
        relations: ['owner', 'members'],
      });
      expect(tasksRepository.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when a regular user tries to create a task', async () => {
      jest.spyOn(projectsRepository, 'findOne').mockResolvedValue(mockProject);

      await expect(
        service.createTask(createTaskDto, mockProject.id, regularUser)
      ).rejects.toThrow(UnauthorizedException);
      
      expect(tasksRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('completeTask', () => {
    it('should complete a task, add XP to the user, and check for level up', async () => {
      const taskToComplete = { ...mockTask, status: TaskStatus.IN_PROGRESS };
      const userCompleting = { ...regularUser };
      
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(taskToComplete);
      jest.spyOn(tasksRepository, 'save').mockResolvedValue({ ...taskToComplete, status: TaskStatus.DONE });
      jest.spyOn(usersRepository, 'save').mockResolvedValue({ ...userCompleting, xp: userCompleting.xp + taskToComplete.xpValue });

      jest.spyOn(usersService, 'checkLevelUp').mockImplementation(user => Promise.resolve(user));

      await service.completeTask(taskToComplete.id, userCompleting);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({ where: { id: taskToComplete.id }, relations: ['project', 'project.members'] });
      expect(tasksRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: TaskStatus.DONE }));
      expect(usersRepository.save).toHaveBeenCalledWith(expect.objectContaining({ xp: 75 })); // 50 (početni) + 25 (od taska)
      expect(usersService.checkLevelUp).toHaveBeenCalled();
    });

    it('should NOT add XP or save if the task is already completed', async () => {
      const alreadyDoneTask = { ...mockTask, status: TaskStatus.DONE };
      const userCompleting = { ...regularUser };
      
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(alreadyDoneTask);

      const taskSaveSpy = jest.spyOn(tasksRepository, 'save');
      const userSaveSpy = jest.spyOn(usersRepository, 'save');

      await service.completeTask(alreadyDoneTask.id, userCompleting);

      expect(taskSaveSpy).not.toHaveBeenCalled();
      expect(userSaveSpy).not.toHaveBeenCalled();
    });
  });
});