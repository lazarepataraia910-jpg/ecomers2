import { createClient } from 
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_PUBLISHABLE_KEY'

const supabase = createClient(
    supabaseUrl,
    supabaseKey
)

export { supabase }
