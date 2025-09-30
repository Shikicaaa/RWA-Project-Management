import { User } from './user.model';
import { Task } from './task.model';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner: User;
  tasks: Task[];
  members: User[];
}