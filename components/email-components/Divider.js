"use client";

import { useState, useEffect, memo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const Divider = memo(function Divider({ data, onUpdate, isSelected }) {
  const { style, color, height } = data;

  return (
    <div className={`relative group`}>
      <div className="py-1">
        <hr
          style={{
            border: "none",
            borderTop: `${height} ${style} ${color}`,
            margin: 0,
          }}
          className="opacity-60 group-hover:opacity-100 transition-opacity"
        />
      </div>
      {/* Individual editor disabled - using unified toolbar */}
      {false && isSelected && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
          <Divider.Editor data={data} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
});

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
    <div className="bg-white px-3 py-2 max-w-2xl rounded-lg shadow-lg border border-gray-100 backdrop-blur-sm">
      {/* First Line */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-gray-600">Style</Label>
          <Select
            value={formData.style}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, style: value }))
            }
          >
            <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-gray-600">Width</Label>
          <Select
            value={formData.height}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, height: value }))
            }
          >
            <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
              <SelectValue placeholder="Width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1px">Thin</SelectItem>
              <SelectItem value="2px">Medium</SelectItem>
              <SelectItem value="3px">Thick</SelectItem>
              <SelectItem value="4px">Extra Thick</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Second Line */}
      <div className="flex items-center gap-2">
        {/* Color Picker */}
        <div className="relative">
          <input
            type="color"
            value={formData.color}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                color: e.target.value,
              }))
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-md"
          />
          <div className="flex flex-col items-center justify-center cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors">
            <div
              className="w-3 h-3 border border-gray-300 rounded-sm"
              style={{ backgroundColor: formData.color }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
