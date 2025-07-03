"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Divider({ data }) {
  const { style, color, height } = data;

  return (
    <hr
      style={{
        border: "none",
        borderTop: `${height} ${style} ${color}`,
        margin: 0,
      }}
    />
  );
}

Divider.Editor = function DividerEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, onUpdate]);

  const styleOptions = [
    { value: "solid", label: "Solid" },
    { value: "dashed", label: "Dashed" },
    { value: "dotted", label: "Dotted" },
  ];

  const heightOptions = [
    { value: "1px", label: "Thin" },
    { value: "2px", label: "Medium" },
    { value: "3px", label: "Thick" },
    { value: "4px", label: "Extra Thick" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label>Line Style</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {styleOptions.map((option) => (
            <Button
              key={option.value}
              variant={formData.style === option.value ? "default" : "secondary"}
              size="sm"
              onClick={() =>
                setFormData((prev) => ({ ...prev, style: option.value }))
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Line Height</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {heightOptions.map((option) => (
            <Button
              key={option.value}
              variant={formData.height === option.value ? "default" : "secondary"}
              size="sm"
              onClick={() =>
                setFormData((prev) => ({ ...prev, height: option.value }))
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="color">Line Color</Label>
        <Input
          id="color"
          type="color"
          value={formData.color}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, color: e.target.value }))
          }
        />
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <Label>Preview</Label>
        <div className="mt-2">
          <hr
            style={{
              border: "none",
              borderTop: `${formData.height} ${formData.style} ${formData.color}`,
              margin: 0,
            }}
          />
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
