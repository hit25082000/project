import { Injectable, inject, signal, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { UserApi } from '../apis/user.api';
import { GlobalErrorHandler } from '@shared/errors/global-error-handler';
import { NotificationService } from '@shared/services/notification.service';
import {
  User,
  UserPreview,
  UserCreate,
  UserUpdate,
  UserDetails,
} from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  // Dependencies
  private api = inject(UserApi);
  private errorHandler = inject(GlobalErrorHandler);
  private notificationService = inject(NotificationService);

  // State management
  private readonly selectedId = signal<string | null>(null);
  readonly searchTerm = signal<string>('');

  // List resource (Preview data)
  private readonly listResource = rxResource({
    stream: () => from(this.api.getUsers(this.searchTerm())),
  });

  // Details resource (Full data for selected user)
  private readonly detailsResource = rxResource({
    stream: () => {
      const id = this.selectedId();
      return id ? from(this.api.getUserById(id)) : from(new Promise(() => {}));
    },
  });

  // Public signals - simplified and consolidated
  readonly users = computed(() => this.listResource.value() || []);
  readonly selectedUser = computed<User | null>(
    () => this.detailsResource.value() as User | null
  );
  readonly isLoading = computed(
    () => this.listResource.isLoading() || this.detailsResource.isLoading()
  );
  readonly error = computed(
    () => this.listResource.error() || this.detailsResource.error()
  );

  // Actions

  /**
   * Select a user by ID to load their details
   * @param id - User ID
   */
  selectById(id: string): void {
    this.selectedId.set(id);
  }

  /**
   * Clear the selected user
   */
  clearSelection(): void {
    this.selectedId.set(null);
  }

  /**
   * Search users by term
   * @param term - Search term
   */
  search(term: string): void {
    this.searchTerm.set(term);
  }

  /**
   * Clear search term
   */
  clearSearch(): void {
    this.searchTerm.set('');
  }

  /**
   * Create a new user
   * @param user - User data to create
   */
  async createUser(user: UserCreate): Promise<User> {
    try {
      const newUser = await this.api.createUser(user);
      this.notificationService.success('User created successfully');
      // Resources will automatically refresh when dependencies change
      return newUser;
    } catch (error) {
      this.errorHandler.handleError(error, 'Creating user');
      throw error;
    }
  }

  /**
   * Update user by ID
   * @param id - User ID
   * @param user - User data to update
   */
  async updateUser(id: string, user: UserUpdate): Promise<User> {
    try {
      const updatedUser = await this.api.updateUser(id, user);
      this.notificationService.success('User updated successfully');
      // Resources will automatically refresh when dependencies change
      return updatedUser;
    } catch (error) {
      this.errorHandler.handleError(error, 'Updating user');
      throw error;
    }
  }

  /**
   * Delete user by ID
   * @param id - User ID
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await this.api.deleteUser(id);
      this.notificationService.success('User deleted successfully');

      // Clear selection if deleted user was selected
      if (this.selectedId() === id) {
        this.selectedId.set(null);
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'Deleting user');
      throw error;
    }
  }

  /**
   * Get users count with optional search
   * @param searchTerm - Optional search term
   */
  async getUsersCount(searchTerm?: string): Promise<number> {
    try {
      return await this.api.getUsersCount(searchTerm);
    } catch (error) {
      this.errorHandler.handleError(error, 'Counting users');
      throw error;
    }
  }

  /**
   * Check if a user exists by email
   * @param email - User email
   */
  async userExists(email: string): Promise<boolean> {
    try {
      const user = await this.api.getUserByEmail(email);
      return user !== null;
    } catch (error) {
      this.errorHandler.handleError(error, `Checking if user exists ${email}`);
      return false;
    }
  }

  /**
   * Force refresh of user list data
   */
  refresh(): void {
    // Force refresh by triggering the resource stream again
    // This will cause the rxResource to re-execute the API call
    this.listResource.reload();
  }

  /**
   * Reset all service state
   */
  reset(): void {
    this.selectedId.set(null);
    this.searchTerm.set('');
  }
}
