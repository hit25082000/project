import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getStripeClient, getSupabaseClient } from '../_shared/stripe-utils.ts';
import { validateUserAccess, requireAuth } from '../_shared/jwt-utils.ts';

serve(async (req) => {
  try {
    const userId = await validateUserAccess(req);
    requireAuth(userId);

    const { action, ...params } = await req.json();

    switch (action) {
      case 'create':
        return await handleCreateSubscription(userId, params);
      case 'update':
        return await handleUpdateSubscription(userId, params);
      case 'cancel':
        return await handleCancelSubscription(userId, params);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Subscription function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

async function handleCreateSubscription(userId: string, params: any) {
  const { priceId, paymentMethodId } = params;

  if (!priceId) {
    return new Response(JSON.stringify({ error: 'Price ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stripe = getStripeClient();
  const supabase = getSupabaseClient();

  try {
    // Get or create Stripe customer
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

    // Create subscription
    const subscriptionData: any = {
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    };

    if (paymentMethodId) {
      subscriptionData.default_payment_method = paymentMethodId;
    }

    const subscription = await stripe.subscriptions.create(subscriptionData);

    // Update user role immediately
    const { error: roleError } = await supabase.from('user_roles').upsert(
      {
        user_id: userId,
        role: 'premium',
        stripe_subscription_id: subscription.id,
      },
      {
        onConflict: 'user_id',
      }
    );

    if (roleError) {
      console.error('Error updating user role:', roleError);
    }

    return new Response(
      JSON.stringify({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

async function handleUpdateSubscription(userId: string, params: any) {
  const { subscriptionId, priceId } = params;

  if (!subscriptionId || !priceId) {
    return new Response(
      JSON.stringify({ error: 'Subscription ID and Price ID required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const stripe = getStripeClient();

  try {
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Check if user owns this subscription
    const supabase = getSupabaseClient();
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (subscription.customer !== customer.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update subscription
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: 'none', // Schedule for next billing cycle (downgrade)
      }
    );

    return new Response(
      JSON.stringify({
        subscription: updatedSubscription,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

async function handleCancelSubscription(userId: string, params: any) {
  const { subscriptionId, cancelAtPeriodEnd = true } = params;

  if (!subscriptionId) {
    return new Response(JSON.stringify({ error: 'Subscription ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stripe = getStripeClient();

  try {
    // Verify ownership
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const supabase = getSupabaseClient();
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (subscription.customer !== customer.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cancel subscription
    const cancelledSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: cancelAtPeriodEnd,
      }
    );

    // Update user role
    const { error: roleError } = await supabase
      .from('user_roles')
      .update({
        role: cancelAtPeriodEnd ? 'premium' : 'free', // Keep premium until period ends
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (roleError) {
      console.error('Error updating user role on cancellation:', roleError);
    }

    return new Response(
      JSON.stringify({
        subscription: cancelledSubscription,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}
