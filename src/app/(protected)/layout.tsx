import { ReactNode } from 'react';
import Link from 'next/link';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        padding: '1rem 2rem', 
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(16px)'
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.25rem', 
            background: 'var(--gradient-aurora)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            MakeYourCV
          </h2>
        </Link>
      </header>
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
