import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  User,
  UserPreview,
  UserCreate,
  UserUpdate,
  UserDetails,
} from '../interfaces/user.interface';
import {
  ApiError,
  NotFoundError,
  ValidationError,
  GlobalErrorHandler,
} from '@shared/errors/global-error-handler';

@Injectable({ providedIn: 'root' })
export class UserApi {
  private supabase = inject(SupabaseClient);
  private errorHandler = inject(GlobalErrorHandler);

  /**
   * Get a list of users with optional search functionality
   * @param searchTerm - Optional search term to filter users by name or email
   * @param limit - Optional limit for the number of results
   * @returns Promise<UserPreview[]> - List of user previews
   */
  async getUsers(searchTerm?: string, limit?: number): Promise<UserPreview[]> {
    try {
      let query = this.supabase
        .from('users')
        .select('id, name, email, avatar_url')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
        );
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw this.errorHandler.createApiError(error, 'fetch users');
      }

      return data || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'fetch users');
    }
  }

  /**
   * Get user details by ID
   * @param id - User ID
   * @returns Promise<UserDetails | null> - User details or null if not found
   */
  async getUserById(id: string): Promise<UserDetails | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw this.errorHandler.createApiError(
          error,
          `fetch user with id ${id}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, `fetch user with id ${id}`);
    }
  }

  /**
   * Get user by email
   * @param email - User email
   * @returns Promise<User | null> - User or null if not found
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw this.errorHandler.createApiError(
          error,
          `fetch user by email ${email}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(
        error,
        `fetch user by email ${email}`
      );
    }
  }

  /**
   * Create a new user
   * @param user - User data to create
   * @returns Promise<User> - Created user
   */
  async createUser(user: UserCreate): Promise<User> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert(user)
        .select()
        .single();

      if (error) {
        throw this.errorHandler.createApiError(error, 'create user');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'create user');
    }
  }

  /**
   * Update user by ID
   * @param id - User ID
   * @param user - User data to update
   * @returns Promise<User> - Updated user
   */
  async updateUser(id: string, user: UserUpdate): Promise<User> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          ...user,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('User', id);
        }
        throw this.errorHandler.createApiError(
          error,
          `update user with id ${id}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(
        error,
        `update user with id ${id}`
      );
    }
  }

  /**
   * Delete user by ID
   * @param id - User ID
   * @returns Promise<void>
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await this.supabase.from('users').delete().eq('id', id);

      if (error) {
        throw this.errorHandler.createApiError(
          error,
          `delete user with id ${id}`
        );
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(
        error,
        `delete user with id ${id}`
      );
    }
  }

  /**
   * Get users count
   * @param searchTerm - Optional search term to filter users
   * @returns Promise<number> - Total count of users
   */
  async getUsersCount(searchTerm?: string): Promise<number> {
    try {
      let query = this.supabase
        .from('users')
        .select('id', { count: 'exact', head: true });

      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
        );
      }

      const { count, error } = await query;

      if (error) {
        throw this.errorHandler.createApiError(error, 'count users');
      }

      return count || 0;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'count users');
    }
  }
}
