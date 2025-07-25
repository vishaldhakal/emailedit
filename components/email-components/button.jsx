"use client";

import { useState, useEffect } from "react";
import { Button as UIButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ButtonComponent({ data }) {
  const { text, url, backgroundColor, color, padding, borderRadius } = data;

  return (
    <div className="text-center">
      <a
        href={url}
        style={{
          backgroundColor,
          color,
          padding,
          borderRadius: borderRadius || "4px",
          textDecoration: "none",
          display: "inline-block",
          fontSize: "16px",
          fontWeight: "500",
          border: "none",
          cursor: "pointer",
        }}
        className="hover:opacity-90 transition-opacity"
      >
        {text}
      </a>
    </div>
  );
}

ButtonComponent.Editor = function ButtonEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, onUpdate]);

  const paddingOptions = [
    { value: "8px 16px", label: "Small" },
    { value: "12px 24px", label: "Medium" },
    { value: "16px 32px", label: "Large" },
    { value: "20px 40px", label: "Extra Large" },
  ];

  const borderRadiusOptions = [
    { value: "0px", label: "None" },
    { value: "4px", label: "Small" },
    { value: "8px", label: "Medium" },
    { value: "16px", label: "Large" },
    { value: "24px", label: "Extra Large" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Button Text</Label>
        <Input
          id="text"
          value={formData.text}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, text: e.target.value }))
          }
          placeholder="Click Here"
        />
      </div>

      <div>
        <Label htmlFor="url">Button URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, url: e.target.value }))
          }
          placeholder="https://example.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={formData.backgroundColor}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                backgroundColor: e.target.value,
              }))
            }
          />
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
      </div>

      <div>
        <Label>Padding</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {paddingOptions.map((option) => (
            <UIButton
              key={option.value}
              variant={
                formData.padding === option.value ? "default" : "secondary"
              }
              size="sm"
              onClick={() =>
                setFormData((prev) => ({ ...prev, padding: option.value }))
              }
            >
              {option.label}
            </UIButton>
          ))}
        </div>
      </div>

      <div>
        <Label>Border Radius</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {borderRadiusOptions.map((option) => (
            <UIButton
              key={option.value}
              variant={
                formData.borderRadius === option.value ? "default" : "secondary"
              }
              size="sm"
              onClick={() =>
                setFormData((prev) => ({ ...prev, borderRadius: option.value }))
              }
            >
              {option.label}
            </UIButton>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <Label>Preview</Label>
        <div className="mt-2 text-center">
          <a
            href={formData.url}
            style={{
              backgroundColor: formData.backgroundColor,
              color: formData.color,
              padding: formData.padding,
              borderRadius: formData.borderRadius || "4px",
              textDecoration: "none",
              display: "inline-block",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            {formData.text}
          </a>
        </div>
      </div>
    </div>
  );
};
