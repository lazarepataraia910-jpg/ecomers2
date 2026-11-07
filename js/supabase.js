import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";

// Paste your project's values from Supabase → Project Settings → API.
// Until they are filled in, the site runs in local mode (localStorage).
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_PUBLISHABLE_KEY";

const isConfigured = !supabaseUrl.startsWith("YOUR_") && !supabaseKey.startsWith("YOUR_");

const supabase = isConfigured ? createClient(supabaseUrl, supabaseKey) : null;

export { supabase, isConfigured };
