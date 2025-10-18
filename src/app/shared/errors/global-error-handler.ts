import { Injectable, inject } from '@angular/core';
import { NotificationService } from '@shared/services/notification.service';

/**
 * Global error types for consistent error handling across the application
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network connection failed') {
    super(message, 'NETWORK_ERROR', 0);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

/**
 * Global error handler service for consistent error handling across the application
 */
@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler {
  private notificationService = inject(NotificationService);

  /**
   * Handle API errors with appropriate user feedback
   * @param error - The error to handle
   * @param context - Optional context for better error messages
   * @returns void
   */
  handleError(error: unknown, context?: string): void {
    console.error('Global Error Handler:', error);

    if (error instanceof ApiError) {
      this.handleApiError(error, context);
    } else if (error instanceof Error) {
      this.handleGenericError(error, context);
    } else {
      this.handleUnknownError(error, context);
    }
  }

  /**
   * Handle specific API errors
   */
  private handleApiError(error: ApiError, context?: string): void {
    const message = context ? `${context}: ${error.message}` : error.message;

    switch (error.code) {
      case 'NOT_FOUND':
        this.notificationService.error(message, 'Not Found');
        break;
      case 'VALIDATION_ERROR':
        this.notificationService.error(message, 'Validation Error');
        break;
      case 'NETWORK_ERROR':
        this.notificationService.error(message, 'Connection Error');
        break;
      case 'AUTH_ERROR':
        this.notificationService.error(message, 'Authentication Error');
        break;
      case 'AUTHORIZATION_ERROR':
        this.notificationService.error(message, 'Access Denied');
        break;
      default:
        this.notificationService.error(message, 'API Error');
    }
  }

  /**
   * Handle generic JavaScript errors
   */
  private handleGenericError(error: Error, context?: string): void {
    const message = context ? `${context}: ${error.message}` : error.message;
    this.notificationService.error(message, 'Error');
  }

  /**
   * Handle unknown error types
   */
  private handleUnknownError(error: unknown, context?: string): void {
    const message = context
      ? `${context}: An unexpected error occurred`
      : 'An unexpected error occurred';
    this.notificationService.error(message, 'Unknown Error');
  }

  /**
   * Extract error message from any error type
   * @param error - The error to extract message from
   * @returns string - The error message
   */
  getErrorMessage(error: unknown): string {
    if (error instanceof ApiError || error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  /**
   * Check if error is a specific type
   * @param error - The error to check
   * @param errorType - The error type to check against
   * @returns boolean - True if error is of the specified type
   */
  isErrorType(error: unknown, errorType: typeof ApiError): error is ApiError {
    return error instanceof errorType;
  }

  /**
   * Create a standardized error response for API methods
   * @param error - The original error
   * @param operation - The operation that failed
   * @returns ApiError - Standardized error
   */
  createApiError(error: unknown, operation: string): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    const message = this.getErrorMessage(error);
    return new ApiError(`Failed to ${operation}: ${message}`);
  }
}
