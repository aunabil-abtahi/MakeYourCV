'use server';

import { createClient } from '@/lib/supabase/server';
import { GoogleGenAI } from '@google/genai';
import { revalidatePath } from 'next/cache';

const client = new GoogleGenAI({});

export async function generateTailoredVariant(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const targetJobTitle = formData.get('targetJobTitle') as string;
  const targetCompany = formData.get('targetCompany') as string;
  const jobDescription = formData.get('jobDescription') as string;

  if (!targetJobTitle || !jobDescription) {
    return { error: 'Job title and description are required.' };
  }

  // Fetch user profile, experiences, and skills
  const [
    { data: profile },
    { data: experiences },
    { data: skills }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('experiences').select('*').eq('user_id', user.id),
    supabase.from('skills').select('*').eq('user_id', user.id)
  ]);

  if (!profile || !experiences) {
    return { error: 'Profile or experiences not found.' };
  }

  const systemPrompt = `
You are an expert career coach and professional resume writer.
Your goal is to tailor the user's resume data to the provided Job Description.

User's current profile:
Name: ${profile.full_name}
Base Summary: ${profile.base_summary}
Target Role: ${profile.target_role}

User's Experiences:
${experiences.map(exp => `- ID: ${exp.id} | ${exp.role} at ${exp.company}:\n  Description: ${exp.raw_input}`).join('\n')}

User's Skills:
${skills?.map(skill => skill.skill_name).join(', ')}

Target Job:
Title: ${targetJobTitle}
Company: ${targetCompany}
Description:
${jobDescription}

You must return a valid JSON object with EXACTLY the following structure (do NOT include markdown code blocks, just raw JSON):
{
  "tailoredSummary": "A highly polished, 3-4 sentence professional summary tailored to the job description.",
  "tailoredBullets": [
    {
      "experienceId": "uuid-string-from-input",
      "bullets": ["impact bullet 1", "impact bullet 2", "impact bullet 3"]
    }
  ],
  "tailoredSkills": ["Skill 1", "Skill 2", "Skill 3"]
}
  `;

  try {
    const interaction = await client.interactions.create({
      model: 'gemini-3.5-flash',
      input: systemPrompt,
    });

    let resultText = interaction.output_text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }
    
    // Clean markdown code blocks if the model wrapped it
    resultText = resultText.replace(/^```json\n/, '').replace(/\n```$/, '');

    const tailoredData = JSON.parse(resultText);

    // Save variant to Database
    const { data: variant, error: variantError } = await supabase
      .from('cv_variants')
      .insert({
        user_id: user.id,
        variant_label: `${targetJobTitle} @ ${targetCompany}`,
        target_job_title: targetJobTitle,
        target_company: targetCompany,
        job_description_text: jobDescription,
        tailored_summary: tailoredData.tailoredSummary,
        tailored_bullets: tailoredData.tailoredBullets,
        tailored_skills: tailoredData.tailoredSkills,
      })
      .select()
      .single();

    if (variantError) throw new Error(variantError.message);

    revalidatePath('/builder');
    return { success: true, variantId: variant.id };

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { error: error.message || 'Failed to generate tailored CV' };
  }
}
