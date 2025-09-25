import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserPreview } from '../../interfaces/user.interface';
import { UserListComponent } from './user-list.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './user-list.page.html',
  styleUrl: './user-list.page.scss',
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
      }
    }
  }

  onCreateUser(): void {
    this.router.navigate(['/users/create']);
  }

  onRetry(): void {
    this.userService.refresh();
  }
}
