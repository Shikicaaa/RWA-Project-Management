import { Controller, Post, Body, UseGuards, Req, Patch, Param, Get, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(
      private readonly tasksService: TasksService,
  ) {}

  @Get()
  getTasks(@Req() req) {
    return this.tasksService.getTasks(req.user);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string, @Req() req) {
    return this.tasksService.getTaskById(id, req.user);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: any, @Req() req) {
    return this.tasksService.updateTask(id, updateTaskDto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTask(@Param('id') id: string, @Req() req) {
    return this.tasksService.deleteTask(id, req.user);
  }

  @Patch(':id/complete')
  completeTask(@Param('id') id: string, @Req() req) {
    return this.tasksService.completeTask(id, req.user);
  }

  @Patch(':id/assignees')
  assignTask(
    @Param('id') taskId: string,
    @Body('memberIds') memberIds: string[],
    @Req() req,
  ) {
    return this.tasksService.assignTaskToMembers(taskId, memberIds, req.user);
  }
}