import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 
    'Missing Supabase environment variables.\n\n' +
    'Please create a .env.local file in the app directory with:\n' +
    'NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key\n\n' +
    'See SETUP.md for detailed instructions.';
  
  throw new Error(errorMessage);
}

// Check if values are still placeholders
if (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
  const errorMessage = 
    'Supabase environment variables are not configured.\n\n' +
    'Please update .env.local with your actual Supabase credentials:\n' +
    '1. Go to https://supabase.com/dashboard\n' +
    '2. Select your project > Settings > API\n' +
    '3. Copy Project URL and anon public key\n' +
    '4. Update .env.local and restart the dev server\n\n' +
    'See SETUP.md for detailed instructions.';
  
  throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

