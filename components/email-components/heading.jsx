"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";

export function Heading({ data, onUpdate }) {
  const { content, level, color, alignment } = data;
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
    <div
      className=" border-none outline-none pl-1"
      ref={ref}
      key={level}
      onInput={handleInput}
      style={{
        color,
        textAlign: alignment,
        margin: 0,
      }}
      contentEditable
      suppressContentEditableWarning
    />
  );
}

Heading.Editor = function HeadingEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const levelOptions = [
    { value: "h1", label: "H1" },
    { value: "h2", label: "H2" },
    { value: "h3", label: "H3" },
    { value: "h4", label: "H4" },
    { value: "h5", label: "H5" },
    { value: "h6", label: "H6" },
  ];

  const alignmentOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label>Heading Level</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {levelOptions.map((option) => (
            <Button
              key={option.value}
              variant={
                formData.level === option.value ? "default" : "secondary"
              }
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
    </div>
  );
};
