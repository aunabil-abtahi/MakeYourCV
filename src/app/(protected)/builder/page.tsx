import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import BuilderWorkspace from './workspace';

export default async function BuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: profile }, { data: experiences }, { data: education }, { data: skills }, { data: variants }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('experiences').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('education').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('skills').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('cv_variants').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
      <BuilderWorkspace 
        profile={profile} 
        experiences={experiences || []} 
        education={education || []} 
        skills={skills || []} 
        variants={variants || []}
      />
    </div>
  );
}
