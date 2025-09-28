Complete guide to service transaction handling and resource management patterns. Reference `C-service_patterns.mdc` for core service rules.

## Transaction Handling Patterns

### Multi-Step Operations with Rollback

```typescript
@Injectable({ providedIn: 'root' })
export class BillingService {
  private api = inject(BillingApi);
  private errorHandler = inject(GlobalErrorHandler);

  // Complex transaction with rollback capability
  async processPaymentAndUpdateSubscription(
    paymentData: iPaymentIntent,
    subscriptionId: string,
    newPlanId: string
  ): Promise<{ payment: iPayment, subscription: iSubscription }> {
    // Step 1: Store original state for potential rollback
    const originalSubscription = await this.api.getSubscriptionById(subscriptionId);

    try {
      // Step 2: Execute operations in sequence
      const payment = await this.api.processPayment(paymentData);
      const subscription = await this.api.updateSubscription(subscriptionId, {
        planId: newPlanId,
        currentPeriodStart: new Date().toISOString()
      });

      return { payment, subscription };
    } catch (error) {
      // Step 3: Rollback on failure
      try {
        if (originalSubscription) {
          await this.api.updateSubscription(subscriptionId, originalSubscription);
        }
      } catch (rollbackError) {
        // Log rollback failure but don't throw
        console.error('Rollback failed:', rollbackError);
      }

      this.errorHandler.handleError(error, 'Payment processing failed');
      throw error;
    }
  }

  // Transaction with multiple services coordination
  async upgradeUserPlan(userId: string, newPlanId: string): Promise<iSubscription> {
    const userService = inject(UserService);
    const planService = inject(PlanService);

    // Store original states
    const [originalSubscription, originalPlan] = await Promise.all([
      this.api.getActiveSubscription(userId),
      planService.getCurrentPlan(userId)
    ]);

    try {
      // Execute coordinated transaction
      const newPlan = await planService.validateAndGetPlan(newPlanId);
      const proratedAmount = await this.calculateProration(originalPlan, newPlan);

      const payment = await this.api.processPayment({
        amount: proratedAmount,
        currency: 'usd',
        description: `Plan upgrade to ${newPlan.name}`
      });

      const subscription = await this.api.updateSubscription(originalSubscription.id, {
        planId: newPlanId,
        currentPeriodStart: new Date().toISOString()
      });

      return subscription;
    } catch (error) {
      // Rollback all changes
      await this.rollbackUpgrade(userId, originalSubscription, originalPlan);
      this.errorHandler.handleError(error, 'Plan upgrade failed');
      throw error;
    }
  }
}
```

### Resource Management Patterns

#### Database Connection Management
```typescript
@Injectable({ providedIn: 'root' })
export class DataExportService {
  private supabase = inject(SupabaseClient);

  async exportLargeDataset(query: any): Promise<Blob> {
    let connection: any = null;

    try {
      // Acquire connection
      connection = await this.supabase.rpc('begin_export_transaction');

      // Process data in chunks to avoid memory issues
      const chunks = await this.processInChunks(connection, query);

      // Combine and return result
      return await this.combineChunks(chunks);
    } catch (error) {
      this.errorHandler.handleError(error, 'Data export failed');
      throw error;
    } finally {
      // Always release connection
      if (connection) {
        try {
          await this.supabase.rpc('end_export_transaction', { connection_id: connection.id });
        } catch (cleanupError) {
          console.warn('Connection cleanup failed:', cleanupError);
        }
      }
    }
  }
}
```

