import { Component, input, output } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';
import { UserPreview } from '../../interfaces/user.interface';

@Component({
  selector: 'v-user-list',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  // Inputs
  users = input.required<UserPreview[]>();

  // Outputs
  select = output<UserPreview>();
  edit = output<UserPreview>();
  delete = output<UserPreview>();

  // Event handlers
  onUserSelect(user: UserPreview): void {
    this.select.emit(user);
  }

  onUserEdit(user: UserPreview): void {
    this.edit.emit(user);
  }

  onUserDelete(user: UserPreview): void {
    this.delete.emit(user);
  }
}
