import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NoteEditor } from "@/components/editor/NoteEditor";

async function getNote(id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("notes")
    .select("id, title, content_md")
    .eq("id", id)
    .single();
  return data;
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await getNote(params.id);
  if (!note) return notFound();
  return (
    <NoteEditor noteId={note.id} initialTitle={note.title} initialContent={note.content_md} />
  );
}
