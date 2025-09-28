import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getSupabaseClient } from '../_shared/stripe-utils.ts';
import { validateUserAccess, requireAuth } from '../_shared/jwt-utils.ts';

serve(async (req) => {
  try {
    const userId = await validateUserAccess(req);
    requireAuth(userId);

    const { action, ...params } = await req.json();

    switch (action) {
      case 'history':
        return await handleGetBillingHistory(userId, params);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Billing function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

async function handleGetBillingHistory(userId: string, params: any) {
  const { limit = 20, offset = 0 } = params;

  const supabase = getSupabaseClient();

  try {
    const {
      data: history,
      error,
      count,
    } = await supabase
      .from('billing_history')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        history: history || [],
        total: count || 0,
        limit,
        offset,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error retrieving billing history:', error);
    throw error;
  }
}
