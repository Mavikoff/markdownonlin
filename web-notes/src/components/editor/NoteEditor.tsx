"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { createClient } from "@/lib/supabase/client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

interface NoteEditorProps {
  noteId: string;
  initialTitle: string;
  initialContent: string;
}

export function NoteEditor({ noteId, initialTitle, initialContent }: NoteEditorProps) {
  const supabase = useMemo(() => createClient(), []);
  const [title, setTitle] = useState(initialTitle);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: true }),
      Placeholder.configure({ placeholder: "Start typing..." }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    editor?.commands.setContent(initialContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  const save = useDebouncedCallback(async (newTitle: string, newContent: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("notes")
        .update({ title: newTitle, content_md: newContent })
        .eq("id", noteId);
      if (error) throw error;
    } finally {
      setSaving(false);
    }
  }, 800);

  useEffect(() => {
    if (!editor) return;
    const handler = () => save(title, editor.getHTML());
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, title, save]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 py-2 border-b">
        <input
          value={title}
          onChange={(e) => {
            const v = e.target.value;
            setTitle(v);
            save(v, editor?.getHTML() ?? "");
          }}
          className="w-full bg-transparent text-lg font-medium focus:outline-none"
        />
        <div className="text-sm text-muted-foreground min-w-[90px] text-right">
          {saving ? "Сохранение..." : "Сохранено"}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
