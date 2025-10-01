import { Controller, Get, UseGuards, Patch, Param, Body, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';
import { AdminOrManagerGuard } from 'src/auth/admin-or-manager.guard';
import { UserRole } from 'src/users/user.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService
  ) {}

  @Get('projects')
  @UseGuards(AdminOrManagerGuard)
  getAllProjects() {
    return this.projectsService.findAllAdmin();
  }

  @Get('users')
  @UseGuards(AdminGuard)
  getAllUsers() {
    return this.usersService.findAll();
  }
  
  @Patch('users/:id/role')
  @UseGuards(AdminGuard)
  updateUserRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.usersService.updateRole(id, role);
  }

  @Delete('users/:id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}