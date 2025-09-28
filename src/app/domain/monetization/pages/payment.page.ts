import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentFormComponent } from '../components/payment-form/payment-form.component';
import { PlanService } from '../services/plan.service';
import { iPlan } from '../interfaces/plan.interface';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, PaymentFormComponent],
  templateUrl: './payment.page.html',
  styles: [
    `
      .payment-page {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }

      .page-header {
        text-align: center;
        margin-bottom: 2rem;

        h1 {
          color: #333;
          margin-bottom: 0.5rem;
        }

        p {
          color: #666;
        }
      }

      .plan-summary {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;

        h2 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .price {
          font-size: 1.5rem;
          font-weight: 600;
          color: #007bff;
          margin-bottom: 0.5rem;
        }

        p {
          margin-bottom: 1rem;
          color: #666;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            padding: 0.25rem 0;
            position: relative;
            padding-left: 1.5rem;

            &:before {
              content: '✓';
              color: #28a745;
              font-weight: bold;
              position: absolute;
              left: 0;
            }
          }
        }
      }
    `,
  ],
})
export class PaymentPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private planService = inject(PlanService);

  selectedPlan = signal<iPlan | null>(null);
  isSubscription = signal(true);

  constructor() {
    // Get plan from query params
    this.route.queryParams.subscribe((params) => {
      const planId = params['plan'];
      if (planId) {
        this.loadPlan(planId);
      }
    });
  }

  private async loadPlan(planId: string): Promise<void> {
    const plan = await this.planService.getPlanById(planId);
    this.selectedPlan.set(plan);
  }

  onPaymentSuccess(result: any): void {
    console.log('Payment successful:', result);
    // Navigate to success page
    this.router.navigate(['/monetization/billing'], {
      queryParams: { success: 'true' },
    });
  }

  onPaymentError(error: string): void {
    console.error('Payment failed:', error);
    // Error is handled by the component, but we can add additional logic here
  }
}
