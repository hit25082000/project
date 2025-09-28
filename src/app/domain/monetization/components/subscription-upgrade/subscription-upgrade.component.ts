import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../services/subscription.service';
import { PlanService } from '../../services/plan.service';
import { iPlanPreview } from '../../interfaces/plan.interface';
import { iSubscription } from '../../interfaces/subscription.interface';

type PlanArray = iPlanPreview[];
type SubscriptionType = iSubscription | null;

@Component({
  selector: 'app-subscription-upgrade',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-upgrade.component.html',
  styleUrls: ['./subscription-upgrade.component.scss'],
})
export class SubscriptionUpgradeComponent {
  private subscriptionService = inject(SubscriptionService);
  private planService = inject(PlanService);

  plans = this.planService.plans as () => PlanArray;
  currentSubscription = this.subscriptionService
    .subscription as () => SubscriptionType;
  isLoading = signal(false);

  isUpgrade(plan: iPlanPreview): boolean {
    const currentPlan = this.currentSubscription()?.plan;
    if (!currentPlan) return true;
    return plan.amount > currentPlan.amount;
  }

  isDowngrade(plan: iPlanPreview): boolean {
    const currentPlan = this.currentSubscription()?.plan;
    if (!currentPlan) return false;
    return plan.amount < currentPlan.amount;
  }

  async upgradeToPlan(planId: string): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.subscriptionService.upgradeSubscription(planId);
    } finally {
      this.isLoading.set(false);
    }
  }

  async downgradeToPlan(planId: string): Promise<void> {
    if (
      confirm(
        'This change will take effect at the end of your current billing period. Continue?'
      )
    ) {
      this.isLoading.set(true);
      try {
        await this.subscriptionService.downgradeSubscription(planId);
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
