### Error Handling and Retry Logic

```typescript
export class EstablishmentService {
  private readonly retryAttempts = 3;
  private readonly retryDelay = 1000;
  
  private async withRetry<T>(
    operation: () => Promise<T>,
    attempts: number = this.retryAttempts
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempts > 1 && this.isRetryableError(error)) {
        await this.delay(this.retryDelay);
        return this.withRetry(operation, attempts - 1);
      }
      throw error;
    }
  }
  
  private isRetryableError(error: any): boolean {
    // Network errors, 5xx status codes, etc.
    return error?.status >= 500 || error?.code === 'NETWORK_ERROR';
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async create(establishment: iEstablishmentCreate): Promise<void> {
    await this.withRetry(() => this.api.create(establishment));
    this.listResource.refetch();
  }
}
```