import React from "react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { List as ListIcon, ListOrdered } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Move } from "lucide-react";

export function List({ data, onUpdate, isSelected }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        dropcursor: false,
        gapcursor: false,
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-6",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-6",
          },
        },
      }),
      TextStyle,
      Color,
      // TextAlign.configure({ types: ["paragraph"] }),
    ],
    content: data.content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdate({ ...data, content: editor.getHTML() });
    },
  });
  return (
    <div className={`relative group`}>
      <div className="min-h-[1.5rem] hover:bg-gray-50/30 transition-colors duration-200 rounded-sm">
        <EditorContent
          editor={editor}
          style={{
            fontFamily: data.font,
            fontSize: data.fontSize,
            color: data.color || "#000000",
            minHeight: "1.5rem",
            padding: "0.25rem 0",
          }}
          className="focus-within:bg-blue-50/20 transition-colors duration-200"
        />
      </div>
      {/* Individual editor disabled - using unified toolbar */}
      {false && isSelected && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
          <List.Editor data={data} onUpdate={onUpdate} editor={editor} />
        </div>
      )}
    </div>
  );
}

List.Editor = function ListEditor({ data, onUpdate, editor }) {
  if (!editor) return null;
  const [formData, setFormData] = useState({
    font: data.font,
    fontSize: data.fontSize,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate({ ...data, content: editor.getHTML(), ...formData });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, editor?.getHTML()]);
  return (
    <div className="bg-white px-3 py-2 max-w-2xl rounded-lg shadow-lg border border-gray-100 backdrop-blur-sm">
      {/* First Line */}
      <div className="flex items-center gap-2 mb-2">
        {/* Font Family */}
        <Select
          value={formData.font}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, font: value }))
          }
        >
          <SelectTrigger className="w-[100px] h-7 text-xs border-gray-200">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
          </SelectContent>
        </Select>

        {/* Font Size */}
        <Select
          value={formData.fontSize.replace("px", "")}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, fontSize: value + "px" }))
          }
        >
          <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="14">14</SelectItem>
            <SelectItem value="16">16</SelectItem>
            <SelectItem value="18">18</SelectItem>
            <SelectItem value="24">24</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Second Line */}
      <div className="flex items-center gap-2">
        {/* Text Color */}
        <div className="relative">
          <input
            type="color"
            value={editor.getAttributes("textStyle")?.color}
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors">
            <span className="text-xs font-bold text-gray-700">A</span>
            <span
              className="w-3 h-0.5 rounded-sm -mt-0.5 border border-gray-300"
              style={{
                backgroundColor:
                  editor.getAttributes("textStyle")?.color || "#000000",
              }}
            ></span>
          </div>
        </div>
      </div>

      {/* Lists */}
      <Button
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon className="w-3.5 h-3.5" />
      </Button>
      <Button
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};
