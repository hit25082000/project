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
        this._currentUser.set({ ...user, role: null as any });
      } else {
        this._currentUser.set(null);
      }
    });
  }
}
