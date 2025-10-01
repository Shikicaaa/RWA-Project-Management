import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { Project } from '../../models/project.model';
import { ProjectsActions } from './projects.actions';
import { AdminActions } from '../../admin/state/admin.actions';

export interface ProjectsState extends EntityState<Project> {
  isLoading: boolean;
  error: any | null;
}

export const projectsAdapter: EntityAdapter<Project> = createEntityAdapter<Project>();

export const initialState: ProjectsState = projectsAdapter.getInitialState({
  isLoading: false,
  error: null,
});

export const projectsFeature = createFeature({
  name: 'projects',
  reducer: createReducer(
    initialState,

    on(ProjectsActions.loadProjects, ProjectsActions.createProject, (state) => ({
      ...state,
      isLoading: true,
    })),

    on(ProjectsActions.loadProjectsFailure, ProjectsActions.createProjectFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    on(ProjectsActions.loadProjectsSuccess, (state, { projects }) => {
      return projectsAdapter.setAll(projects, { ...state, isLoading: false });
    }),

    on(ProjectsActions.createProjectSuccess, (state, { project }) => {
      return projectsAdapter.addOne(project, { ...state, isLoading: false });
    }),
    on(ProjectsActions.loadProject, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(ProjectsActions.loadProjectSuccess, (state, { project }) => {
      return projectsAdapter.upsertOne(project, { ...state, isLoading: false });
    }),
    on(ProjectsActions.addMemberSuccess, (state, { project }) => {
      return projectsAdapter.upsertOne(project, state);
    }),
    on(AdminActions.loadAllProjectsSuccess, (state, { projects }) => {
      return projectsAdapter.setAll(projects, state);
    })
  ),
});

export const {
    selectAll,
    selectTotal,
} = projectsAdapter.getSelectors(projectsFeature.selectProjectsState);

export const {
    selectIsLoading,
    selectError
} = projectsFeature;