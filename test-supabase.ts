import { supabase } from './src/lib/supabase';
async function test() {
  const { data, error } = await supabase.from('tripboards').select('*').limit(1);
  console.log(data, error);
}
test();
