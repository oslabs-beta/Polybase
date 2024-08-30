import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvyfoqdxqxjnokrkvglp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2eWZvcWR4cXhqbm9rcmt2Z2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5NDgyOTMsImV4cCI6MjA0MDUyNDI5M30.WukgoVj_T7PlIxtWO8OOckWHtTRv4OtoKlSgOjGe_gA';

export const supabase = createClient(supabaseUrl, supabaseKey);