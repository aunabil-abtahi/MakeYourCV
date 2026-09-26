import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/onboarding');
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Welcome back, {profile.full_name}.
          </p>
        </div>
        <Link href="/builder">
          <Button>Create New CV</Button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <h3>Your Resumes</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
            You haven't created any tailored resumes yet.
          </p>
          <Link href="/builder">
            <Button variant="secondary" style={{ width: '100%' }}>Start Building</Button>
          </Link>
        </Card>

        <Card>
          <h3>Profile Overview</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <strong style={{ color: 'var(--text-secondary)' }}>Target Role:</strong> {profile.target_role || 'Not specified'}
            </div>
            <div>
              <strong style={{ color: 'var(--text-secondary)' }}>Base Summary:</strong> 
              {profile.base_summary ? ' Provided' : ' Not provided'}
            </div>
          </div>
          <Link href="/onboarding" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
            <Button variant="secondary">Edit Profile</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
