import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
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
      .leftJoin('project.members', 'member')
      .where('member.id = :userId', { userId: user.id })
      .getMany();
  }

  async getProjectById(id: string, user: User): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'tasks'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isMember = project.members.some((member) => member.id === user.id);
    if (!isMember) {
      throw new UnauthorizedException('You are not a member of this project');
    }
    return project;
  }
  
  async updateProject(id: string, updateProjectDto: any, user: User): Promise<Project> {
      const project = await this.getProjectById(id, user);

      if(project.owner.id !== user.id){
          throw new UnauthorizedException('Only the project owner can edit the project');
      }

      const { name, description } = updateProjectDto;
      project.name = name ?? project.name;
      project.description = description ?? project.description;

      return this.projectsRepository.save(project);
  }

  async deleteProject(id: string, user: User): Promise<void> {
    const project = await this.getProjectById(id, user);

    if (project.owner.id !== user.id) {
        throw new UnauthorizedException('Only the project owner can delete the project');
    }

    await this.projectsRepository.remove(project);
  }

  // PROJECT MEMBER RELATED STVARI
  async addMemberToProject(projectId: string, memberEmail: string, owner: User): Promise<Project> {
    const project = await this.getProjectById(projectId, owner);

    if (project.owner.id !== owner.id) {
        throw new UnauthorizedException('Only the project owner can add members');
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

  async removeMemberFromProject(projectId: string, memberId: string, owner: User): Promise<Project> {
    const project = await this.getProjectById(projectId, owner);

    if (project.owner.id !== owner.id) {
        throw new UnauthorizedException('Only the project owner can remove members');
    }

    if(project.owner.id === memberId){
        throw new UnauthorizedException('Owner cannot be removed from the project');
    }
    
    project.members = project.members.filter(member => member.id !== memberId);
    return this.projectsRepository.save(project);
  }
}