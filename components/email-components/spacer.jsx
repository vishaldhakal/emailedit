"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function Spacer({ data }) {
  const { height } = data;

  return <div style={{ height }} />;
}

Spacer.Editor = function SpacerEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, onUpdate]);

  const heightOptions = [
    { value: "10px", label: "10px" },
    { value: "20px", label: "20px" },
    { value: "30px", label: "30px" },
    { value: "40px", label: "40px" },
    { value: "50px", label: "50px" },
    { value: "60px", label: "60px" },
    { value: "80px", label: "80px" },
    { value: "100px", label: "100px" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label>Spacing Height</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {heightOptions.map((option) => (
            <Button
              key={option.value}
              variant={formData.height === option.value ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setFormData((prev) => ({ ...prev, height: option.value }))
              }
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <Label>Preview</Label>
        <div className="mt-2">
          <div
            style={{
              height: formData.height,
              backgroundColor: "#e5e7eb",
              border: "1px dashed #9ca3af",
            }}
            className="flex items-center justify-center text-gray-500 text-xs"
          >
            {formData.height} spacing
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
