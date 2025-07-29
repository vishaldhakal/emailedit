"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function Spacer({ data }) {
  const { height } = data;

  return <div style={{ height }} />;
}

Spacer.Editor = function SpacerEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData]);

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
              variant={
                formData.height === option.value ? "default" : "secondary"
              }
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
    </div>
  );
};
