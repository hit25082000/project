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

  success(message: string, title?: string): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: 'success',
      timestamp: new Date(),
    });
  }

  error(message: string, title?: string): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: 'error',
      timestamp: new Date(),
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}
