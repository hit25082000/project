import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../services/subscription.service';
import { iSubscription } from '../../interfaces/subscription.interface';

type SubscriptionType = iSubscription | null;

@Component({
  selector: 'app-subscription-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-status.component.html',
  styleUrls: ['./subscription-status.component.scss'],
})
export class SubscriptionStatusComponent {
  private subscriptionService = inject(SubscriptionService);

  subscription = this.subscriptionService
    .subscription as () => SubscriptionType;
  isSubscribed = this.subscriptionService.isSubscribed;
  isLoading = this.subscriptionService.isLoading;

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'trialing':
        return 'info';
      case 'past_due':
        return 'warning';
      case 'canceled':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
