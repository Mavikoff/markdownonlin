import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { CookieOptions } from "@supabase/auth-helpers-shared";

export const createClient = () => {
  return createServerComponentClient({ cookies: () => cookies() });
};
