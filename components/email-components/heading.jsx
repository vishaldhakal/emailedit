"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Heading({ data }) {
  const { content, level, fontSize, color, alignment } = data;

  const Tag = level || "h1";

  return (
    <Tag
      style={{
        fontSize,
        color,
        textAlign: alignment,
        margin: 0,
      }}
    >
      {content}
    </Tag>
  );
}

Heading.Editor = function HeadingEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, onUpdate]);

  const levelOptions = [
    { value: "h1", label: "H1" },
    { value: "h2", label: "H2" },
    { value: "h3", label: "H3" },
    { value: "h4", label: "H4" },
    { value: "h5", label: "H5" },
    { value: "h6", label: "H6" },
  ];

  const fontSizeOptions = [
    { value: "20px", label: "20px" },
    { value: "24px", label: "24px" },
    { value: "28px", label: "28px" },
    { value: "32px", label: "32px" },
    { value: "36px", label: "36px" },
    { value: "40px", label: "40px" },
  ];

  const alignmentOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content">Heading Text</Label>
        <Input
          id="content"
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Enter heading text..."
        />
      </div>

      <div>
        <Label>Heading Level</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {levelOptions.map((option) => (
            <Button
              key={option.value}
              variant={formData.level === option.value ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setFormData((prev) => ({ ...prev, level: option.value }))
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Font Size</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {fontSizeOptions.map((option) => (
            <Button
              key={option.value}
              variant={
                formData.fontSize === option.value ? "default" : "outline"
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

      <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 gap-2 mt-2">
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

      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel}>
          Close
        </Button>
      </div>
    </div>
  );
};
