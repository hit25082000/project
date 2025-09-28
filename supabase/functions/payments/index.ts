import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getStripeClient, getSupabaseClient } from '../_shared/stripe-utils.ts';
import { validateUserAccess, requireAuth } from '../_shared/jwt-utils.ts';
import { createBillingHistory } from '../_shared/supabase-utils.ts';

serve(async (req) => {
  try {
    const userId = await validateUserAccess(req);
    requireAuth(userId);

    const { action, ...params } = await req.json();

    switch (action) {
      case 'create-intent':
        return await handleCreatePaymentIntent(userId, params);
      case 'refund':
        return await handleRefund(userId, params);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Payment function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

async function handleCreatePaymentIntent(userId: string, params: any) {
  const { amount, currency = 'usd', metadata = {} } = params;

  if (!amount || amount <= 0) {
    return new Response(JSON.stringify({ error: 'Valid amount required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stripe = getStripeClient();

  try {
    // Get or create Stripe customer
    const supabase = getSupabaseClient();
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single();

    let customerId = customer?.id;

    if (!customerId) {
      const authUser = await supabase.auth.admin.getUserById(userId);
      if (!authUser.data.user?.email) {
        throw new Error('User email not found');
      }

      const stripeCustomer = await stripe.customers.create({
        email: authUser.data.user.email,
        metadata: { user_id: userId },
      });

      // Save customer in database
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({
          id: stripeCustomer.id,
          user_id: userId,
        })
        .select()
        .single();

      customerId = newCustomer.id;
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      metadata: {
        user_id: userId,
        ...metadata,
      },
      automatic_payment_methods: { enabled: true },
    });

    // Create billing history record
    await createBillingHistory(
      supabase,
      userId,
      paymentIntent.id,
      amount,
      currency,
      'pending',
      metadata.description || 'One-time payment'
    );

    return new Response(
      JSON.stringify({
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

async function handleRefund(userId: string, params: any) {
  const { paymentId, amount } = params;

  if (!paymentId) {
    return new Response(JSON.stringify({ error: 'Payment ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stripe = getStripeClient();

  try {
    // Verify ownership through billing history
    const supabase = getSupabaseClient();
    const { data: billingRecord } = await supabase
      .from('billing_history')
      .select('id')
      .eq('user_id', userId)
      .eq('stripe_invoice_id', paymentId)
      .single();

    if (!billingRecord) {
      return new Response(
        JSON.stringify({ error: 'Payment not found or unauthorized' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the charge from payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    if (!paymentIntent.charges.data.length) {
      return new Response(
        JSON.stringify({ error: 'No charge found for payment' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const chargeId = paymentIntent.charges.data[0].id;

    // Create refund
    const refundParams: any = {
      charge: chargeId,
    };

    if (amount) {
      refundParams.amount = amount;
    }

    const refund = await stripe.refunds.create(refundParams);

    // Update billing history
    await createBillingHistory(
      supabase,
      userId,
      refund.id,
      refund.amount,
      refund.currency,
      'refunded',
      `Refund for payment ${paymentId}`
    );

    return new Response(
      JSON.stringify({
        refund: {
          id: refund.id,
          amount: refund.amount,
          currency: refund.currency,
          status: refund.status,
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
}
