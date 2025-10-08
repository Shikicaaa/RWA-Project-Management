import { Controller, Post, Body, UseGuards, Req, Patch, Param, Get, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly commentsService: CommentsService,
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

  @Patch(':id/dependencies')
  setDependencies(
    @Param('id') taskId: string,
    @Body('dependencyIds') dependencyIds: string[],
    @Req() req,
  ) {
    return this.tasksService.setDependencies(taskId, dependencyIds, req.user);
  }

  @Post(':id/comments')
  createComment(
    @Param('id') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    return this.commentsService.createComment(taskId, createCommentDto, req.user);
  }
}