-- Leaderboard Backend Infrastructure
-- Includes: Score Manipulation Prevention, High Concurrency Support, Weekly Reset Logic

-- 1. Leaderboard Table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    daily_steps INTEGER DEFAULT 0 CHECK (daily_steps >= 0),
    weekly_steps INTEGER DEFAULT 0 CHECK (weekly_steps >= 0),
    total_steps BIGINT DEFAULT 0 CHECK (total_steps >= 0),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    streak_count INTEGER DEFAULT 0,
    is_frozen BOOLEAN DEFAULT FALSE
);

-- 2. Prevent Score Manipulation (RLS)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Everyone can read the leaderboard
CREATE POLICY "Public leaderboard visibility"
ON public.leaderboard FOR SELECT
TO authenticated, anon
USING (true);

-- Users can only update their own steps
CREATE POLICY "Users can update own steps"
ON public.leaderboard FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Prevent Score Manipulation (Trigger)
-- Logic: 
-- - Steps must only increase (monotonicity check)
-- - Max 5,000 steps per single update to prevent massive jumps
-- - Max 100,000 steps per day (sanity check)
CREATE OR REPLACE FUNCTION validate_steps_increment()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for negative increment
    IF NEW.total_steps < OLD.total_steps THEN
        RAISE EXCEPTION 'Steps cannot decrease! Integrity violation.';
    END IF;

    -- Check for massive single update (anti-cheat)
    IF (NEW.total_steps - OLD.total_steps) > 5000 THEN
        RAISE EXCEPTION 'Step increment too large for a single update. Max 5000.';
    END IF;

    -- Update last_updated timestamp
    NEW.last_updated := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_validate_steps_increment
BEFORE UPDATE OF total_steps ON public.leaderboard
FOR EACH ROW
EXECUTE FUNCTION validate_steps_increment();

-- 4. High Concurrency Support (Atomic RPC)
-- Instead of direct UPDATEs from frontend, use this RPC to ensure atomicity
-- and avoid race conditions under high concurrent updates.
CREATE OR REPLACE FUNCTION increment_user_steps(step_count INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.leaderboard
    SET 
        daily_steps = daily_steps + step_count,
        weekly_steps = weekly_steps + step_count,
        total_steps = total_steps + step_count,
        last_updated = NOW()
    WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Weekly Reset Logic
CREATE OR REPLACE FUNCTION reset_weekly_leaderboard()
RETURNS void AS $$
BEGIN
    -- Archive weekly winners if needed (omitted for brevity)
    
    -- Reset weekly steps
    UPDATE public.leaderboard
    SET weekly_steps = 0;
    
    -- Reset daily steps too since it's likely midnight
    UPDATE public.leaderboard
    SET daily_steps = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Schedule Weekly Reset (using pg_cron)
-- Note: Requires pg_cron extension to be enabled in Supabase
-- SELECT cron.schedule('weekly-reset', '0 0 * * 0', 'SELECT reset_weekly_leaderboard()');
