"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TextBlock({ data, onUpdate }) {
  const { content, fontSize, color, alignment } = data;
  const [text, setText] = useState(content);

  //whenever content prop changes we need to update our local state
  useEffect(() => {
    setText(content);
  }, [content]);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate({ ...data, content: text });
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <Textarea
      className="min-h-0 h-7 p-1 w-full border-none shadow-none outline-none focus-visible:ring-0 resize-none"
      placeholder="Enter your text here..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      style={{
        fontSize,
        color,
        textAlign: alignment,
      }}
    />
  );
}

TextBlock.Editor = function TextBlockEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, onUpdate]);

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
        <Label htmlFor="content">Text Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Enter your text here..."
          rows={4}
        />
      </div>

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

      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel}>
          Close
        </Button>
      </div>
    </div>
  );
};
