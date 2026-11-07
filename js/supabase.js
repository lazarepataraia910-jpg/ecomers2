import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.58.0/+esm";

// Project URL and publishable key (safe for the browser; Row Level Security
// in supabase/setup.sql controls who can change data).
const supabaseUrl = "https://jgjodxhdaygjdurutpyc.supabase.co";
const supabaseKey = "sb_publishable_rkP-sViiyECxCTrrG3zdtg_caAFGJcv";

const isConfigured = !supabaseUrl.startsWith("YOUR_") && !supabaseKey.startsWith("YOUR_");

const supabase = isConfigured ? createClient(supabaseUrl, supabaseKey) : null;

export { supabase, isConfigured };
