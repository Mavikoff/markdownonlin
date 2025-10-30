"use client";

import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const supabase = createClient();
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
      }}
      className="px-3 py-2 rounded-md border hover:bg-accent"
    >
      Выйти
    </button>
  );
}
