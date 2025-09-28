import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../services/plan.service';
import { SubscriptionService } from '../../services/subscription.service';
import { iPlanPreview } from '../../interfaces/plan.interface';

type PlanArray = iPlanPreview[];

@Component({
  selector: 'app-plan-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-selector.component.html',
  styleUrls: ['./plan-selector.component.scss'],
})
export class PlanSelectorComponent {
  private planService = inject(PlanService);
  private subscriptionService = inject(SubscriptionService);

  plans = this.planService.plans as () => PlanArray;
  selectedPlanId = signal<string | null>(null);
  isProcessing = signal(false);
  isLoading = this.planService.isLoading;

  selectPlan(planId: string): void {
    this.selectedPlanId.set(planId);
  }

  async subscribe(): Promise<void> {
    const planId = this.selectedPlanId();
    if (!planId) return;

    this.isProcessing.set(true);
    try {
      await this.subscriptionService.createSubscription(planId);
      // Success is handled by the service with notifications
    } catch (error) {
      console.error('Subscription creation failed:', error);
    } finally {
      this.isProcessing.set(false);
    }
  }

  isSelected(planId: string): boolean {
    return this.selectedPlanId() === planId;
  }
}
