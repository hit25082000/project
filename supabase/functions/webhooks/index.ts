import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  validateWebhookSignature,
  getSupabaseClient,
} from '../_shared/stripe-utils.ts';
import {
  updateUserRole,
  createBillingHistory,
  getUserByStripeCustomerId,
} from '../_shared/supabase-utils.ts';

serve(async (req) => {
  try {
    // Validate webhook signature
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const body = await req.text();
    const event = validateWebhookSignature(body, signature);

    console.log(`Processing webhook event: ${event.type}`);

    const supabase = getSupabaseClient();

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(supabase, event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(supabase, event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(supabase, event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailure(supabase, event.data.object);
        break;
      case 'invoice.created':
        await handleInvoiceCreated(supabase, event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
});

async function handleSubscriptionChange(supabase: any, subscription: any) {
  console.log(
    `Subscription ${subscription.id} status changed to ${subscription.status}`
  );

  await updateUserRole(supabase, subscription.customer, subscription.status);

  // Update subscription record in database
  const { error } = await supabase.from('subscriptions').upsert({
    id: subscription.id,
    user_id: await getUserByStripeCustomerId(supabase, subscription.customer),
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionCancellation(
  supabase: any,
  subscription: any
) {
  console.log(`Subscription ${subscription.id} cancelled`);

  await updateUserRole(supabase, subscription.customer, 'canceled');

  // Update subscription status
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscription.id);

  if (error) {
    console.error('Error updating cancelled subscription:', error);
  }
}

async function handlePaymentSuccess(supabase: any, invoice: any) {
  console.log(`Payment succeeded for invoice ${invoice.id}`);

  const userId = await getUserByStripeCustomerId(supabase, invoice.customer);
  if (userId) {
    await createBillingHistory(
      supabase,
      userId,
      invoice.id,
      invoice.amount_due,
      invoice.currency,
      'paid',
      invoice.description || 'Subscription payment'
    );
  }
}

async function handlePaymentFailure(supabase: any, invoice: any) {
  console.log(`Payment failed for invoice ${invoice.id}`);

  const userId = await getUserByStripeCustomerId(supabase, invoice.customer);
  if (userId) {
    await createBillingHistory(
      supabase,
      userId,
      invoice.id,
      invoice.amount_due,
      invoice.currency,
      'failed',
      invoice.description || 'Subscription payment'
    );
  }
}

async function handleInvoiceCreated(supabase: any, invoice: any) {
  console.log(`Invoice ${invoice.id} created`);

  // This could trigger email notifications or other business logic
  // For now, just log the event
}
