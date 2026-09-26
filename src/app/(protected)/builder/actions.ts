'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const full_name = formData.get('fullName') as string;
  const target_role = formData.get('targetRole') as string;

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, target_role })
    .eq('id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/builder');
  return { success: true };
}

export async function addExperience(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const company = formData.get('company') as string;
  const role = formData.get('role') as string;
  const raw_input = formData.get('description') as string;

  const { error } = await supabase
    .from('experiences')
    .insert({
      user_id: user.id,
      company,
      role,
      raw_input,
    });

  if (error) return { error: error.message };
  revalidatePath('/builder');
  return { success: true };
}

export async function addEducation(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const institution = formData.get('institution') as string;
  const degree = formData.get('degree') as string;

  const { error } = await supabase
    .from('education')
    .insert({
      user_id: user.id,
      institution,
      degree,
    });

  if (error) return { error: error.message };
  revalidatePath('/builder');
  return { success: true };
}

export async function addSkill(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const skill_name = formData.get('skill_name') as string;
  
  const { error } = await supabase
    .from('skills')
    .insert({
      user_id: user.id,
      skill_name,
    });

  if (error) return { error: error.message };
  revalidatePath('/builder');
  return { success: true };
}
