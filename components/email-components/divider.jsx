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
  }, [formData]);

  return (
    <div className="flex items-center h-full justify-center gap-5 bg-muted px-4 py-2 shadow-sm border-b w-full overflow-x-auto">
      <div className="flex items-center gap-1">
        <Label>Line Style</Label>
        <Select
          value={formData.style}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, style: value }))
          }
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="line style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Label>Line Height</Label>
        <Select
          value={formData.height}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, height: value }))
          }
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="line height" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1px">Thin</SelectItem>
            <SelectItem value="2px">Medium</SelectItem>
            <SelectItem value="3px">Thick</SelectItem>
            <SelectItem value="4px">Extra Thick</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
