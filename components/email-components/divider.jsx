"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
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

Divider.Editor = function DividerEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData]);

  return (
    <div className="flex items-center justify-start gap-5 px-2 py-2 w-full overflow-x-auto text-black">
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

      <div className="flex items-center gap-2">
        <Label>Color</Label>
        <input
          type="color"
          value={formData.color}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              color: e.target.value,
            }))
          }
          className="w-6 h-6 p-0 border-none"
        />
      </div>
    </div>
  );
};
