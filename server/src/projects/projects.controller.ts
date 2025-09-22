import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  createProject(@Body() createProjectDto: any, @Req() req) {
    return this.projectsService.createProject(createProjectDto, req.user);
  }

  @Get()
  getProjectsForUser(@Req() req) {
    return this.projectsService.getProjectsForUser(req.user);
  }

  @Get(':id')
  getProjectById(@Param('id') id: string, @Req() req) {
    return this.projectsService.getProjectById(id, req.user);
  }

  @Patch(':id')
  updateProject(@Param('id') id: string, @Body() updateProjectDto: any, @Req() req) {
    return this.projectsService.updateProject(id, updateProjectDto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProject(@Param('id') id: string, @Req() req) {
    return this.projectsService.deleteProject(id, req.user);
  }

  @Post(':id/members')
  addMember(@Param('id') projectId: string, @Body('email') email: string, @Req() req) {
    return this.projectsService.addMemberToProject(projectId, email, req.user);
  }

  @Delete(':id/members/:memberId')
  removeMember(@Param('id') projectId: string, @Param('memberId') memberId: string, @Req() req){
    return this.projectsService.removeMemberFromProject(projectId, memberId, req.user);
  }
}