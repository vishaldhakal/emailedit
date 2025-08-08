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

export function Heading({ data, onUpdate }) {
  const { content, level, color, alignment, font, bold, italic, underline } =
    data;
  const Tag = level || "h3";
  const ref = useRef(null);

  //update ui on the basis of content prop and level
  useEffect(() => {
    if (ref.current && ref.current.textContent !== content) {
      ref.current.textContent = content;
    }
  }, [content, level]);

  const handleInput = () => {
    const newText = ref.current?.textContent || "";
    if (newText !== content) {
      onUpdate({ ...data, content: newText });
    }
  };

  return (
    <Tag
      className=" border-none outline-none pl-1"
      ref={ref}
      key={level}
      onInput={handleInput}
      style={{
        color,
        textAlign: alignment,
        fontFamily: font,
        fontWeight: bold ? "bold" : "normal",
        fontStyle: italic ? "italic" : "normal",
        textDecoration: underline ? "underline" : "none",
      }}
      contentEditable
      suppressContentEditableWarning
    />
  );
}

Heading.Editor = function HeadingEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState({
    level: data.level,
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
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, data.content]);

  return (
    <div className="flex items-center h-full justify-center gap-5 bg-muted px-4 py-2 shadow-sm border-b w-full overflow-x-auto">
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

      {/* Level*/}
      <Select
        value={formData.level}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, level: value }))
        }
      >
        <SelectTrigger className="w-[80px] h-8">
          <SelectValue placeholder="level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="h1">H1</SelectItem>
          <SelectItem value="h2">H2</SelectItem>
          <SelectItem value="h3">H3</SelectItem>
          <SelectItem value="h4">H4</SelectItem>
          <SelectItem value="h5">H5</SelectItem>
          <SelectItem value="h6">H6</SelectItem>
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
