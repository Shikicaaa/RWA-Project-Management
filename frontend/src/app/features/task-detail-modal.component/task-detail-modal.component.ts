import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Task } from '../../models/task.model';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, ReactiveFormsModule],
  templateUrl: './task-detail-modal.component.html',
})
export class TaskDetailModalComponent implements OnInit {
  @Input() task!: Task;
  @Input() potentialDependencies: Task[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() saveDependencies = new EventEmitter<{ taskId: string, dependencyIds: string[] }>();

  dependenciesControl = new FormControl<string[]>([]);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.task.dependencies) {
      this.dependenciesControl.setValue(this.task.dependencies.map(d => d.id!));
    }
  }

  onSave(): void {
    this.saveDependencies.emit({
      taskId: this.task.id,
      dependencyIds: this.dependenciesControl.value || []
    });
  }
}