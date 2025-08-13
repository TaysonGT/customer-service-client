import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    }
})

export default supabase