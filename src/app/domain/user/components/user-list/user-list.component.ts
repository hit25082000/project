import { Component, input, output } from '@angular/core';
import { UserCardComponent } from './user-card.component';
import { UserPreview } from '../../interfaces/user.interface';

@Component({
  selector: 'v-user-list',
  standalone: true,
  imports: [UserCardComponent],
  template: `
    <div class="user-list">
      @if (users().length === 0) {
      <div class="empty-state">
        <p>No users to display</p>
      </div>
      } @else {
      <div class="user-grid">
        @for (user of users(); track user.id) {
        <v-user-card
          [user]="user"
          (select)="onUserSelect($event)"
          (edit)="onUserEdit($event)"
          (delete)="onUserDelete($event)"
        />
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      .user-list {
        width: 100%;
      }

      .user-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1rem;
      }

      .empty-state {
        text-align: center;
        padding: 3rem;
        color: #6c757d;
      }

      .empty-state p {
        margin: 0;
        font-size: 1.1rem;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .user-grid {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
      }

      @media (min-width: 1200px) {
        .user-grid {
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        }
      }
    `,
  ],
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
