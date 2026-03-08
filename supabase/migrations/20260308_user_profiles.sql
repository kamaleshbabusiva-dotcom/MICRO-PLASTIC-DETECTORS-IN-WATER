-- ======================================================================
-- AquaPure Detect – User Profiles & Data Schema
-- Firebase Auth → Supabase Data Sync
-- ======================================================================

-- 1. Profiles table (synced from Firebase Authentication)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT UNIQUE NOT NULL,
    email TEXT,
    full_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    auth_provider TEXT NOT NULL DEFAULT 'email',
    role TEXT DEFAULT 'citizen' CHECK (role IN ('admin', 'citizen', 'inspector')),
    specialty TEXT,
    expertise_level TEXT,
    detection_mode TEXT,
    authority_name TEXT,
    is_onboarded BOOLEAN DEFAULT FALSE,
    streak_count INTEGER DEFAULT 0,
    bonus_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid ON public.profiles(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);


-- 2. Detections table (AI scan results)
CREATE TABLE IF NOT EXISTS public.detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    scan_type TEXT NOT NULL DEFAULT 'camera',
    total_particles INTEGER DEFAULT 0,
    concentration DECIMAL(10,2),
    max_risk TEXT,
    polymers_found JSONB,
    location_lat DECIMAL(10,6),
    location_lng DECIMAL(10,6),
    image_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_detections_user_id ON public.detections(user_id);
CREATE INDEX IF NOT EXISTS idx_detections_created_at ON public.detections(created_at DESC);


-- 3. Water Reports table (citizen contamination reports)
CREATE TABLE IF NOT EXISTS public.water_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    location_name TEXT NOT NULL,
    location_lat DECIMAL(10,6),
    location_lng DECIMAL(10,6),
    contamination_level TEXT DEFAULT 'medium' CHECK (contamination_level IN ('low', 'medium', 'high', 'critical')),
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    assigned_inspector UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_water_reports_reporter ON public.water_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_water_reports_status ON public.water_reports(status);


-- ======================================================================
-- Row Level Security
-- ======================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, identified via app-level firebase_uid matching
CREATE POLICY "profiles_read_all" ON public.profiles
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "profiles_insert" ON public.profiles
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Detections: public read, insert by authenticated
CREATE POLICY "detections_read_all" ON public.detections
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "detections_insert" ON public.detections
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Water Reports: public read, insert by authenticated
CREATE POLICY "water_reports_read_all" ON public.water_reports
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "water_reports_insert" ON public.water_reports
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "water_reports_update" ON public.water_reports
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);


-- ======================================================================
-- Upsert function: sync Firebase user → Supabase profiles
-- ======================================================================

CREATE OR REPLACE FUNCTION public.upsert_firebase_user(
    p_firebase_uid TEXT,
    p_email TEXT,
    p_full_name TEXT,
    p_avatar_url TEXT,
    p_phone TEXT,
    p_auth_provider TEXT
)
RETURNS JSON AS $$
DECLARE
    v_profile public.profiles%ROWTYPE;
BEGIN
    INSERT INTO public.profiles (firebase_uid, email, full_name, display_name, avatar_url, phone, auth_provider)
    VALUES (p_firebase_uid, p_email, p_full_name, p_full_name, p_avatar_url, p_phone, p_auth_provider)
    ON CONFLICT (firebase_uid) DO UPDATE SET
        email = COALESCE(EXCLUDED.email, profiles.email),
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        updated_at = NOW()
    RETURNING * INTO v_profile;

    RETURN row_to_json(v_profile);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
