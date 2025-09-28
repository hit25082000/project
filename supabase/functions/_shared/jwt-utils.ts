import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function validateUserAccess(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const supabase = getSupabaseClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch {
    return null;
  }
}

export async function requireAuth(userId: string | null): Promise<void> {
  if (!userId) {
    throw new Error('Authentication required');
  }
}

export function getSupabaseClient(): ReturnType<typeof createClient> {
  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!url || !anonKey) {
    throw new Error('Supabase configuration missing');
  }

  return createClient(url, anonKey);
}

export function getSupabaseAdminClient(): ReturnType<typeof createClient> {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!url || !serviceKey) {
    throw new Error('Supabase admin configuration missing');
  }

  return createClient(url, serviceKey);
}
