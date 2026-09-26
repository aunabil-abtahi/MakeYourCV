'use server';

import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function createShareLink(variantId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  // Check if a valid link already exists
  const { data: existing } = await supabase
    .from('shared_links')
    .select('token')
    .eq('variant_id', variantId)
    .eq('is_active', true)
    .single();

  if (existing) {
    return { token: existing.token };
  }

  const token = crypto.randomBytes(16).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

  const { error } = await supabase.from('shared_links').insert({
    user_id: user.id,
    variant_id: variantId,
    token,
    expires_at: expiresAt.toISOString()
  });

  if (error) return { error: error.message };
  
  return { token };
}
