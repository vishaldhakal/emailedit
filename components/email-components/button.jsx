"use client";

import { useState, useEffect } from "react";
import { Button as UIButton } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  }, [formData]);

  return (
    <div className="flex items-center h-full justify-center gap-4 bg-muted px-4 py-2 shadow-sm border-b w-full overflow-x-auto">
      <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <div className="relative w-6 h-6">
          <label className="w-full h-full cursor-pointer inline-flex items-center justify-center">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, color: e.target.value }))
              }
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="color">Text Color</Label>
        <div className="relative w-6 h-6">
          <label className="w-full h-full cursor-pointer inline-flex items-center justify-center">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, color: e.target.value }))
              }
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="columnWidth">Padding</Label>
        <Select
          value={formData.padding}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, padding: value }))
          }
        >
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue placeholder="padding" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8px 16px">Small</SelectItem>
            <SelectItem value="12px 24px">Medium</SelectItem>
            <SelectItem value="16px 32px">Large</SelectItem>
            <SelectItem value="20px 40px">XL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="columnWidth">Border Radius</Label>
        <Select
          value={formData.borderRadius}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, borderRadius: value }))
          }
        >
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue placeholder="border radius" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0px">None</SelectItem>
            <SelectItem value="4px">Small</SelectItem>
            <SelectItem value="8px">Medium</SelectItem>
            <SelectItem value="16px"> Large</SelectItem>
            <SelectItem value="24px">XL</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
