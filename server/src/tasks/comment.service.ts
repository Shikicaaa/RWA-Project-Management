import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comments/comment.entity';
import { TasksService } from './tasks.service';
import { User } from 'src/users/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private tasksService: TasksService,
  ) {}

  async createComment(taskId: string, createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const task = await this.tasksService.getTaskById(taskId, user);
    const { content } = createCommentDto;

    const comment = this.commentsRepository.create({
      content,
      task,
      author: user,
    });

    return this.commentsRepository.save(comment);
  }
}