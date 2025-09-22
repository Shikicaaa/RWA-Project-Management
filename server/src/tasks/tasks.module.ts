import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Project } from 'src/projects/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Project]), AuthModule, UsersModule],
  controllers: [TasksController],
  providers: [TasksService],
})

export class TasksModule {}
