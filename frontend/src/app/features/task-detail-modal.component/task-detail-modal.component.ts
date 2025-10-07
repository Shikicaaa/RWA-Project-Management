import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './task-detail-modal.component.html',
})
export class TaskDetailModalComponent {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();
}