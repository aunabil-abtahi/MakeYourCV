'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function completeOnboarding(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const fullName = formData.get('fullName') as string;
  const targetRole = formData.get('targetRole') as string;
  const rawResume = formData.get('rawResume') as string;

  // Insert into profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: fullName,
      target_role: targetRole,
      contact_info: {},
      base_summary: rawResume || ''
    });

  if (profileError) {
    return { error: profileError.message };
  }

  redirect('/dashboard');
}
