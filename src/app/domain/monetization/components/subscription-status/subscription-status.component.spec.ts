import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { SubscriptionStatusComponent } from './subscription-status.component';
import { SubscriptionService } from '../../services/subscription.service';

describe('SubscriptionStatusComponent', () => {
  let component: SubscriptionStatusComponent;
  let fixture: ComponentFixture<SubscriptionStatusComponent>;
  let subscriptionServiceSpy: jasmine.SpyObj<SubscriptionService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('SubscriptionService', [], {
      subscription: signal(null),
      isSubscribed: signal(false),
      isLoading: signal(false),
    });

    await TestBed.configureTestingModule({
      imports: [SubscriptionStatusComponent],
      providers: [{ provide: SubscriptionService, useValue: serviceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionStatusComponent);
    component = fixture.componentInstance;
    subscriptionServiceSpy = TestBed.inject(
      SubscriptionService
    ) as jasmine.SpyObj<SubscriptionService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading state', () => {
    Object.defineProperty(subscriptionServiceSpy, 'isLoading', {
      get: () => signal(true)(),
    });

    fixture.detectChanges();

    const loadingElement = fixture.nativeElement.querySelector('.loading');
    expect(loadingElement).toBeTruthy();
    expect(loadingElement.textContent).toContain('Loading subscription');
  });

  it('should display subscription status', () => {
    const mockSubscription = {
      id: 'sub_123',
      status: 'active',
      plan: { name: 'Pro Plan' },
      currentPeriodStart: '2024-01-01',
      currentPeriodEnd: '2024-02-01',
      cancelAtPeriodEnd: false,
    };

    Object.defineProperty(subscriptionServiceSpy, 'subscription', {
      get: () => signal(mockSubscription)(),
    });
    Object.defineProperty(subscriptionServiceSpy, 'isSubscribed', {
      get: () => signal(true)(),
    });

    fixture.detectChanges();

    const statusCard = fixture.nativeElement.querySelector('.status-card');
    expect(statusCard).toBeTruthy();

    const statusBadge = fixture.nativeElement.querySelector('.status-badge');
    expect(statusBadge.textContent).toContain('Active');

    const planName = fixture.nativeElement.querySelector('.plan-name');
    expect(planName.textContent).toBe('Pro Plan');
  });

  it('should display no subscription message', () => {
    fixture.detectChanges();

    const noSubscriptionElement =
      fixture.nativeElement.querySelector('.no-subscription');
    expect(noSubscriptionElement).toBeTruthy();
    expect(noSubscriptionElement.textContent).toContain(
      'No active subscription'
    );
  });

  it('should format dates correctly', () => {
    const dateString = '2024-01-15T00:00:00.000Z';
    const formatted = component.formatDate(dateString);
    expect(formatted).toBeTruthy();
  });

  it('should determine status color', () => {
    expect(component.getStatusColor('active')).toBe('success');
    expect(component.getStatusColor('past_due')).toBe('warning');
    expect(component.getStatusColor('canceled')).toBe('danger');
    expect(component.getStatusColor('unknown')).toBe('secondary');
  });
});
