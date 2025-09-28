// @AI-CORE: Central Supabase configuration - changes affect entire app
import { Injectable, signal, computed, inject } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '@env/environment';
import { rxResource } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';

export interface UserWithRole extends User {
  role?: 'free' | 'premium' | 'admin';
  subscriptionStatus?: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseAuthService {
  private _client: SupabaseClient;
  private _currentUser = signal<UserWithRole | null>(null);

  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => !!this._currentUser());

  // User role resource
  private readonly userRoleResource = rxResource({
    request: () => ({ userId: this._currentUser()?.id }),
    loader: ({ userId }) =>
      userId ? from(this.getUserRole(userId)) : from(Promise.resolve(null)),
  });

  currentUserRole = computed(() => this.userRoleResource.value());
  isAdmin = computed(() => this.currentUserRole() === 'admin');
  isPremium = computed(
    () =>
      this.currentUserRole() === 'premium' || this.currentUserRole() === 'admin'
  );

  constructor() {
    this._client = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_KEY
    );

    this._initAuthListener();
  }

  get client() {
    return this._client;
  }
  get auth() {
    return this._client.auth;
  }
  get db() {
    return this._client.from;
  }

  private _initAuthListener(): void {
    this._client.auth.onAuthStateChange(async (_, session) => {
      const user = session?.user ?? null;
      if (user) {
        // Fetch user role when user logs in
        const role = await this.getUserRole(user.id);
        this._currentUser.set({ ...user, role: role as any });
      } else {
        this._currentUser.set(null);
      }
    });
  }

  async getUserRole(userId: string): Promise<string | null> {
    try {
      const { data, error } = await this._client
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No role found, user is free
          return 'free';
        }
        console.error('Error fetching user role:', error);
        return 'free';
      }

      return data?.role || 'free';
    } catch (error) {
      console.error('Error in getUserRole:', error);
      return 'free';
    }
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    try {
      const { error } = await this._client.from('user_roles').upsert(
        {
          user_id: userId,
          role,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      );

      if (error) {
        console.error('Error updating user role:', error);
      } else {
        // Update the current user signal
        const currentUser = this._currentUser();
        if (currentUser) {
          this._currentUser.set({ ...currentUser, role: role as any });
        }
      }
    } catch (error) {
      console.error('Error in updateUserRole:', error);
    }
  }
}
