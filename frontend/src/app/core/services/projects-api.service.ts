import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../../models/project.model';
import { environment } from '../../../environment/environment';
import { Task, TaskDifficulty } from '../../models/task.model';
import { Comment } from '../../models/comment.model';

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    difficulty: TaskDifficulty;
    comments?: Comment[];
    status?: Task['status'];
}

export interface UpdateTaskDto{
    title?: string;
    description?: string;
    difficulty?: TaskDifficulty;
    comments?: Comment[];
    status?: Task['status'];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  getProjectsForUser(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(projectData: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, projectData);
  }

  updateProject(id: string, updateData: UpdateProjectDto): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/${id}`, updateData);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addMemberToProject(projectId: string, email: string): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/${projectId}/members`, { email });
  }

  removeMemberFromProject(projectId: string, memberId: string): Observable<Project> {
    return this.http.delete<Project>(`${this.apiUrl}/${projectId}/members/${memberId}`);
  }

  createTaskInProject(projectId: string, taskData: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/${projectId}/tasks`, taskData);
  }
}