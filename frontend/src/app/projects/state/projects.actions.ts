import { createAction, props } from '@ngrx/store';
import { CreateProjectDto } from '../../core/services/projects-api.service';
import { Project } from '../../models/project.model';

export const ProjectsActions = {
  loadProjects: createAction('[Projects Page] Load Projects'),
  loadProjectsSuccess: createAction(
    '[Projects API] Load Projects Success',
    props<{ projects: Project[] }>()
  ),
  loadProjectsFailure: createAction(
    '[Projects API] Load Projects Failure',
    props<{ error: any }>()
  ),

  createProject: createAction(
    '[Projects Page] Create Project',
    props<{ projectData: CreateProjectDto }>()
  ),
  createProjectSuccess: createAction(
    '[Projects API] Create Project Success',
    props<{ project: Project }>()
  ),
  createProjectFailure: createAction(
    '[Projects API] Create Project Failure',
    props<{ error: any }>()
  ),
  loadProject: createAction(
    '[Project Details Page] Load Project',
    props<{ id: string }>()
  ),
  loadProjectSuccess: createAction(
    '[Projects API] Load Project Success',
    props<{ project: Project }>()
  ),
  loadProjectFailure: createAction(
    '[Projects API] Load Project Failure',
    props<{ error: any }>()
  ),
};