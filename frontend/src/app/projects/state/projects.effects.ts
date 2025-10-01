import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { ProjectsApiService } from "../../core/services/projects-api.service";
import { ProjectsActions } from "./projects.actions";

@Injectable()
export class ProjectsEffects {
    private actions$ = inject(Actions);
    private projectsApiService = inject(ProjectsApiService);

    loadProjects$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProjectsActions.loadProjects),
            switchMap(() =>
                this.projectsApiService.getProjectsForUser().pipe(
                    map(projects => ProjectsActions.loadProjectsSuccess({ projects })),
                    catchError(error => of(ProjectsActions.loadProjectsFailure({ error })))
                )
            )
        )
    );

    addMember$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProjectsActions.addMember),
            switchMap(({ projectId, email }) =>
                this.projectsApiService.addMemberToProject(projectId, email).pipe(
                    map(project => ProjectsActions.addMemberSuccess({ project })),
                    catchError(error => of(ProjectsActions.addMemberFailure({ error })))
                )
            )
        )
    );

    createProject$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProjectsActions.createProject),
            switchMap(({ projectData }) => 
                this.projectsApiService.createProject(projectData).pipe(
                    map(project => ProjectsActions.createProjectSuccess({ project })),
                    catchError(error => of(ProjectsActions.createProjectFailure({ error })))
                )
            )
        )
    );

    loadProject$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProjectsActions.loadProject),
            switchMap(({ id }) =>
                this.projectsApiService.getProjectById(id).pipe(
                    map(project => ProjectsActions.loadProjectSuccess({ project })),
                    catchError(error => of(ProjectsActions.loadProjectFailure({ error })))
                )
            )
        )
    );
}