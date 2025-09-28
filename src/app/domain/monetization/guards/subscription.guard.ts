import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SubscriptionService } from '../services/subscription.service';
import { NotificationService } from '@shared/services/notification.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionGuard implements CanActivate {
  private subscriptionService = inject(SubscriptionService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.subscriptionService.isSubscribed.pipe(
      take(1),
      map((isSubscribed) => {
        if (!isSubscribed) {
          this.notificationService.error(
            'This feature requires an active subscription. Please upgrade your plan.',
            'Subscription Required'
          );
          this.router.navigate(['/monetization/plans']);
          return false;
        }
        return true;
      })
    );
  }
}
