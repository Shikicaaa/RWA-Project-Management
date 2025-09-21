import { Controller, Post, Body, UseGuards, Req, Patch, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDto: any, @Req() req) {
    return this.tasksService.createTask(createTaskDto, req.user);
  }

  @Patch(':id/complete')
  completeTask(@Param('id') id: string, @Req() req) {
    return this.tasksService.completeTask(id, req.user);
  }
}