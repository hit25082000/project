import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-billing-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-billing-page">
      <div class="page-header">
        <h1>Admin - Billing Management</h1>
        <p>Manage plans, subscriptions, and billing oversight</p>
      </div>

      <div class="admin-content">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Revenue</h3>
            <p class="stat-value">$0</p>
          </div>
          <div class="stat-card">
            <h3>Active Subscriptions</h3>
            <p class="stat-value">0</p>
          </div>
          <div class="stat-card">
            <h3>Failed Payments</h3>
            <p class="stat-value">0</p>
          </div>
        </div>

        <div class="admin-sections">
          <section class="plans-management">
            <h2>Plan Management</h2>
            <p>
              Admin interface for managing subscription plans would go here.
            </p>
          </section>

          <section class="billing-oversight">
            <h2>Billing Oversight</h2>
            <p>
              Admin tools for monitoring billing and payments would go here.
            </p>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-billing-page {
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
        }
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }

      .stat-card {
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.5rem;
        text-align: center;

        h3 {
          margin: 0 0 1rem 0;
          color: #666;
          font-size: 0.9rem;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }
      }

      .admin-sections {
        display: grid;
        gap: 2rem;

        section {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 2rem;

          h2 {
            color: #333;
            margin: 0 0 1rem 0;
          }

          p {
            color: #666;
            margin: 0;
          }
        }
      }
    `,
  ],
})
export class AdminBillingPage {}
