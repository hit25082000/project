import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubscriptionStatusComponent } from '../components/subscription-status/subscription-status.component';
import { BillingHistoryComponent } from '../components/billing-history/billing-history.component';
import { SubscriptionUpgradeComponent } from '../components/subscription-upgrade/subscription-upgrade.component';
import { BillingService } from '../services/billing.service';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-billing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SubscriptionStatusComponent,
    BillingHistoryComponent,
    SubscriptionUpgradeComponent,
  ],
  template: `
    <div class="billing-page">
      <div class="page-header">
        <h1>Billing & Subscription</h1>
        <p>Manage your subscription and view billing history</p>
      </div>

      <div class="billing-content">
        <div class="subscription-section">
          <app-subscription-status></app-subscription-status>

          <div class="subscription-actions">
            @if (!subscriptionService.isSubscribed()) {
            <a routerLink="/monetization/plans" class="action-btn primary">
              Choose Plan
            </a>
            } @else {
            <button
              class="action-btn secondary"
              (click)="showUpgradeOptions = !showUpgradeOptions"
            >
              {{ showUpgradeOptions ? 'Hide' : 'Change' }} Plan
            </button>
            <button class="action-btn danger" (click)="onCancelClick()">
              Cancel Subscription
            </button>
            } @if (showUpgradeOptions) {
            <app-subscription-upgrade></app-subscription-upgrade>
            }
          </div>
        </div>

        <div class="billing-section">
          <h2>Billing History</h2>
          <app-billing-history></app-billing-history>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .billing-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .page-header {
        text-align: center;
        margin-bottom: 3rem;

        h1 {
          color: #333;
          margin-bottom: 0.5rem;
        }

        p {
          color: #666;
          font-size: 1.1rem;
        }
      }

      .billing-content {
        display: grid;
        gap: 3rem;
      }

      .subscription-section {
        display: grid;
        gap: 2rem;
      }

      .subscription-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .action-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        transition: all 0.3s ease;

        &.primary {
          background: #007bff;
          color: white;

          &:hover {
            background: #0056b3;
          }
        }

        &.secondary {
          background: #6c757d;
          color: white;

          &:hover {
            background: #545b62;
          }
        }

        &.danger {
          background: #dc3545;
          color: white;

          &:hover {
            background: #c82333;
          }
        }
      }

      .billing-section {
        h2 {
          color: #333;
          margin-bottom: 1.5rem;
        }
      }
    `,
  ],
})
export class BillingPage {
  billingService = inject(BillingService);
  subscriptionService = inject(SubscriptionService);
  showUpgradeOptions = false;

  onUpgradeClick(): void {
    // Navigate to plan upgrade page
    console.log('Navigate to plan upgrade');
  }

  onCancelClick(): void {
    // Show confirmation dialog and cancel subscription
    if (confirm('Are you sure you want to cancel your subscription?')) {
      console.log('Cancel subscription');
    }
  }
}
