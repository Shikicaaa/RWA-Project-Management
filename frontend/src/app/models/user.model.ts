export enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  MEMBER = 'member',
}

export interface User {
  id: string;
  email: string;
  username: string;
  xp: number;
  level: number;
  role: UserRole;
}