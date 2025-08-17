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

  return (
    <div className="flex items-center h-full justify-center gap-3 bg-muted px-4 py-2 shadow-sm border-b w-full overflow-x-auto">
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
