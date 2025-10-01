import { User } from './user.model';
import { Task } from './task.model';

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: User;
  task: Partial<Task>;
}