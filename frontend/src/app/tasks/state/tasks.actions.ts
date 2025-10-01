import { createAction, props } from '@ngrx/store';
import { CreateTaskDto, UpdateTaskDto } from '../../core/services/projects-api.service';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { Comment } from '../../models/comment.model';
import { Update } from '@ngrx/entity';

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
  updateTask: createAction(
    '[Project Details] Update Task',
    props<{ taskId: string, changes: UpdateTaskDto}>()
  ),
  updateTaskSuccess: createAction(
    '[Tasks API] Update Task Success',
    props<{ task: Update<Task>}>()
  ),
  updateTaskFailure: createAction(
    '[Tasks API] Update Task Failure',
    props<{ error: any }>()
  ),
  createComment: createAction(
    '[Task Details] Create Comment',
    props<{ taskId: string; content: string }>()
  ),
  createCommentSuccess: createAction(
    '[Tasks API] Create Comment Success',
    props<{ comment: Comment }>()
  ),
  createCommentFailure: createAction(
    '[Tasks API] Create Comment Failure',
    props<{ error: any }>()
  ),
};