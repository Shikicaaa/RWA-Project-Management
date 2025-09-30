import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ProjectsActions } from '../../projects/state/projects.actions';
import { Task, TaskStatus } from '../../models/task.model';
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
      console.log('REDUCER: Taskovi koji se dodaju u state:', tasksWithProjectContext);

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
    })
  ),
});

export const { selectAll, selectEntities } = tasksAdapter.getSelectors(
  tasksFeature.selectTasksState
);