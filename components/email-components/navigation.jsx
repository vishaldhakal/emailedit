"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
  }, [formData]);

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
    <div className="flex items-center h-full justify-center gap-5 bg-muted px-4 py-2 shadow-sm border-b w-full overflow-x-auto">
      <div>
        <Label>Navigation Items</Label>
        <div className="space-y-2 mt-2">
          {formData.items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
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
            + Add
          </Button>
        </div>
      </div>

      <Select
        value={formData.fontSize.replace("px", "")}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, fontSize: value + "px" }))
        }
      >
        <SelectTrigger className="w-[80px] h-8">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="14">14</SelectItem>
          <SelectItem value="16">16</SelectItem>
          <SelectItem value="18">18</SelectItem>
          <SelectItem value="24">24</SelectItem>
        </SelectContent>
      </Select>

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
  );
};
