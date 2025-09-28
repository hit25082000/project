import { TestBed } from '@angular/core/testing';
import { PlanService } from './plan.service';
import { PlanApi } from '../apis/plan.api';
import { NotificationService } from '@shared/services/notification.service';

describe('PlanService', () => {
  let service: PlanService;
  let apiSpy: jasmine.SpyObj<PlanApi>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const apiSpyObj = jasmine.createSpyObj('PlanApi', [
      'getPlans',
      'getPlanById',
    ]);
    const notificationSpyObj = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
    ]);

    TestBed.configureTestingModule({
      providers: [
        PlanService,
        { provide: PlanApi, useValue: apiSpyObj },
        { provide: NotificationService, useValue: notificationSpyObj },
      ],
    });

    service = TestBed.inject(PlanService);
    apiSpy = TestBed.inject(PlanApi) as jasmine.SpyObj<PlanApi>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get plan by id', async () => {
    const mockPlan = {
      id: 'plan_123',
      name: 'Pro Plan',
      amount: 1999,
      currency: 'usd',
    };

    apiSpy.getPlanById.and.returnValue(Promise.resolve(mockPlan));

    const result = await service.getPlanById('plan_123');

    expect(result).toEqual(mockPlan);
    expect(apiSpy.getPlanById).toHaveBeenCalledWith('plan_123');
  });

  it('should handle plan not found', async () => {
    apiSpy.getPlanById.and.returnValue(Promise.resolve(null));

    const result = await service.getPlanById('nonexistent');

    expect(result).toBeNull();
  });

  it('should handle API error gracefully', async () => {
    apiSpy.getPlanById.and.returnValue(Promise.reject(new Error('API Error')));

    const result = await service.getPlanById('plan_123');

    expect(result).toBeNull();
    expect(notificationSpy.error).toHaveBeenCalled();
  });
});
