-- 1. Create tables
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  contact_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  base_summary TEXT DEFAULT '',
  target_role TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  raw_input TEXT,
  ai_bullets TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT DEFAULT '',
  graduation_date DATE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE cv_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  variant_label TEXT NOT NULL DEFAULT 'Untitled Variant',
  target_job_title TEXT NOT NULL,
  target_company TEXT DEFAULT '',
  job_description_text TEXT NOT NULL,
  tailored_summary TEXT DEFAULT '',
  tailored_bullets JSONB DEFAULT '[]'::jsonb,
  tailored_skills TEXT[] DEFAULT '{}',
  resume_score INT,
  score_breakdown JSONB,
  score_suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES cv_variants(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Cover Letter',
  content TEXT NOT NULL DEFAULT '',
  target_company TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE shared_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES cv_variants(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ,
  view_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now() -- Adding updated_at for consistency with trigger
);

-- 2. Setup Updated_At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cv_variants_updated_at BEFORE UPDATE ON cv_variants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cover_letters_updated_at BEFORE UPDATE ON cover_letters FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_shared_links_updated_at BEFORE UPDATE ON shared_links FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_api_logs_updated_at BEFORE UPDATE ON api_logs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 3. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Profiles
CREATE POLICY "Users can select own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- Experiences
CREATE POLICY "Users can select own experiences" ON experiences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own experiences" ON experiences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experiences" ON experiences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own experiences" ON experiences FOR DELETE USING (auth.uid() = user_id);

-- Education
CREATE POLICY "Users can select own education" ON education FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own education" ON education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own education" ON education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own education" ON education FOR DELETE USING (auth.uid() = user_id);

-- Skills
CREATE POLICY "Users can select own skills" ON skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skills" ON skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skills" ON skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own skills" ON skills FOR DELETE USING (auth.uid() = user_id);

-- CV Variants
CREATE POLICY "Users can select own cv_variants" ON cv_variants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cv_variants" ON cv_variants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cv_variants" ON cv_variants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cv_variants" ON cv_variants FOR DELETE USING (auth.uid() = user_id);

-- Cover Letters
CREATE POLICY "Users can select own cover_letters" ON cover_letters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cover_letters" ON cover_letters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cover_letters" ON cover_letters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cover_letters" ON cover_letters FOR DELETE USING (auth.uid() = user_id);

-- Shared Links
CREATE POLICY "Users can select own shared_links" ON shared_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shared_links" ON shared_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shared_links" ON shared_links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shared_links" ON shared_links FOR DELETE USING (auth.uid() = user_id);

-- API Logs
CREATE POLICY "Users can select own api_logs" ON api_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own api_logs" ON api_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own api_logs" ON api_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own api_logs" ON api_logs FOR DELETE USING (auth.uid() = user_id);

-- 5. Public Share Policy for Shared Links & CV Variants
-- Allow anonymous read when accessed via a valid, non-expired token with is_active = true
CREATE POLICY "Public can select active shared_links" ON shared_links FOR SELECT USING (
  is_active = true AND (expires_at IS NULL OR expires_at > now())
);

-- Note: The cv_variants policy needs to allow selecting if there is a matching shared_link.
-- However, RLS policies for SELECT are evaluated per-row. We can add a policy to cv_variants
-- that checks if a valid shared_link exists for its id.
CREATE POLICY "Public can select cv_variants via active shared link" ON cv_variants FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM shared_links 
    WHERE shared_links.variant_id = cv_variants.id 
      AND shared_links.is_active = true 
      AND (shared_links.expires_at IS NULL OR shared_links.expires_at > now())
  )
);
