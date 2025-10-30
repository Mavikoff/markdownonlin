import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getNotes() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [] as any[];
  const { data } = await supabase
    .from("notes")
    .select("id, title, updated_at")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

async function createNoteAction() {
  "use server";
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data, error } = await supabase
    .from("notes")
    .insert({ title: "Новая заметка", content_md: "", user_id: user.id })
    .select("id")
    .single();
  if (error) throw error;
  revalidatePath("/app");
  return data?.id as string | undefined;
}

export default async function AppHomePage() {
  const notes = await getNotes();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h2 className="text-lg font-semibold">Ваши заметки</h2>
        <form action={async () => {
          const id = await createNoteAction();
          if (id) {
            // This won't redirect from server; link provides navigation
          }
        }}>
          <button type="submit" className="px-3 py-2 rounded-md border hover:bg-accent">Новая</button>
        </form>
      </div>
      <div className="p-4 grid gap-2">
        {notes.length === 0 && (
          <div className="text-sm text-muted-foreground">Пусто. Создайте первую заметку.</div>
        )}
        {notes.map((n) => (
          <Link key={n.id} href={`/app/notes/${n.id}`} className="flex items-center justify-between px-3 py-2 border rounded-md hover:bg-accent">
            <span className="truncate">{n.title || "Без названия"}</span>
            <span className="text-xs text-muted-foreground">{new Date(n.updated_at).toLocaleString()}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
