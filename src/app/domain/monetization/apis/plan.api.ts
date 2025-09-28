import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  iPlan,
  iPlanPreview,
  iPlanCreate,
  iPlanUpdate,
} from '../interfaces/plan.interface';
import {
  GlobalErrorHandler,
  ApiError,
} from '@core/errors/global-error-handler';

@Injectable({ providedIn: 'root' })
export class PlanApi {
  private supabase = inject(SupabaseClient);
  private errorHandler = inject(GlobalErrorHandler);

  async getPlans(): Promise<iPlanPreview[]> {
    try {
      const { data, error } = await this.supabase
        .from('admin_plans')
        .select('id, name, description, amount, currency, interval, features')
        .eq('is_active', true)
        .order('amount');

      if (error) {
        throw this.errorHandler.createApiError(error, 'get plans');
      }

      return data || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'get plans');
    }
  }

  async getPlanById(id: string): Promise<iPlan | null> {
    try {
      const { data, error } = await this.supabase
        .from('admin_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw this.errorHandler.createApiError(error, 'get plan by id');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'get plan by id');
    }
  }

  // Admin-only methods
  async createPlan(plan: iPlanCreate): Promise<iPlan> {
    try {
      const { data, error } = await this.supabase
        .from('admin_plans')
        .insert(plan)
        .select()
        .single();

      if (error) {
        throw this.errorHandler.createApiError(error, 'create plan');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'create plan');
    }
  }

  async updatePlan(id: string, updates: iPlanUpdate): Promise<iPlan> {
    try {
      const { data, error } = await this.supabase
        .from('admin_plans')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw this.errorHandler.createApiError(error, 'update plan');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'update plan');
    }
  }

  async deletePlan(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('admin_plans')
        .delete()
        .eq('id', id);

      if (error) {
        throw this.errorHandler.createApiError(error, 'delete plan');
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw this.errorHandler.createApiError(error, 'delete plan');
    }
  }
}
