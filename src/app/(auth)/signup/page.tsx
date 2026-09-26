'use client';

import { useActionState } from 'react';
import { signup } from '../actions';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import Link from 'next/link';

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Create an account</h2>
        <p style={{ marginTop: '0.5rem' }}>Start your AI-engineered career journey.</p>
      </div>
      
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input 
          name="email" 
          type="email" 
          label="Email address" 
          required 
          placeholder="you@example.com" 
        />
        <Input 
          name="password" 
          type="password" 
          label="Password" 
          required 
          placeholder="••••••••" 
          minLength={6}
        />
        
        {state?.error && (
          <div style={{ color: 'var(--accent-danger)', fontSize: '0.875rem' }}>
            {state.error}
          </div>
        )}
        
        <Button type="submit" disabled={isPending} style={{ marginTop: '0.5rem' }}>
          {isPending ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Already have an account? <Link href="/login" style={{ color: 'var(--accent-primary)' }}>Sign in</Link>
      </div>
    </div>
  );
}
