// @ts-ignore
import type { Database } from '@lensshare/types/database.types';
import { createClient } from '@supabase/supabase-js';

import { SUPABASE_URL } from './constants';

const createSupabaseClient = () => {
  return createClient<Database>(
    SUPABASE_URL,
    process.env.SUPABASE_KEY as string
  );
};

export default createSupabaseClient;
