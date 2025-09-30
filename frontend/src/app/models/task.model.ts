import { User } from "./user.model";
import { Project } from "./project.model";

export enum TaskDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum TaskStatus {
  TO_DO = 'to_do',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  difficulty: TaskDifficulty;
  xpValue: number;
  project: Project;
  assignees: User[];
}