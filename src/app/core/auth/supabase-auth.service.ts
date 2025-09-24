// @AI-CORE: Central Supabase configuration - changes affect entire app
import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseAuthService {
  private _client: SupabaseClient;
  private _currentUser = signal<User | null>(null);

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
    this._client.auth.onAuthStateChange((_, session) => {
      this._currentUser.set(session?.user ?? null);
    });
  }
}
