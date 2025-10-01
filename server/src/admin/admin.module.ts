import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AdminController } from './admin.controller';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [
    UsersModule, 
    ProjectsModule
  ],
  controllers: [AdminController],
})
export class AdminModule {}