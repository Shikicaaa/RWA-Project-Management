import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private usersService: UsersService,
) {}

  async createProject(createProjectDto: any, owner: User): Promise<Project> {
    const { name, description } = createProjectDto;
    const project = this.projectsRepository.create({
      name,
      description,
      owner,
      members: [owner],
    });
    return this.projectsRepository.save(project);
  }

  async getProjectsForUser(user: User): Promise<Project[]> {
    return this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoin('project.members', 'member')
      .where('member.id = :userId', { userId: user.id })
      .distinct(true)
      .getMany();
  }

  async getProjectById(id: string, user: User): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: [
        'owner', 
        'members', 
        'tasks', 
        'tasks.creator',
        'tasks.comments', 
        'tasks.comments.author'
      ],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isMember = project.members.some((member) => member.id === user.id);
    const isOwner = project.owner && project.owner.id === user.id;

    if (!isMember && !isOwner) {
      throw new UnauthorizedException('You are not authorized to view this project');
    }

    return project;
  }
  
  async updateProject(id: string, updateProjectDto: any, user: User): Promise<Project> {
      const project = await this.getProjectById(id, user);

      const isOwner = project.owner.id === user.id;
      const isManager = user.role === UserRole.PROJECT_MANAGER;
      const isAdmin = user.role === UserRole.ADMIN;

      if(!isOwner && !isManager && !isAdmin) {
          throw new UnauthorizedException('Only the owner or project manager can edit the project');
      }

      const { name, description } = updateProjectDto;
      project.name = name ?? project.name;
      project.description = description ?? project.description;

      return this.projectsRepository.save(project);
  }

  async deleteProject(id: string, user: User): Promise<void> {
    const project = await this.getProjectById(id, user);

    const isOwner = project.owner.id === user.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
        throw new UnauthorizedException('Only the project owner or an admin can delete the project');
    }

    await this.projectsRepository.remove(project);
  }

  // PROJECT MEMBER RELATED STVARI

  async addMemberToProject(projectId: string, memberEmail: string, currentUser: User): Promise<Project> {
    const project = await this.getProjectById(projectId, currentUser);

    const isOwner = project.owner.id === currentUser.id;
    const isManager = currentUser.role === UserRole.PROJECT_MANAGER;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isOwner && !isManager && !isAdmin) {
        throw new UnauthorizedException('You do not have permission to add members');
    }

    const memberToAdd = await this.usersService.findOneByEmail(memberEmail);
    if (!memberToAdd) {
        throw new NotFoundException('User to add not found');
    }

    const isAlreadyMember = project.members.some(member => member.id === memberToAdd.id);
    if (isAlreadyMember) {
        return project;
    }

    project.members.push(memberToAdd);
    return this.projectsRepository.save(project);
  }

  async removeMemberFromProject(projectId: string, memberId: string, currentUser: User): Promise<Project> {
    const project = await this.getProjectById(projectId, currentUser);

    const isOwner = project.owner.id === currentUser.id;
    const isManager = currentUser.role === UserRole.PROJECT_MANAGER;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isOwner && !isManager && !isAdmin) {
        throw new UnauthorizedException('You do not have permission to remove members');
    }
    
    if (project.owner.id === memberId) {
        throw new UnauthorizedException('Owner cannot be removed from the project');
    }
    
    project.members = project.members.filter(member => member.id !== memberId);
    return this.projectsRepository.save(project);
  }
  
  async findAllAdmin(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: [
        'owner', 
        'members', 
        'tasks', 
        'tasks.comments', 
        'tasks.comments.author'
      ],
    });
  }
}