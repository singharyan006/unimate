-- DANGEROUS: DROP EXISTING TABLES
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.consultants CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Create PROFILES table (Base for all users)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (select auth.jwt() ->> 'sub')
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY, -- Clerk ID (Text)
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('student', 'consultant', 'admin')),
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((select auth.jwt() ->> 'sub') = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING ((select auth.jwt() ->> 'sub') = id);
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING ((select auth.jwt() ->> 'sub') = id);
CREATE POLICY "Users can view all consultants" ON public.profiles FOR SELECT TO authenticated USING (role = 'consultant'); -- Students might need to see consultant profiles


-- 2. Create ADMINS table
CREATE TABLE public.admins (
    id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Policies for admins
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin());
 -- Example policy
CREATE POLICY "Admins can insert their own admin profile" ON public.admins FOR INSERT TO authenticated WITH CHECK ((select auth.jwt() ->> 'sub') = id);
CREATE POLICY "Admins can view their own admin profile" ON public.admins FOR SELECT TO authenticated USING ((select auth.jwt() ->> 'sub') = id);


-- 3. Create STUDENTS table
CREATE TABLE public.students (
    id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    stream TEXT,
    school_name TEXT,
    school_city TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Policies for students
CREATE POLICY "Users can insert their own student profile" ON public.students FOR INSERT TO authenticated WITH CHECK ((select auth.jwt() ->> 'sub') = id);
CREATE POLICY "Users can update their own student profile" ON public.students FOR UPDATE TO authenticated USING ((select auth.jwt() ->> 'sub') = id);
CREATE POLICY "Users can view their own student profile" ON public.students FOR SELECT TO authenticated USING ((select auth.jwt() ->> 'sub') = id);
CREATE POLICY "Admins can view all students" ON public.students FOR SELECT TO authenticated USING (public.is_admin());


-- 4. Create CONSULTANTS table
CREATE TABLE public.consultants (
    id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    university TEXT,
    college_city TEXT,
    major TEXT,
    graduation_year TEXT,
    linkedin_url TEXT,
    college_email TEXT,
    specializations TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    hourly_rate NUMERIC DEFAULT 0,
    aadhaar_number TEXT,
    bio TEXT,
    experience_years INT,
    languages TEXT[],
    titles TEXT[],
    rating NUMERIC DEFAULT 5.0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for consultants
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;

-- Policies for consultants
CREATE POLICY "Users can insert their own consultant profile" ON public.consultants FOR INSERT TO authenticated WITH CHECK ((select auth.jwt() ->> 'sub') = id);
CREATE POLICY "Users can update their own consultant profile" ON public.consultants FOR UPDATE TO authenticated USING ((select auth.jwt() ->> 'sub') = id);
CREATE POLICY "Users can view their own consultant profile" ON public.consultants FOR SELECT TO authenticated USING ((select auth.jwt() ->> 'sub') = id);
CREATE POLICY "Everyone can view consultants" ON public.consultants FOR SELECT TO authenticated USING (true); -- Publicly visible to authenticated users (students search for them)


-- 5. Create BOOKINGS table
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    consultant_id TEXT REFERENCES public.consultants(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT DEFAULT 60,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    topic TEXT,
    meeting_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT TO authenticated USING ((select auth.jwt() ->> 'sub') = student_id OR (select auth.jwt() ->> 'sub') = consultant_id);
CREATE POLICY "Users can insert bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK ((select auth.jwt() ->> 'sub') = student_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE TO authenticated USING ((select auth.jwt() ->> 'sub') = student_id OR (select auth.jwt() ->> 'sub') = consultant_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT TO authenticated USING (public.is_admin());

-- Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
