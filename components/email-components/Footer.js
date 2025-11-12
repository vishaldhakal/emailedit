"use client";

import { memo, useEffect, useMemo, useState, useRef } from "react";
import { useFooterSettings } from "@/hooks/useCampaigns";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link as TipTapLink } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";

// Footer editor with minimal TipTap, small font, inline links
export const Footer = memo(function Footer({ data, onUpdate, isSelected }) {
  const { footerSettings, isLoading, updateFooterSettings, isUpdating } = useFooterSettings();

  // Prepare initial HTML: prefer saved custom_html, else data.html, else empty
  const initialHtml = useMemo(() => {
    const fromSettings = (footerSettings && footerSettings.custom_html) || "";
    const fromComponent = (data && (data.html || data.content)) || "";
    const html = fromSettings || fromComponent || "";
    return ensureUnsubPlaceholder(html);
  }, [footerSettings, data]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      TipTapLink.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Type your footer here...", emptyEditorClass: "is-editor-empty" }),
    ],
    content: initialHtml,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none",
        style: "font-size: 12px; color: #666666; line-height: 1.5;",
      },
    },
    onUpdate: ({ editor }) => {
      const html = ensureUnsubPlaceholder(editor.getHTML());
      // Stage updates for debounce (both backend save and canvas component update)
      setPendingHtml(html);
      setPendingComponentHtml(html);
    },
  });

  // Debounced backend save of custom_html
  const [pendingHtml, setPendingHtml] = useState("");
  useEffect(() => {
    if (!pendingHtml) return;
    const id = setTimeout(() => {
      updateFooterSettings({ custom_html: pendingHtml }).catch(() => {});
    }, 600);
    return () => clearTimeout(id);
  }, [pendingHtml, updateFooterSettings]);

  // Debounced component onUpdate to reduce re-renders while typing
  const [pendingComponentHtml, setPendingComponentHtml] = useState("");
  useEffect(() => {
    if (!pendingComponentHtml) return;
    const id = setTimeout(() => {
      if (onUpdate) {
        onUpdate({ ...(data || {}), html: pendingComponentHtml });
      }
    }, 400);
    return () => clearTimeout(id);
  }, [pendingComponentHtml, onUpdate, data]);

  // Ensure editor reflects updates from server once loaded
  useEffect(() => {
    if (!editor) return;
    const safe = ensureUnsubPlaceholder(initialHtml);
    if (editor.getHTML() !== safe) {
      editor.commands.setContent(safe, false);
    }
    // Also reflect into component JSON (non-debounced) only on initial sync
    if (onUpdate && !data?.html) onUpdate({ ...(data || {}), html: safe });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, initialHtml]);

  return (
    <div
      className={`relative group`}
      style={{ padding: isSelected ? "2px" : "0" }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        style={{
          marginTop: "24px",
          padding: "16px 16px",
          backgroundColor: "#ffffff",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <EditorContent
            editor={editor}
          style={{
              fontSize: "12px",
              color: "#666666",
              lineHeight: 1.5,
              textAlign: "center",
              minHeight: "40px",
            }}
          />
        </div>
      </div>
    </div>
  );
});

function ensureUnsubPlaceholder(html) {
  const content = (html || "").trim();
  if (!content) return '<p><em style="opacity:0.9">Add your footer content…</em></p><p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>';
  return content.includes("{{unsubscribe_url}}")
    ? content
    : content + '<p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>';
}
