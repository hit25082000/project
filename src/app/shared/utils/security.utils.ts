/**
 * Security utilities for payment data handling and PCI compliance
 */

/**
 * Sanitizes payment data by removing sensitive information for logging
 */
export function sanitizePaymentData(data: any): any {
  if (!data) return data;

  const sanitized = { ...data };

  // Remove sensitive card data
  if (sanitized.card) {
    delete sanitized.card;
  }

  // Mask card numbers if present
  if (sanitized.number) {
    sanitized.number = maskCardNumber(sanitized.number);
  }

  // Remove CVV
  if (sanitized.cvc || sanitized.cvv) {
    sanitized.cvc = '***';
    sanitized.cvv = '***';
  }

  return sanitized;
}

/**
 * Masks a credit card number, showing only last 4 digits
 */
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber || cardNumber.length < 4) return '****';

  const lastFour = cardNumber.slice(-4);
  const maskedLength = Math.max(0, cardNumber.length - 4);
  const masked = '*'.repeat(maskedLength);

  return masked + lastFour;
}

/**
 * Validates that required PCI DSS fields are not logged
 */
export function validateNoSensitiveData(logData: any): boolean {
  const sensitiveFields = [
    'card[number]',
    'card[cvc]',
    'card[exp_month]',
    'card[exp_year]',
    'client_secret',
    'payment_method',
    'stripeToken',
  ];

  const dataString = JSON.stringify(logData).toLowerCase();

  return !sensitiveFields.some((field) =>
    dataString.includes(field.toLowerCase())
  );
}

/**
 * Creates a safe log entry for payment operations
 */
export function createSafeLogEntry(
  operation: string,
  data: any,
  userId?: string
): any {
  return {
    operation,
    timestamp: new Date().toISOString(),
    userId: userId ? maskUserId(userId) : undefined,
    data: sanitizePaymentData(data),
    safe: validateNoSensitiveData(data),
  };
}

/**
 * Masks user ID for logging (shows first 4 and last 4 characters)
 */
function maskUserId(userId: string): string {
  if (userId.length <= 8) return '*'.repeat(userId.length);

  const firstFour = userId.substring(0, 4);
  const lastFour = userId.substring(userId.length - 4);
  const maskedLength = userId.length - 8;

  return firstFour + '*'.repeat(maskedLength) + lastFour;
}
