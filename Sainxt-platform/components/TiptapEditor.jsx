"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";

export default function TiptapEditor({ value, onChange }) {
  const isInitial = useRef(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "", // Don't pass `value` here
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    autofocus: true,
    editable: true,
    immediatelyRender: false,
  });

  // Set initial content once after mount
  useEffect(() => {
    if (editor && isInitial.current && value) {
      editor.commands.setContent(value, false); // false = don't trigger onUpdate
      isInitial.current = false;
    }
  }, [editor, value]);

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
