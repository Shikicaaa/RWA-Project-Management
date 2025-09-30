import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskDifficulty, TaskStatus } from '../../models/task.model';
import { environment } from '../../../environment/environment';
import { User } from '../../models/user.model';

// DTO za ažuriranje taska
export interface UpdateTaskDto {
    title?: string;
    description?: string;
    difficulty?: TaskDifficulty;
    status?: TaskStatus;
}

@Injectable({
  providedIn: 'root'
})
export class TasksApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks`;

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, updateTaskDto);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  completeTask(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/complete`, {});
  }

  assignTaskToMembers(taskId: string, memberIds: string[]): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/assignees`, { memberIds });
  }
}