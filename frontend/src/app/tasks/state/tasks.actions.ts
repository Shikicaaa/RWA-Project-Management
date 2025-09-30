import { createAction, props } from '@ngrx/store';
import { CreateTaskDto, UpdateTaskDto } from '../../core/services/projects-api.service';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';

export const TasksActions = {
  createTask: createAction(
    '[Project Details] Create Task',
    props<{ projectId: string; taskData: CreateTaskDto }>()
  ),
  createTaskSuccess: createAction(
    '[Tasks API] Create Task Success',
    props<{ task: Task }>()
  ),
  createTaskFailure: createAction(
    '[Tasks API] Create Task Failure',
    props<{ error: any }>()
  ),

  completeTask: createAction(
    '[Task Item] Complete Task',
    props<{ taskId: string }>()
  ),
  completeTaskSuccess: createAction(
    '[Tasks API] Complete Task Success',
    props<{ taskId: string; updatedUser: User }>()
  ),
  completeTaskFailure: createAction(
    '[Tasks API] Complete Task Failure',
    props<{ error: any }>()
  ),
  deleteTask: createAction(
    '[Project Details] Delete Task',
    props<{ taskId: string }>()
  ),
  deleteTaskSuccess: createAction(
    '[Tasks API] Delete Task Success',
    props<{ taskId: string }>()
  ),
  deleteTaskFailure: createAction(
    '[Tasks API] Delete Task Failure',
    props<{ error: any }>()
  ),
};