#### File System Resource Management
```typescript
@Injectable({ providedIn: 'root' })
export class FileProcessingService {
  async processUploadedFile(file: File): Promise<ProcessedData> {
    let tempFileHandle: FileSystemHandle | null = null;
    let tempDirHandle: FileSystemDirectoryHandle | null = null;

    try {
      // Create temporary directory
      tempDirHandle = await this.createTempDirectory();

      // Write file to temp location
      tempFileHandle = await tempDirHandle.getFileHandle('upload.tmp', { create: true });
      await this.writeFile(tempFileHandle, file);

      // Process the file
      const processedData = await this.processFile(tempFileHandle);

      // Validate processing result
      await this.validateProcessedData(processedData);

      return processedData;
    } catch (error) {
      this.errorHandler.handleError(error, 'File processing failed');
      throw error;
    } finally {
      // Cleanup resources in reverse order
      if (tempFileHandle) {
        try {
          await this.removeFile(tempFileHandle);
        } catch (cleanupError) {
          console.warn('File cleanup failed:', cleanupError);
        }
      }

      if (tempDirHandle) {
        try {
          await this.removeDirectory(tempDirHandle);
        } catch (cleanupError) {
          console.warn('Directory cleanup failed:', cleanupError);
        }
      }
    }
  }
}
```

#### External API Resource Management
```typescript
@Injectable({ providedIn: 'root' })
export class ExternalApiService {
  async fetchWithRateLimit(apiUrl: string, options: RequestOptions): Promise<Response> {
    let rateLimitToken: string | null = null;

    try {
      // Acquire rate limit token
      rateLimitToken = await this.acquireRateLimitToken();

      // Make API request with token
      const response = await fetch(apiUrl, {
        ...options,
        headers: {
          ...options.headers,
          'X-Rate-Limit-Token': rateLimitToken
        }
      });

      if (!response.ok) {
        throw new ApiError(`API request failed: ${response.statusText}`, 'API_ERROR', response.status);
      }

      return response;
    } catch (error) {
      this.errorHandler.handleError(error, 'External API call failed');
      throw error;
    } finally {
      // Release rate limit token
      if (rateLimitToken) {
        try {
          await this.releaseRateLimitToken(rateLimitToken);
        } catch (cleanupError) {
          console.warn('Rate limit token cleanup failed:', cleanupError);
        }
      }
    }
  }
}
```

## Transaction Best Practices

### ✅ Do
- Store original state before transactions
- Implement proper rollback mechanisms
- Use try/catch/finally for resource cleanup
- Test rollback scenarios
- Log transaction failures and rollbacks
- Handle partial failures gracefully

### ❌ Don't
- Modify data without rollback plans
- Leave resources unreleased
- Ignore cleanup failures
- Make transactions too large
- Skip error handling in cleanup code

## Testing Transaction Scenarios

```typescript
describe('BillingService', () => {
  let service: BillingService;
  let mockApi: jasmine.SpyObj<BillingApi>;

  beforeEach(() => {
    mockApi = jasmine.createSpyObj('BillingApi', [
      'getSubscriptionById',
      'processPayment',
      'updateSubscription'
    ]);
  });

  it('should rollback on payment failure', async () => {
    // Setup mocks
    mockApi.getSubscriptionById.and.returnValue(Promise.resolve(originalSubscription));
    mockApi.processPayment.and.returnValue(Promise.reject(new Error('Payment failed')));
    mockApi.updateSubscription.and.returnValue(Promise.resolve(updatedSubscription));

    // Execute and expect rollback
    await expectAsync(service.processPaymentAndUpdateSubscription(paymentData, subId, planId))
      .toBeRejected();

    // Verify rollback was called
    expect(mockApi.updateSubscription).toHaveBeenCalledWith(subId, originalSubscription);
  });

  it('should cleanup resources on error', async () => {
    const cleanupSpy = spyOn(service, 'cleanupResource');

    mockApi.processWithResource.and.returnValue(Promise.reject(new Error('Processing failed')));

    await expectAsync(service.processWithResource(resourceData))
      .toBeRejected();

    expect(cleanupSpy).toHaveBeenCalled();
  });
});
```

## References
- `C-service_patterns.mdc` – Core service architecture rules
- `error_handling_patterns.mdc` – Error handling in transactions
