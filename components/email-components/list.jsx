import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
      }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ["paragraph"] }),
    ],
    content: data.content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdate({ ...data, content: editor.getHTML() });
    },
  });
  return (
    <>
      <EditorContent
        className="prose h-full w-full [&>li>p]:m-0 list-disc list-inside marker:text-black marker:text-lg leading-none  focus:ring-0"
        editor={editor}
        style={{
          fontFamily: data.font,
          fontSize: data.fontSize,
        }}
      />
      {isSelected && (
        <List.Editor editor={editor} data={data} onUpdate={onUpdate} />
      )}
    </>
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
    <div
      className="flex items-center gap-3 bg-white px-3 py-2 h-12 
  shadow-lg rounded-md fixed top-[74px] left-1/2 -translate-x-1/2 
  z-50 border"
    >
      {/* Font Family */}
      <Select
        value={formData.font}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, font: value }))
        }
      >
        <SelectTrigger className="w-[140px] h-9 rounded-md">
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
        <SelectTrigger className="w-[80px] h-9 rounded-md">
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

      {/* text color  */}
      <div className="relative">
        {/* Hidden native input */}
        <input
          type="color"
          value={editor.getAttributes("textStyle")?.color}
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* A icon with underline */}
        <div className="flex flex-col items-center justify-center cursor-pointer">
          <span className="text-lg font-bold">A</span>
          <span
            className="w-5 h-1 rounded-sm -mt-1"
            style={{
              backgroundColor: editor.getAttributes("textStyle")?.color,
            }}
          ></span>
        </div>
      </div>

      {/* Lists */}
      <Button
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </Button>
      <Button
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </Button>
    </div>
  );
};
