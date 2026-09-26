import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Aurora Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ zIndex: 1, maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          margin: 0,
          background: 'var(--gradient-aurora)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Your career,<br />engineered by AI.
        </h1>
        
        <p style={{
          fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
          color: 'var(--text-secondary)',
          margin: 0,
          maxWidth: '600px',
          lineHeight: 1.5
        }}>
          MakeYourCV uses advanced AI to instantly tailor your resume for any job description. Stand out, bypass ATS filters, and land your dream role.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup" style={{
            background: 'var(--accent-primary)',
            color: '#fff',
            padding: '1rem 2.5rem',
            borderRadius: '999px',
            fontSize: '1.125rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
          }}>
            Get Started Free
          </Link>
          <Link href="/login" style={{
            background: 'var(--surface-glass)',
            color: 'var(--text-primary)',
            padding: '1rem 2.5rem',
            borderRadius: '999px',
            fontSize: '1.125rem',
            fontWeight: 600,
            textDecoration: 'none',
            border: '1px solid var(--border-subtle)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.2s ease',
          }}>
            Sign In
          </Link>
        </div>

        {/* Feature Highlights */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          marginTop: '4rem', 
          borderTop: '1px solid var(--border-subtle)', 
          paddingTop: '3rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { title: 'AI Tailoring', desc: 'Paste a job description and get a rewritten resume instantly.' },
            { title: 'Smart Parsing', desc: 'We extract and map your skills to industry standards.' },
            { title: 'Pixel-Perfect PDFs', desc: 'Export beautiful, ATS-friendly PDFs in one click.' }
          ].map((feature, i) => (
            <div key={i} style={{ flex: '1 1 200px', maxWidth: '300px', textAlign: 'left', background: 'var(--surface-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.125rem' }}>{feature.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
