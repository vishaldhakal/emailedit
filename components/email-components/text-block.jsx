"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Label } from "@/components/ui/label";

import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export function TextBlock({ data, onUpdate }) {
  const { content, fontSize, color, alignment, font, bold, italic, underline } =
    data;
  const ref = useRef(null);
  const debounceRef = useRef(null);
  //update ui on the basis of content prop
  useEffect(() => {
    if (ref.current && ref.current.textContent !== content) {
      ref.current.textContent = content;
    }
  }, [content]);
  const handleInput = () => {
    const newText = ref.current?.textContent || "";
    if (newText !== content) {
      // clear previous debounce timer
      if (debounceRef.current) clearTimeout(debounceRef.current);
      // debounce: wait 500ms after last input before updating
      debounceRef.current = setTimeout(() => {
        onUpdate({ ...data, content: newText });
      }, 500);
    }
  };

  return (
    <div
      ref={ref}
      className=" pl-2 pb-1 w-full border-none outline-none"
      onInput={handleInput}
      style={{
        fontSize,
        color,
        fontFamily: font,
        textAlign: alignment,
        fontWeight: bold ? "bold" : "normal",
        fontStyle: italic ? "italic" : "normal",
        textDecoration: underline ? "underline" : "none",
      }}
      contentEditable
      suppressContentEditableWarning
    />
  );
}

TextBlock.Editor = function TextBlockEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState({
    fontSize: data.fontSize,
    color: data.color,
    alignment: data.alignment,
    font: data.font,
    bold: data.bold || false,
    italic: data.italic || false,
    underline: data.underline || false,
  });

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate({ content: data.content, ...formData });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, data.content]);

  return (
    <div className="flex items-center h-full justify-center gap-3 bg-muted px-4 py-2 shadow-sm border-b w-full overflow-x-auto">
      {/* Font Family */}
      <Select
        value={formData.font}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, font: value }))
        }
      >
        <SelectTrigger className="w-[140px] h-8">
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
        <SelectTrigger className="w-[80px] h-8">
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
          variant={formData.bold ? "default" : "ghost"}
          onClick={() => setFormData((prev) => ({ ...prev, bold: !prev.bold }))}
          size="icon"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant={formData.italic ? "default" : "ghost"}
          size="icon"
          onClick={() =>
            setFormData((prev) => ({ ...prev, italic: !prev.italic }))
          }
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant={formData.underline ? "default" : "ghost"}
          size="icon"
          onClick={() =>
            setFormData((prev) => ({ ...prev, underline: !prev.underline }))
          }
        >
          <Underline className="w-4 h-4" />
        </Button>
      </div>

      {/* Alignment Buttons */}
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
              onClick={() =>
                setFormData((prev) => ({ ...prev, alignment: align }))
              }
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Label>Color</Label>
        <input
          type="color"
          value={formData.color}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              color: e.target.value,
            }))
          }
          className="w-6 h-6 p-0 border-none"
        />
      </div>
    </div>
  );
};
