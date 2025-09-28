import { Injectable, inject } from '@angular/core';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripeCardElement,
  StripePaymentElement,
} from '@stripe/stripe-js';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise = loadStripe(environment.STRIPE_PUBLISHABLE_KEY);

  async getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  async createElements(): Promise<StripeElements | null> {
    const stripe = await this.getStripe();
    if (!stripe) return null;

    return stripe.elements();
  }

  async createPaymentElement(
    elements: StripeElements
  ): Promise<StripePaymentElement> {
    return elements.create('payment');
  }

  async createCardElement(
    elements: StripeElements
  ): Promise<StripeCardElement> {
    return elements.create('card');
  }

  async confirmCardPayment(clientSecret: string, paymentMethod: any) {
    const stripe = await this.getStripe();
    if (!stripe) throw new Error('Stripe not initialized');

    return stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });
  }

  async confirmPayment(clientSecret: string, options?: any) {
    const stripe = await this.getStripe();
    if (!stripe) throw new Error('Stripe not initialized');

    return stripe.confirmPayment({
      clientSecret,
      ...options,
    });
  }
}
