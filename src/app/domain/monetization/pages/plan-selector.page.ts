import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlanSelectorComponent } from '../components/plan-selector/plan-selector.component';

@Component({
  selector: 'app-plan-selector-page',
  standalone: true,
  imports: [CommonModule, PlanSelectorComponent],
  template: `
    <div class="plan-selector-page">
      <div class="page-header">
        <h1>Choose Your Plan</h1>
        <p>Select the perfect plan for your needs</p>
      </div>

      <app-plan-selector></app-plan-selector>
    </div>
  `,
  styles: [
    `
      .plan-selector-page {
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
    `,
  ],
})
export class PlanSelectorPage {
  constructor(private router: Router) {}

  onPlanSelected(planId: string): void {
    // Navigate to payment page with selected plan
    this.router.navigate(['/monetization/payment'], {
      queryParams: { plan: planId },
    });
  }
}
