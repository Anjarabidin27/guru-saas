-- Add status_langganan to profiles for Individual B2C Subscription
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status_langganan VARCHAR(20) DEFAULT 'free' CHECK (status_langganan IN ('free', 'pro'));

-- Update RLS for profiles to allow Super Admin to manage this field
-- The existing policy "Hanya Super Admin yang bisa Modifikasi Global" should already cover this
-- but let's ensure Super Admin has full ALL permissions on profiles.
DROP POLICY IF EXISTS "Super Admin can manage all profiles" ON public.profiles;
CREATE POLICY "Super Admin can manage all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );
