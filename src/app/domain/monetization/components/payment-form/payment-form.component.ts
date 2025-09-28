import {
  Component,
  inject,
  input,
  output,
  signal,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StripeService } from '@shared/services/stripe.service';
import { SubscriptionService } from '../../services/subscription.service';
import { PaymentService } from '../../services/payment.service';
import { StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  // Inputs
  amount = input.required<number>();
  currency = input<string>('usd');
  isSubscription = input<boolean>(false);
  planId = input<string | null>(null);

  // Outputs
  paymentSuccess = output<{ subscriptionId?: string; clientSecret: string }>();
  paymentError = output<string>();

  // Services
  private stripeService = inject(StripeService);
  private subscriptionService = inject(SubscriptionService);
  private paymentService = inject(PaymentService);
  private fb = inject(FormBuilder);

  // Form
  paymentForm: FormGroup;
  isProcessing = signal(false);
  isLoading = signal(true);

  // Stripe Elements
  @ViewChild('cardElement', { static: true }) cardElementRef!: ElementRef;
  private cardElement: StripeCardElement | null = null;
  private elements: any = null;

  constructor() {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.elements = await this.stripeService.createElements();
      if (this.elements) {
        this.cardElement = await this.stripeService.createCardElement(
          this.elements
        );

        // Mount the card element
        if (this.cardElementRef?.nativeElement) {
          this.cardElement.mount(this.cardElementRef.nativeElement);
        }
      }
    } catch (error) {
      console.error('Failed to initialize Stripe Elements:', error);
      this.paymentError.emit('Failed to initialize payment form');
    } finally {
      this.isLoading.set(false);
    }
  }

  ngOnDestroy(): void {
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.paymentForm.valid || !this.cardElement) {
      return;
    }

    this.isProcessing.set(true);

    try {
      const { error: methodError, paymentMethod } =
        await this.stripeService.createPaymentMethod(this.cardElement, {
          name: this.paymentForm.value.name,
          email: this.paymentForm.value.email,
        });

      if (methodError) {
        this.paymentError.emit(
          methodError.message || 'Failed to create payment method'
        );
        return;
      }

      if (this.isSubscription()) {
        // Handle subscription payment
        await this.handleSubscriptionPayment(paymentMethod.id);
      } else {
        // Handle one-time payment
        await this.handleOneTimePayment(paymentMethod.id);
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      this.paymentError.emit('An unexpected error occurred');
    } finally {
      this.isProcessing.set(false);
    }
  }

  private async handleSubscriptionPayment(
    paymentMethodId: string
  ): Promise<void> {
    try {
      const result = await this.subscriptionService.createSubscription(
        this.planId()!,
        paymentMethodId
      );
      this.paymentSuccess.emit(result);
    } catch (error) {
      this.paymentError.emit('Subscription creation failed');
    }
  }

  private async handleOneTimePayment(paymentMethodId: string): Promise<void> {
    try {
      const success = await this.paymentService.processOneTimePayment(
        this.amount(),
        this.currency()
      );

      if (success) {
        this.paymentSuccess.emit({ clientSecret: 'success' });
      } else {
        this.paymentError.emit('Payment processing failed');
      }
    } catch (error) {
      this.paymentError.emit('Payment processing failed');
    }
  }
}
