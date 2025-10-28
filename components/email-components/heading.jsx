"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { FaPaintbrush } from "react-icons/fa6";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function Heading({ data, onUpdate, isSelected }) {
  const {
    content,
    level,
    backgroundColor,
    color,
    alignment,
    font,
    bold,
    italic,
    underline,
    letterSpacing,
    lineHeight,
  } = data;
  const Tag = level || "h3";
  const ref = useRef(null);
  const debounceRef = useRef(null);

  //update ui on the basis of content prop and level
  useEffect(() => {
    if (ref.current && ref.current.textContent !== content) {
      ref.current.textContent = content;
    }
  }, [content, level]);

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
    <div className="relative group">
      <Tag
        className=" border-none outline-none pl-1"
        ref={ref}
        key={level}
        onInput={handleInput}
        style={{
          color,
          backgroundColor,
          textAlign: alignment,
          letterSpacing,
          lineHeight,
          fontFamily: font,
          fontWeight: bold ? "bold" : "normal",
          fontStyle: italic ? "italic" : "normal",
          textDecoration: underline ? "underline" : "none",
        }}
        contentEditable
        suppressContentEditableWarning
      />
      {isSelected && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
          <Heading.Editor data={data} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

Heading.Editor = function HeadingEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState({
    backgroundColor: data.backgroundColor,
    level: data.level,
    color: data.color,
    alignment: data.alignment,
    font: data.font,
    bold: data.bold || false,
    italic: data.italic || false,
    underline: data.underline || false,
    letterSpacing: data.letterSpacing || "0px",
    lineHeight: data.lineHeight || "1.5",
  });

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate({ content: data.content, ...formData });
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, data.content]);

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
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
            <SelectItem value="Palatino">Palatino</SelectItem>
          </SelectContent>
        </Select>

        {/* Level*/}
        <Select
          value={formData.level}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, level: value }))
          }
        >
          <SelectTrigger className="w-[45px] h-7 text-xs border-gray-200">
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

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200" />

        {/* Formatting */}
        <div className="flex items-center gap-0.5">
          <Button
            variant={formData.bold ? "default" : "ghost"}
            onClick={() =>
              setFormData((prev) => ({ ...prev, bold: !prev.bold }))
            }
            size="icon"
            className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Bold className="w-3 h-3" />
          </Button>
          <Button
            variant={formData.italic ? "default" : "ghost"}
            size="icon"
            onClick={() =>
              setFormData((prev) => ({ ...prev, italic: !prev.italic }))
            }
            className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Italic className="w-3 h-3" />
          </Button>
          <Button
            variant={formData.underline ? "default" : "ghost"}
            size="icon"
            onClick={() =>
              setFormData((prev) => ({ ...prev, underline: !prev.underline }))
            }
            className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Underline className="w-3 h-3" />
          </Button>
        </div>

        {/* Letter + Line Spacing */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Move className="w-3.5 h-3.5" />
            </Button>
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
      </div>
      {/* Second Line */}
      <div className="flex items-center gap-2">
        {/* Text Color */}
        <div className="relative group">
          <input
            type="color"
            value={formData.color || "#000000"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                color: e.target.value,
              }))
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-lg"
          />
          <div className="flex flex-col items-center justify-center cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors">
            <span className="text-xs font-bold text-gray-700">A</span>
            <span
              className="w-3 h-0.5 rounded-sm -mt-0.5 border border-gray-300"
              style={{ backgroundColor: formData.color || "#000000" }}
            ></span>
          </div>
        </div>

        {/* Background Color */}
        <div className="flex flex-col items-center justify-center relative group">
          <input
            type="color"
            value={formData.backgroundColor}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                backgroundColor: e.target.value,
              }))
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-lg"
          />
          <div className="p-1 rounded-md hover:bg-gray-50 transition-colors">
            <FaPaintbrush className="w-3 h-3 text-gray-700" />
            <div
              className="w-3 h-0.5 rounded-sm mt-0.5 border border-gray-300"
              style={{ backgroundColor: formData.backgroundColor }}
            />
          </div>
        </div>

        {/* Alignment Buttons */}
        <div className="flex items-center gap-0.5">
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
                className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Icon className="w-3 h-3" />
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
