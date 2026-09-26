'use client';

import { useState, useActionState } from 'react';
import { completeOnboarding } from './actions';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [state, formAction, isPending] = useActionState(completeOnboarding, null);

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '1rem' }}>
      <Card>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2>Welcome to MakeYourCV</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Let's get your profile set up (Step {step} of 3)</p>
        </div>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: step === 1 ? 'flex' : 'none', flexDirection: 'column', gap: '1rem' }}>
            <h3>What's your name and contact info?</h3>
            <Input name="fullName" label="Full Name" required={step === 1} placeholder="John Doe" />
          </div>

          <div style={{ display: step === 2 ? 'flex' : 'none', flexDirection: 'column', gap: '1rem' }}>
            <h3>Paste your existing resume (optional)</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              We'll use this as a baseline to help generate your AI tailored variants.
            </p>
            <textarea 
              name="rawResume"
              rows={8}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '1rem',
                color: 'var(--text-primary)',
                resize: 'vertical',
                fontFamily: 'inherit',
                outline: 'none'
              }}
              placeholder="Paste your raw resume text here..."
            />
          </div>

          <div style={{ display: step === 3 ? 'flex' : 'none', flexDirection: 'column', gap: '1rem' }}>
            <h3>What kind of role are you targeting?</h3>
            <Input name="targetRole" label="Target Role" required={step === 3} placeholder="e.g. Senior Frontend Engineer" />
          </div>

          {state?.error && (
            <div style={{ color: 'var(--accent-danger)' }}>{state.error}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            {step > 1 ? (
              <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>
            ) : <div />}
            
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>Next</Button>
            ) : (
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
