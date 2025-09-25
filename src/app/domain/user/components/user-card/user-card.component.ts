import { Component, input, output } from '@angular/core';
import { UserPreview } from '../../interfaces/user.interface';

@Component({
  selector: 'v-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  // Inputs
  user = input.required<UserPreview>();

  // Outputs
  select = output<UserPreview>();
  edit = output<UserPreview>();
  delete = output<UserPreview>();

  // Event handlers
  onSelect(): void {
    this.select.emit(this.user());
  }

  onEdit(): void {
    this.edit.emit(this.user());
  }

  onDelete(): void {
    this.delete.emit(this.user());
  }

  // Helper methods
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
