import { Component, input, output } from '@angular/core';
import { UserPreview } from '../../interfaces/user.interface';

@Component({
  selector: 'v-user-card',
  standalone: true,
  template: `
    <div class="user-card" (click)="onSelect()">
      <div class="user-avatar">
        @if (user().avatar_url) {
        <img [src]="user().avatar_url" [alt]="user().name" />
        } @else {
        <div class="avatar-placeholder">
          {{ getInitials(user().name) }}
        </div>
        }
      </div>

      <div class="user-info">
        <h3 class="user-name">{{ user().name }}</h3>
        <p class="user-email">{{ user().email }}</p>
      </div>

      <div class="user-actions" (click)="$event.stopPropagation()">
        <button
          class="btn btn-sm btn-outline"
          (click)="onEdit()"
          title="Edit user"
        >
          Edit
        </button>
        <button
          class="btn btn-sm btn-danger"
          (click)="onDelete()"
          title="Delete user"
        >
          Delete
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .user-card {
        display: flex;
        align-items: center;
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
        gap: 1rem;
      }

      .user-card:hover {
        border-color: #007bff;
        box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
        transform: translateY(-1px);
      }

      .user-avatar {
        flex-shrink: 0;
      }

      .user-avatar img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
      }

      .avatar-placeholder {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #007bff, #0056b3);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.2rem;
      }

      .user-info {
        flex: 1;
        min-width: 0;
      }

      .user-name {
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-email {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-actions {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
      }

      .btn {
        padding: 0.375rem 0.75rem;
        border: 1px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
      }

      .btn-outline {
        background: transparent;
        border-color: #6c757d;
        color: #6c757d;
      }

      .btn-outline:hover {
        background: #6c757d;
        color: white;
      }

      .btn-danger {
        background: transparent;
        border-color: #dc3545;
        color: #dc3545;
      }

      .btn-danger:hover {
        background: #dc3545;
        color: white;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .user-card {
          flex-direction: column;
          text-align: center;
          gap: 0.75rem;
        }

        .user-info {
          order: 2;
        }

        .user-actions {
          order: 3;
          justify-content: center;
        }

        .user-name,
        .user-email {
          white-space: normal;
          overflow: visible;
          text-overflow: unset;
        }
      }
    `,
  ],
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
