"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";

export function TextBlock({ data, onUpdate }) {
  const { content, fontSize, color, alignment } = data;
  const ref = useRef(null);

  // update ui on the basis of content prop
  useEffect(() => {
    if (ref.current && ref.current.textContent !== content) {
      ref.current.textContent = content;
    }
  }, [content]);

  const handleInput = () => {
    const newText = ref.current?.textContent || "";
    if (newText !== content) {
      onUpdate({ ...data, content: newText });
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
        textAlign: alignment,
      }}
      contentEditable
      suppressContentEditableWarning
    />
  );
}

TextBlock.Editor = function TextBlockEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const fontSizeOptions = [
    { value: "12px", label: "12px" },
    { value: "14px", label: "14px" },
    { value: "16px", label: "16px" },
    { value: "18px", label: "18px" },
    { value: "20px", label: "20px" },
    { value: "24px", label: "24px" },
  ];

  const alignmentOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
    { value: "justify", label: "Justify" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label>Font Size</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {fontSizeOptions.map((option) => (
            <Button
              key={option.value}
              variant={
                formData.fontSize === option.value ? "default" : "secondary"
              }
              size="sm"
              onClick={() =>
                setFormData((prev) => ({ ...prev, fontSize: option.value }))
              }
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="color">Text Color</Label>
        <Input
          id="color"
          type="color"
          value={formData.color}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, color: e.target.value }))
          }
        />
      </div>

      <div>
        <Label>Alignment</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {alignmentOptions.map((option) => (
            <Button
              key={option.value}
              variant={
                formData.alignment === option.value ? "default" : "outline"
              }
              size="sm"
              onClick={() =>
                setFormData((prev) => ({ ...prev, alignment: option.value }))
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
