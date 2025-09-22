import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), AuthModule, UsersModule, TasksModule],
  providers: [ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule {}
