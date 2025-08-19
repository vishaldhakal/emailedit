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
export function Spacer({ data, onUpdate, isSelected }) {
  const { height } = data;

  return (
    <>
      <div style={{ height }} />
      {isSelected && <Spacer.Editor data={data} onUpdate={onUpdate} />}
    </>
  );
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

  return (
    <div
      className="flex items-center gap-3 bg-white px-3 py-2 h-12 
  shadow-lg rounded-md fixed top-[74px] left-1/2 -translate-x-1/2 
  z-50 border"
    >
      <div className="flex items-center gap-2">
        <Label>Spacing Height</Label>
        <Select
          value={formData.height}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, height: value }))
          }
        >
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue placeholder="height" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10px">10px</SelectItem>
            <SelectItem value="20px">20px</SelectItem>
            <SelectItem value="30px">30px</SelectItem>
            <SelectItem value="40px">40px</SelectItem>
            <SelectItem value="50px">50px</SelectItem>
            <SelectItem value="60px">60px</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
