import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

export default async function SharedCVPage({ params }: { params: { token: string } }) {
  // Use admin client to bypass RLS for public viewing of related data
  // Only fetching if token is valid.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data: link } = await supabaseAdmin
    .from('shared_links')
    .select('variant_id, is_active, expires_at, user_id')
    .eq('token', params.token)
    .single();

  if (!link || !link.is_active || (link.expires_at && new Date(link.expires_at) < new Date())) {
    notFound();
  }

  // Fetch the variant and user base data
  const [
    { data: variant },
    { data: profile },
    { data: experiences },
    { data: education },
    { data: skills }
  ] = await Promise.all([
    supabaseAdmin.from('cv_variants').select('*').eq('id', link.variant_id).single(),
    supabaseAdmin.from('profiles').select('*').eq('id', link.user_id).single(),
    supabaseAdmin.from('experiences').select('*').eq('user_id', link.user_id).order('created_at', { ascending: false }),
    supabaseAdmin.from('education').select('*').eq('user_id', link.user_id).order('created_at', { ascending: false }),
    supabaseAdmin.from('skills').select('*').eq('user_id', link.user_id).order('created_at', { ascending: false }),
  ]);

  if (!variant || !profile) {
    notFound();
  }

  // Same rendering logic as the Builder preview
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: '#fff', color: '#000', borderRadius: '8px' }}>
      {/* Resume Preview Header */}
      <div style={{ borderBottom: '2px solid #ccc', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#111' }}>
          {profile.full_name || 'Your Name'}
        </h1>
        <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', color: '#555' }}>
          {variant.target_job_title || profile.target_role || 'Target Role'}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Summary Section */}
        {(variant.tailored_summary || profile.base_summary) && (
          <div>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#333' }}>Professional Summary</h3>
            <p style={{ whiteSpace: 'pre-wrap', color: '#444', lineHeight: 1.6 }}>
              {variant.tailored_summary || profile.base_summary}
            </p>
          </div>
        )}

        {/* Experience Section */}
        {experiences && experiences.length > 0 && (
          <div>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#333' }}>Experience</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {experiences.map(exp => {
                const variantExp = variant.tailored_bullets?.find((b: any) => b.experienceId === exp.id);
                
                return (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '1.125rem', color: '#222' }}>{exp.role}</strong>
                      <span style={{ color: '#666', fontSize: '0.875rem' }}>{exp.company}</span>
                    </div>
                    
                    {variantExp ? (
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', color: '#444', lineHeight: 1.6 }}>
                        {variantExp.bullets.map((bullet: string, i: number) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: '#444', lineHeight: 1.6 }}>
                        {exp.raw_input || 'No description provided.'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <div>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#333' }}>Education</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ color: '#222' }}>{edu.degree}</strong>
                  <span style={{ color: '#666' }}>{edu.institution}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {((variant.tailored_skills && variant.tailored_skills.length > 0) || (skills && skills.length > 0)) && (
          <div>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#333' }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(variant.tailored_skills || (skills ? skills.map(s => s.skill_name) : [])).map((skill: string, idx: number) => (
                <span key={idx} style={{ 
                  padding: '0.25rem 0.75rem', 
                  background: '#f0f0f0', 
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  border: '1px solid #ccc',
                  color: '#333'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
