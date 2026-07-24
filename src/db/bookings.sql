CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE RESTRICT,
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE RESTRICT,
    travel_date DATE NOT NULL,
    traveler_count INTEGER NOT NULL CHECK (traveler_count > 0),
    status booking_status DEFAULT 'pending',
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookings"
    ON public.bookings FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
    ON public.bookings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agencies can read own bookings"
    ON public.bookings FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'agency' 
            AND agency_id = public.bookings.agency_id
        )
    );

CREATE POLICY "Admins can read all bookings"
    ON public.bookings FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
