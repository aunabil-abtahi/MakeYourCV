'use client';

import { useActionState } from 'react';
import { login } from '../actions';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import Link from 'next/link';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Welcome back</h2>
        <p style={{ marginTop: '0.5rem' }}>Sign in to continue building your CV.</p>
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
        />
        
        {state?.error && (
          <div style={{ color: 'var(--accent-danger)', fontSize: '0.875rem' }}>
            {state.error}
          </div>
        )}
        
        <Button type="submit" disabled={isPending} style={{ marginTop: '0.5rem' }}>
          {isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link href="/signup" style={{ color: 'var(--accent-primary)' }}>Sign up</Link>
      </div>
    </div>
  );
}
