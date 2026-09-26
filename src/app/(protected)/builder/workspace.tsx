'use client';
import { useState, useTransition } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Toast } from '@/components/ui/Toast/Toast';
import { saveProfile, addExperience, addEducation, addSkill } from './actions';
import { generateTailoredVariant } from './ai-actions';
import { createShareLink } from './share-actions';

export default function BuilderWorkspace({ profile, experiences, education, skills, variants }: {
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  variants: any[];
}) {
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'education' | 'skills' | 'ai-tailor'>('profile');
  const [activeVariantId, setActiveVariantId] = useState<string | null>(variants[0]?.id || null);
  const [isPending, startTransition] = useTransition();
  const [aiError, setAiError] = useState<string | null>(null);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const activeVariant = variants.find(v => v.id === activeVariantId);

  const handleGenerateVariant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAiError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await generateTailoredVariant(formData);
      if (res.error) {
        setAiError(res.error);
      } else if (res.variantId) {
        setActiveVariantId(res.variantId);
        showToast('Successfully generated AI tailored resume!');
      }
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = async () => {
    if (!activeVariantId) {
      showToast('Please generate or select a variant to share first.');
      return;
    }
    setIsSharing(true);
    const res = await createShareLink(activeVariantId);
    setIsSharing(false);
    
    if (res.error) {
      showToast(res.error);
    } else if (res.token) {
      const url = `${window.location.origin}/share/${res.token}`;
      navigator.clipboard.writeText(url);
      showToast('Public link copied to clipboard!');
    }
  };

  const handleExportPDF = async () => {
    if (!activeVariantId) {
      showToast('Please generate or select a variant to export.');
      return;
    }
    
    // We fetch the share link token and use it to hit the PDF endpoint
    setIsSharing(true);
    const res = await createShareLink(activeVariantId);
    setIsSharing(false);
    
    if (res.error) {
      showToast(res.error);
    } else if (res.token) {
      window.open(`/api/export/pdf?token=${res.token}`, '_blank');
    }
  };

  // We can use a simple form action handler wrapper here to show optimistic updates 
  // or just rely on server actions to revalidate.
  
  return (
    <>
      {/* Left Pane - Forms */}
      <div style={{ 
        width: '50%', 
        borderRight: '1px solid var(--border-subtle)', 
        overflowY: 'auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        background: 'rgba(10, 10, 10, 0.5)'
      }}>
        <h2>Data Editor</h2>
        
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', overflowX: 'auto' }}>
          {['profile', 'experience', 'education', 'skills', 'ai-tailor'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                cursor: 'pointer',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <Card>
            <h3>Basic Info</h3>
            <form action={async (formData) => { await saveProfile(formData); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <Input name="fullName" label="Full Name" defaultValue={profile.full_name} required />
              <Input name="targetRole" label="Target Role" defaultValue={profile.target_role} />
              <Button type="submit">Save Profile</Button>
            </form>
          </Card>
        )}

        {activeTab === 'experience' && (
          <Card>
            <h3>Add Experience</h3>
            <form action={async (formData) => { await addExperience(formData); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <Input name="company" label="Company Name" required />
              <Input name="role" label="Role / Title" required />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
                <textarea 
                  name="description" 
                  rows={4}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }} 
                />
              </div>
              <Button type="submit">Add Experience</Button>
            </form>
          </Card>
        )}

        {activeTab === 'education' && (
          <Card>
            <h3>Add Education</h3>
            <form action={async (formData) => { await addEducation(formData); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <Input name="institution" label="Institution Name" required />
              <Input name="degree" label="Degree / Certificate" required />
              <Button type="submit">Add Education</Button>
            </form>
          </Card>
        )}

        {activeTab === 'skills' && (
          <Card>
            <h3>Add Skill</h3>
            <form action={async (formData) => { await addSkill(formData); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <Input name="skill_name" label="Skill Name" placeholder="e.g. React, TypeScript, Management" required />
              <Button type="submit">Add Skill</Button>
            </form>
          </Card>
        )}

        {activeTab === 'ai-tailor' && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>AI Resume Tailor</h3>
              <select 
                value={activeVariantId || ''} 
                onChange={e => setActiveVariantId(e.target.value)}
                style={{ 
                  background: 'var(--bg-secondary)', 
                  color: 'var(--text-primary)', 
                  border: '1px solid var(--border-subtle)', 
                  padding: '0.5rem', 
                  borderRadius: '4px' 
                }}
              >
                <option value="">-- View Base Resume --</option>
                {variants.map(v => (
                  <option key={v.id} value={v.id}>{v.variant_label}</option>
                ))}
              </select>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Generate a new tailored version of your resume based on a target job description.
            </p>
            <form onSubmit={handleGenerateVariant} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <Input name="targetJobTitle" label="Target Job Title" required />
              <Input name="targetCompany" label="Target Company" required />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Job Description</label>
                <textarea 
                  name="jobDescription" 
                  rows={6}
                  required
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }} 
                />
              </div>
              {aiError && <div style={{ color: 'var(--accent-danger)' }}>{aiError}</div>}
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Generating with AI...' : 'Generate Tailored Resume'}
              </Button>
            </form>
          </Card>
        )}
      </div>

      {/* Right Pane - Preview */}
      <div style={{ width: '50%', overflowY: 'auto', padding: '2rem', background: 'var(--bg-primary)', position: 'relative' }}>
        
        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
          <Button variant="secondary" onClick={handleShare} disabled={isSharing}>
            {isSharing ? 'Sharing...' : 'Share Link'}
          </Button>
          <Button onClick={handleExportPDF} disabled={isSharing}>
            Export PDF
          </Button>
        </div>

        <div style={{ 
          background: 'var(--surface-glass)', 
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          minHeight: '100%',
          padding: '2rem'
        }}>
          {/* Resume Preview Header */}
          <div style={{ borderBottom: '2px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', background: 'var(--gradient-aurora)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {profile.full_name || 'Your Name'}
            </h1>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
              {profile.target_role || 'Target Role'}
            </h2>
          </div>

          {/* Resume Preview Body */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Summary Section */}
            {(activeVariant?.tailored_summary || profile.base_summary) && (
              <div>
                <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Summary</h3>
                <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {activeVariant?.tailored_summary || profile.base_summary}
                </p>
              </div>
            )}

            {/* Experience Section */}
            {experiences.length > 0 && (
              <div>
                <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Experience</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {experiences.map(exp => {
                    const variantExp = activeVariant?.tailored_bullets?.find((b: any) => b.experienceId === exp.id);
                    
                    return (
                      <div key={exp.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <strong style={{ fontSize: '1.125rem' }}>{exp.role}</strong>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{exp.company}</span>
                        </div>
                        
                        {variantExp ? (
                          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {variantExp.bullets.map((bullet: string, i: number) => (
                              <li key={i}>{bullet}</li>
                            ))}
                          </ul>
                        ) : (
                          <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
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
            {education.length > 0 && (
              <div>
                <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Education</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {education.map(edu => (
                    <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong>{edu.degree}</strong>
                      <span style={{ color: 'var(--text-secondary)' }}>{edu.institution}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {(activeVariant?.tailored_skills?.length > 0 || skills.length > 0) && (
              <div>
                <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(activeVariant?.tailored_skills || skills.map(s => s.skill_name)).map((skill: string, idx: number) => (
                    <span key={idx} style={{ 
                      padding: '0.25rem 0.75rem', 
                      background: 'var(--bg-secondary)', 
                      borderRadius: '999px',
                      fontSize: '0.875rem',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Absolute Toast */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50 }}>
          <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
        </div>
      )}
    </>
  );
}
