// Add your Supabase project values here.
// Supabase Dashboard → Project Settings → API
const SUPABASE_URL = "https://usxoujoanpliojapfej.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UiegXB7XMukJG8do4OrAEA_Zpi0HHnd";
const WHATSAPP_NUMBER = "94781471365";

const sb = (window.supabase && SUPABASE_URL.startsWith("https://"))
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
