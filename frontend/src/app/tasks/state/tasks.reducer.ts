import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ProjectsActions } from '../../projects/state/projects.actions';
import { Task, TaskStatus } from '../../models/task.model';
import { Comment } from '../../models/comment.model';
import { TasksActions } from './tasks.actions';

export interface TasksState extends EntityState<Task> {
  isLoading: boolean;
  error: any | null;
}

export const tasksAdapter: EntityAdapter<Task> = createEntityAdapter<Task>();

export const initialState: TasksState = tasksAdapter.getInitialState({
  isLoading: false,
  error: null,
});

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: createReducer(
    initialState,

    on(ProjectsActions.loadProjectSuccess, (state, { project }) => {
      if (!project || !project.tasks) {
        return state;
      }
      const projectInfo = { ...project, tasks: [] }; 

      const tasksWithProjectContext = project.tasks.map(task => ({
        ...task,
        project: projectInfo,
      }));

      return tasksAdapter.upsertMany(tasksWithProjectContext, state);
    }),

    on(TasksActions.createTask, TasksActions.completeTask, (state) => ({
      ...state,
      isLoading: true,
    })),

    on(TasksActions.createTaskSuccess, (state, { task }) => {
      return tasksAdapter.addOne(task, { ...state, isLoading: false });
    }),

    on(TasksActions.completeTaskSuccess, (state, { taskId }) => {
      return tasksAdapter.updateOne({
        id: taskId,
        changes: { status: TaskStatus.DONE }
      }, state);
    }),

    on(TasksActions.createTaskFailure, TasksActions.completeTaskFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),
    on(TasksActions.deleteTaskSuccess, (state, { taskId }) => {
        return tasksAdapter.removeOne(taskId, state);
    }),
    on(TasksActions.updateTaskSuccess, (state, { task }) => {
        if (typeof task.id === 'string') {
        }
        const newState = tasksAdapter.updateOne(task, state);
        if (typeof task.id === 'string') {
        }
        return newState;
    }),
    on(TasksActions.createCommentSuccess, (state, { comment }) => {
      const taskId = comment.task.id;
      
      if (!taskId) {
        return state;
      }
      
      const task = state.entities[taskId];
      if (!task) {
        return state;
      }
      
      const updatedTask = {
        ...task,
        comments: [...task.comments, comment],
      };

      return tasksAdapter.updateOne({ id: taskId, changes: updatedTask }, state);
    }),
    on(TasksActions.setDependenciesSuccess, (state, { task }) => {
      return tasksAdapter.updateOne(task, state);
    }),
  ),
  
});

export const { selectAll, selectEntities } = tasksAdapter.getSelectors(
  tasksFeature.selectTasksState
);