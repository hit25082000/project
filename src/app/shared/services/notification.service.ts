import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();

  addNotification(notification: Notification): void {
    this._notifications.update((notifications) => [
      ...notifications,
      notification,
    ]);
  }

  removeNotification(id: string): void {
    this._notifications.update((notifications) =>
      notifications.filter((n) => n.id !== id)
    );
  }
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}
