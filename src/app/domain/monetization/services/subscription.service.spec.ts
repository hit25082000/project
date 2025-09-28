import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { SubscriptionApi } from '../apis/subscription.api';
import { SupabaseAuthService } from '@core/auth/supabase-auth.service';
import { NotificationService } from '@shared/services/notification.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let apiSpy: any;
  let authSpy: any;
  let notificationSpy: any;

  beforeEach(() => {
    const apiSpyObj = {
      createSubscription: vi.fn(),
      getUserSubscription: vi.fn(),
      updateSubscription: vi.fn(),
      cancelSubscription: vi.fn(),
    };
    const authSpyObj = {
      currentUser: signal({ id: 'user_123' }),
    };
    const notificationSpyObj = {
      success: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SubscriptionService,
        { provide: SubscriptionApi, useValue: apiSpyObj },
        { provide: SupabaseAuthService, useValue: authSpyObj },
        { provide: NotificationService, useValue: notificationSpyObj },
      ],
    });

    service = TestBed.inject(SubscriptionService);
    apiSpy = TestBed.inject(SubscriptionApi);
    notificationSpy = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create subscription successfully', async () => {
    const mockResult = {
      subscriptionId: 'sub_123',
      clientSecret: 'pi_123_secret',
    };

    apiSpy.createSubscription.mockResolvedValue(mockResult);

    const result = await service.createSubscription('price_123');

    expect(result).toEqual(mockResult);
    expect(apiSpy.createSubscription).toHaveBeenCalledWith({
      priceId: 'price_123',
      paymentMethodId: undefined,
    });
    expect(notificationSpy.success).toHaveBeenCalledWith(
      'Subscription created successfully'
    );
  });

  it('should upgrade subscription successfully', async () => {
    const mockSubscription = {
      id: 'sub_123',
      userId: 'user_123',
      stripeSubscriptionId: 'sub_stripe_123',
      status: 'active',
      currentPeriodStart: '2024-01-01',
      currentPeriodEnd: '2024-02-01',
      cancelAtPeriodEnd: false,
      plan: { id: 'plan_1', name: 'Basic', amount: 999 },
    };

    // Mock current subscription
    spyOn(service.subscription, 'subscribe').and.callFake(() => ({}));
    Object.defineProperty(service, 'subscription', {
      get: () => signal(mockSubscription)(),
    });

    apiSpy.updateSubscription.and.returnValue(
      Promise.resolve(mockSubscription)
    );

    await service.upgradeSubscription('price_456');

    expect(apiSpy.updateSubscription).toHaveBeenCalledWith('sub_stripe_123', {
      priceId: 'price_456',
      prorationBehavior: 'create_prorations',
    });
    expect(notificationSpy.success).toHaveBeenCalledWith(
      'Subscription upgraded successfully'
    );
  });

  it('should handle subscription creation error', async () => {
    apiSpy.createSubscription.and.returnValue(
      Promise.reject(new Error('API Error'))
    );

    await expectAsync(service.createSubscription('price_123')).toBeRejected();
    expect(notificationSpy.success).not.toHaveBeenCalled();
  });

  it('should check if user is subscribed', () => {
    const mockSubscription = {
      id: 'sub_123',
      status: 'active',
      plan: { id: 'plan_1', name: 'Basic', amount: 999 },
    };

    // Mock subscription signal
    Object.defineProperty(service, 'subscription', {
      get: () => signal(mockSubscription)(),
    });

    expect(service.isSubscribed()).toBeTruthy();
  });
});
