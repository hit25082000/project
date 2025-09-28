import { getSupabaseAdminClient } from './jwt-utils.ts';

export async function updateUserRole(
  supabase: any,
  customerId: string,
  subscriptionStatus: string
): Promise<void> {
  try {
    // Find user by Stripe customer ID
    const { data: customer } = await supabase
      .from('customers')
      .select('id, user_id')
      .eq('id', customerId)
      .single();

    if (!customer) {
      console.error(`Customer ${customerId} not found`);
      return;
    }

    // Determine role based on subscription status
    let role = 'free';
    if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
      role = 'premium';
    }

    // Update or insert user role
    const { error } = await supabase.from('user_roles').upsert(
      {
        user_id: customer.user_id,
        role,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      }
    );

    if (error) {
      console.error('Error updating user role:', error);
    } else {
      console.log(`Updated user ${customer.user_id} role to ${role}`);
    }
  } catch (error) {
    console.error('Error in updateUserRole:', error);
  }
}

export async function createBillingHistory(
  supabase: any,
  userId: string,
  stripeInvoiceId: string,
  amount: number,
  currency: string,
  status: string,
  description?: string
): Promise<void> {
  try {
    const { error } = await supabase.from('billing_history').insert({
      user_id: userId,
      stripe_invoice_id: stripeInvoiceId,
      amount,
      currency,
      status,
      description,
    });

    if (error) {
      console.error('Error creating billing history:', error);
    }
  } catch (error) {
    console.error('Error in createBillingHistory:', error);
  }
}

export async function getUserByStripeCustomerId(
  supabase: any,
  customerId: string
): Promise<string | null> {
  try {
    const { data: customer } = await supabase
      .from('customers')
      .select('user_id')
      .eq('id', customerId)
      .single();

    return customer?.user_id || null;
  } catch {
    return null;
  }
}
