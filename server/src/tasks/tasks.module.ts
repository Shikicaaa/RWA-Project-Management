import { Module, forwardRef } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Project } from 'src/projects/project.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { Comment } from 'src/comments/comment.entity';
import { CommentsService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Project, Comment]), AuthModule, UsersModule, forwardRef(() => ProjectsModule)],
  controllers: [TasksController],
  providers: [TasksService, CommentsService],
  exports: [TasksService]
})



export class TasksModule {}
