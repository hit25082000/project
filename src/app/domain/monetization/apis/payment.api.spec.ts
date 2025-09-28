import { TestBed } from '@angular/core/testing';
import { PaymentApi } from './payment.api';
import { SupabaseClient } from '@supabase/supabase-js';

describe('PaymentApi', () => {
  let api: PaymentApi;
  let supabaseSpy: jasmine.SpyObj<SupabaseClient>;

  beforeEach(() => {
    const supabaseSpyObj = jasmine.createSpyObj('SupabaseClient', [], {
      functions: jasmine.createSpyObj('functions', ['invoke']),
    });

    TestBed.configureTestingModule({
      providers: [
        PaymentApi,
        { provide: SupabaseClient, useValue: supabaseSpyObj },
      ],
    });

    api = TestBed.inject(PaymentApi);
    supabaseSpy = TestBed.inject(
      SupabaseClient
    ) as jasmine.SpyObj<SupabaseClient>;
  });

  it('should be created', () => {
    expect(api).toBeTruthy();
  });

  it('should create payment intent successfully', async () => {
    const mockResponse = {
      id: 'pi_123',
      clientSecret: 'pi_123_secret',
      amount: 1000,
      currency: 'usd',
    };

    supabaseSpy.functions.invoke.and.returnValue(
      Promise.resolve({ data: mockResponse })
    );

    const result = await api.createPaymentIntent(1000, 'usd');

    expect(result).toEqual(mockResponse);
    expect(supabaseSpy.functions.invoke).toHaveBeenCalledWith('payments', {
      body: {
        action: 'create-intent',
        amount: 1000,
        currency: 'usd',
        metadata: undefined,
      },
    });
  });

  it('should get billing history', async () => {
    const mockResponse = {
      history: [{ id: 'hist_1', amount: 1000, status: 'paid' }],
      total: 1,
    };

    supabaseSpy.functions.invoke.and.returnValue(
      Promise.resolve({ data: mockResponse })
    );

    const result = await api.getBillingHistory('user_123');

    expect(result).toEqual(mockResponse);
  });

  it('should process refund', async () => {
    supabaseSpy.functions.invoke.and.returnValue(
      Promise.resolve({ data: null })
    );

    await api.processRefund('pi_123', 500);

    expect(supabaseSpy.functions.invoke).toHaveBeenCalledWith('payments', {
      body: { action: 'refund', paymentId: 'pi_123', amount: 500 },
    });
  });

  it('should handle API errors', async () => {
    supabaseSpy.functions.invoke.and.returnValue(
      Promise.resolve({ error: { message: 'API Error' } })
    );

    await expectAsync(api.createPaymentIntent(1000)).toBeRejected();
  });
});
