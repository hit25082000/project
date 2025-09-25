import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserPreview } from '../../interfaces/user.interface';
import { UserListComponent } from './user-list.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserListComponent],
  template: `
    <div class="user-list-page">
      <!-- Header Section -->
      <header class="page-header">
        <h1>Users</h1>
        <div class="header-actions">
          <button
            class="btn btn-primary"
            (click)="onCreateUser()"
            [disabled]="isLoading()"
          >
            Add User
          </button>
        </div>
      </header>

      <!-- Search Section -->
      <section class="search-section">
        <div class="search-container">
          <input
            type="text"
            placeholder="Search users..."
            [value]="searchTerm()"
            (input)="onSearch($event)"
            class="search-input"
          />
          @if (searchTerm()) {
          <button class="btn btn-secondary btn-sm" (click)="onClearSearch()">
            Clear
          </button>
          }
        </div>
      </section>

      <!-- Main Content -->
      <main class="page-content">
        @if (isLoading()) {
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
        } @else if (error()) {
        <div class="error-container">
          <h3>Error loading users</h3>
          <p>{{ error()?.message || 'An unexpected error occurred' }}</p>
          <button class="btn btn-primary" (click)="onRetry()">Try Again</button>
        </div>
        } @else if (users().length === 0) {
        <div class="empty-container">
          <h3>No users found</h3>
          <p>
            @if (searchTerm()) { No users match your search criteria. } @else {
            Get started by creating your first user. }
          </p>
          @if (!searchTerm()) {
          <button class="btn btn-primary" (click)="onCreateUser()">
            Create User
          </button>
          }
        </div>
        } @else {
        <v-user-list
          [users]="users()"
          (select)="onUserSelect($event)"
          (edit)="onUserEdit($event)"
          (delete)="onUserDelete($event)"
        />
        }
      </main>
    </div>
  `,
  styles: [
    `
      .user-list-page {
        padding: 1rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e0e0e0;
      }

      .page-header h1 {
        margin: 0;
        color: #333;
      }

      .search-section {
        margin-bottom: 2rem;
      }

      .search-container {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      .search-input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .search-input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }

      .page-content {
        min-height: 400px;
      }

      .loading-container,
      .error-container,
      .empty-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        text-align: center;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-primary {
        background-color: #007bff;
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background-color: #0056b3;
      }

      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }

      .btn-secondary:hover:not(:disabled) {
        background-color: #545b62;
      }

      .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
      }

      .error-container h3,
      .empty-container h3 {
        color: #dc3545;
        margin-bottom: 0.5rem;
      }

      .empty-container h3 {
        color: #6c757d;
      }
    `,
  ],
})
export class UserListPage {
  // Dependencies
  private userService = inject(UserService);
  private router = inject(Router);

  // Connect service signals directly
  users = this.userService.users;
  isLoading = this.userService.isLoading;
  error = this.userService.error;
  searchTerm = this.userService.searchTerm;

  // Event handlers
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.userService.search(target.value);
  }

  onClearSearch(): void {
    this.userService.clearSearch();
  }

  onUserSelect(user: UserPreview): void {
    this.userService.selectById(user.id);
    // Navigate to user details page
    this.router.navigate(['/users', user.id]);
  }

  onUserEdit(user: UserPreview): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  async onUserDelete(user: UserPreview): Promise<void> {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await this.userService.deleteUser(user.id);
      } catch (error) {
        // Error is already handled by the service
        console.error('Failed to delete user:', error);
      }
    }
  }

  onCreateUser(): void {
    this.router.navigate(['/users/create']);
  }

  onRetry(): void {
    // Trigger a refresh by updating the search term
    const currentTerm = this.searchTerm();
    this.userService.search(currentTerm + ' ');
    this.userService.search(currentTerm);
  }
}
