import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/project.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5433,
      host: '127.0.0.1',
      username: 'shikicaaa',
      password: 'shikicaaa123',
      database: 'project_management',
      entities: [User, Task, Project],
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    TasksModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
