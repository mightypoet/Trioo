-- Supabase Database Schema Definition for TRAVY Admin Dashboard

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Agencies Table
CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    verification_status VARCHAR(50) DEFAULT 'pending',
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    cover_image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Packages Table
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    tier_name VARCHAR(100) NOT NULL, -- e.g., "Standard", "Luxury"
    price NUMERIC(10, 2) NOT NULL,
    inclusions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Itineraries Table
CREATE TABLE IF NOT EXISTS public.itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    detailed_description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (trip_id, day_number)
);

-- Row Level Security (RLS) setup for Admin role
-- Assuming we're using Supabase's built-in auth and admin users have a specific role or are checked via a custom function/claim.

ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- Create Policies for Admins (Assuming 'admin' is a role or authenticated users are admins for this dashboard)
-- Example: Allow authenticated users to perform all operations (adjust as per actual auth implementation)

-- Agencies Policies
CREATE POLICY "Allow full access to authenticated users on agencies"
    ON public.agencies FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Trips Policies
CREATE POLICY "Allow full access to authenticated users on trips"
    ON public.trips FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Packages Policies
CREATE POLICY "Allow full access to authenticated users on packages"
    ON public.packages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Itineraries Policies
CREATE POLICY "Allow full access to authenticated users on itineraries"
    ON public.itineraries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Functions and Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON public.agencies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON public.itineraries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
