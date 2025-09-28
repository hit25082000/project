import { Injectable, inject, signal, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { PlanApi } from '../apis/plan.api';
import { GlobalErrorHandler } from '@core/errors/global-error-handler';
import { NotificationService } from '@shared/services/notification.service';
import { iPlanPreview, iPlan } from '../interfaces/plan.interface';

@Injectable({ providedIn: 'root' })
export class PlanService {
  // Dependencies
  private api = inject(PlanApi);
  private errorHandler = inject(GlobalErrorHandler);
  private notificationService = inject(NotificationService);

  // Resources
  private readonly plansResource = rxResource({
    loader: () => from(this.api.getPlans()),
  });

  // Public signals
  readonly plans = computed(() => this.plansResource.value() || []);
  readonly isLoading = computed(() => this.plansResource.isLoading());
  readonly error = computed(() => this.plansResource.error());

  // Actions
  async getPlanById(id: string): Promise<iPlan | null> {
    try {
      return await this.api.getPlanById(id);
    } catch (error) {
      this.errorHandler.handleError(error, 'Getting plan details');
      return null;
    }
  }

  refresh(): void {
    this.plansResource.reload();
  }
}
