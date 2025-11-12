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

export const Spacer = memo(function Spacer({ data, onUpdate, isSelected }) {
  const { height } = data;

  return (
    <div className={`relative group`}>
      <div className="flex items-center justify-center py-1">
        <div
          style={{ height }}
          className="w-full bg-gray-100 border-2 border-dashed border-gray-200 rounded-md opacity-60 group-hover:opacity-100 transition-opacity"
        />
      </div>
      {/* Individual editor disabled - using unified toolbar */}
      {false && isSelected && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-40">
          <Spacer.Editor data={data} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
});

Spacer.Editor = function SpacerEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData]);

  return (
    <div className="flex items-center gap-2 bg-white px-3 py-2 h-12 rounded-lg shadow-lg border border-gray-100 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium text-gray-600">Height</Label>
        <Select
          value={formData.height}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, height: value }))
          }
        >
          <SelectTrigger className="w-20 h-8 text-xs border-gray-200">
            <SelectValue placeholder="H" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10px">10px</SelectItem>
            <SelectItem value="20px">20px</SelectItem>
            <SelectItem value="30px">30px</SelectItem>
            <SelectItem value="40px">40px</SelectItem>
            <SelectItem value="50px">50px</SelectItem>
            <SelectItem value="60px">60px</SelectItem>
            <SelectItem value="80px">80px</SelectItem>
            <SelectItem value="100px">100px</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
