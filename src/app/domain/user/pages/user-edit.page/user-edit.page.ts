import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserEditComponent } from '../../components/user-edit/user-edit.component';
import { UserUpdate, User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [UserEditComponent],
  templateUrl: './user-edit.page.html',
  styleUrl: './user-edit.page.scss',
})
export class UserEditPage {
  // Dependencies
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Get user ID from route
  private userId = this.route.snapshot.params['id'];

  // Connect service signals directly
  selectedUser = this.userService.selectedUser;
  isLoading = this.userService.isLoading;
  error = this.userService.error;

  constructor() {
    // Select the user when the page loads
    this.userService.selectById(this.userId);
  }

  // Event handlers
  async onSave(updateData: UserUpdate): Promise<void> {
    try {
      await this.userService.updateUser(this.userId, updateData);
      // Navigate back to user list after successful update
      this.router.navigate(['/users']);
    } catch (error) {
      // Error is already handled by the service
    }
  }

  onCancel(): void {
    // Navigate back to user list
    this.router.navigate(['/users']);
  }
}
