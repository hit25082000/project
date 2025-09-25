### Caching and Invalidation

```typescript
export class EstablishmentService {
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }
  
  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
  
  async getDetailsById(id: string): Promise<iEstablishment | null> {
    const cacheKey = `establishment-${id}`;
    const cached = this.getCachedData<iEstablishment>(cacheKey);
    if (cached) return cached;
    
    const data = await this.api.getDetailsById(id);
    if (data) {
      this.setCachedData(cacheKey, data);
    }
    return data;
  }
  
  invalidateCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}
```