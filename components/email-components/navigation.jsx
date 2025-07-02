"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Navigation({ data }) {
  const { items, alignment, fontSize, color } = data;

  return (
    <nav style={{ textAlign: alignment }}>
      <ul className="flex gap-6 justify-center list-none m-0 p-0">
        {items.map((item, index) => (
          <li key={index}>
            <a
              href={item.url}
              style={{
                fontSize,
                color,
                textDecoration: "none",
              }}
              className="hover:opacity-70 transition-opacity"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

Navigation.Editor = function NavigationEditor({ data, onUpdate, onCancel }) {
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
  ];

  const alignmentOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ];

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { text: "New Link", url: "#" }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Navigation Items</Label>
        <div className="space-y-2 mt-2">
          {formData.items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Text</Label>
                  <Input
                    value={item.text}
                    onChange={(e) => updateItem(index, "text", e.target.value)}
                    placeholder="Link text"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">URL</Label>
                  <Input
                    value={item.url}
                    onChange={(e) => updateItem(index, "url", e.target.value)}
                    placeholder="https://..."
                    className="text-xs"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
            className="w-full"
          >
            + Add Navigation Item
          </Button>
        </div>
      </div>

      <div>
        <Label>Font Size</Label>
        <div className="grid grid-cols-5 gap-2 mt-2">
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

      <div className="border rounded-lg p-4 bg-gray-50">
        <Label>Preview</Label>
        <div className="mt-2" style={{ textAlign: formData.alignment }}>
          <nav>
            <ul className="flex gap-6 justify-center list-none m-0 p-0">
              {formData.items.map((item, index) => (
                <li key={index}>
                  <span
                    style={{
                      fontSize: formData.fontSize,
                      color: formData.color,
                    }}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </nav>
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
