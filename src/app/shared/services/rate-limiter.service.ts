import { Injectable } from '@angular/core';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class RateLimiterService {
  private attempts = new Map<string, RateLimitEntry>();

  /**
   * Check if a request can be made within rate limits
   * @param key Unique identifier for the operation (e.g., 'payment_user_123')
   * @param maxAttempts Maximum attempts allowed in the window
   * @param windowMs Time window in milliseconds
   * @returns true if request is allowed, false if rate limited
   */
  canMakeRequest(key: string, maxAttempts = 5, windowMs = 60000): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      // Reset or create new entry
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (attempt.count >= maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  /**
   * Get remaining attempts for a key
   */
  getRemainingAttempts(key: string, maxAttempts = 5): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return maxAttempts;

    return Math.max(0, maxAttempts - attempt.count);
  }

  /**
   * Get time until reset for a key (in milliseconds)
   */
  getTimeUntilReset(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return 0;

    const now = Date.now();
    return Math.max(0, attempt.resetTime - now);
  }

  /**
   * Clear rate limit for a specific key
   */
  clearRateLimit(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all expired rate limits
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}
