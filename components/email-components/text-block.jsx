"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Label } from "@/components/ui/label";
import { FaPaintbrush } from "react-icons/fa6";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
  Strikethrough,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export function TextBlock({ data, onUpdate, isSelected }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
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
        editor={editor}
        style={{
          fontFamily: data.font,
          fontSize: data.fontSize,
          backgroundColor: data.backgroundColor,
          textAlign: data.alignment,
          letterSpacing: data.letterSpacing,
          lineHeight: data.lineHeight,
        }}
      />
      {isSelected && (
        <TextBlock.Editor editor={editor} data={data} onUpdate={onUpdate} />
      )}
    </>
  );
}

TextBlock.Editor = function TextBlockEditor({ data, onUpdate, editor }) {
  if (!editor) return null;

  const [formData, setFormData] = useState({
    font: data.font,
    fontSize: data.fontSize,
    backgroundColor: data.backgroundColor,
    alignment: data.alignment,
    letterSpacing: data.letterSpacing,
    lineHeight: data.lineHeight,
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

      {/* Formatting */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive("bold") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          size="icon"
          className="h-9 w-9"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-9 w-9"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive("underline") ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-9 w-9"
        >
          <Underline className="w-4 h-4" />
        </Button>
      </div>

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

      {/* backgroundColor */}
      <div className="flex flex-col items-center justify-center relative">
        {/* Hidden color input */}
        <input
          type="color"
          value={formData.backgroundColor}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              backgroundColor: e.target.value,
            }))
          }
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Paint brush icon */}
        <FaPaintbrush className="w-4 h-4 text-black" />

        {/* Horizontal color line */}
        <div
          className="w-5 h-1 rounded-sm mt-0.5"
          style={{ backgroundColor: formData.backgroundColor }}
        />
      </div>

      {/* Letter + Line Spacing */}
      <Popover>
        <PopoverTrigger asChild>
          <Move className="w-4 h-4" />
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-4 space-y-4">
          {/* Letter Spacing */}
          <div>
            <Label>Letter Spacing</Label>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={formData.letterSpacing}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  letterSpacing: parseFloat(e.target.value),
                }))
              }
              className="w-full"
            />
            <div className="text-xs text-right">
              {(Number(formData.letterSpacing) || 0).toFixed(1)}px
            </div>
          </div>

          {/* Line Height */}
          <div>
            <Label>Line Height</Label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={formData.lineHeight}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lineHeight: parseFloat(e.target.value),
                }))
              }
              className="w-full"
            />
            <div className="text-xs text-right">
              {(Number(formData.lineHeight) || 1.5).toFixed(2)}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant={editor.isActive("strike") ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      {/* Alignment */}
      <div className="flex items-center gap-1 border-l pl-2 ml-2">
        {["left", "center", "right"].map((align) => {
          const Icon =
            align === "left"
              ? AlignLeft
              : align === "center"
              ? AlignCenter
              : AlignRight;
          return (
            <Button
              key={align}
              variant={formData.alignment === align ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9"
              onClick={() =>
                setFormData((prev) => ({ ...prev, alignment: align }))
              }
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};
