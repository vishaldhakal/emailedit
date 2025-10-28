"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FaPaintbrush } from "react-icons/fa6";
export function ButtonComponent({ data, onUpdate, isSelected }) {
  const { text, url, backgroundColor, color, padding, borderRadius } = data;

  return (
    <div className="relative group">
      <div className="text-center">
        <a
          target="_blank"
          href={url?.trim() || undefined}
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
      {isSelected && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
          <ButtonComponent.Editor data={data} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

ButtonComponent.Editor = function ButtonEditor({ data, onUpdate }) {
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
          <Label htmlFor="text" className="text-xs font-medium text-gray-600">
            Label
          </Label>
          <Input
            id="text"
            className="w-28 h-7 text-xs border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
            value={formData.text}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder="Button"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="url" className="text-xs font-medium text-gray-600">
            Link
          </Label>
          <Input
            className="w-48 h-7 text-xs border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
            id="url"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder="https://example.com/link"
          />
        </div>
      </div>

      {/* Second Line */}
      <div className="flex items-center gap-2">
        {/* Text Color */}
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
            <span className="text-xs font-bold text-gray-700">A</span>
            <span
              className="w-3 h-0.5 rounded-sm -mt-0.5 border border-gray-300"
              style={{ backgroundColor: formData.color }}
            ></span>
          </div>
        </div>

        {/* Background Color */}
        <div className="flex flex-col items-center justify-center relative">
          <input
            type="color"
            value={formData.backgroundColor}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                backgroundColor: e.target.value,
              }))
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-md"
          />
          <div className="p-1 rounded-md hover:bg-gray-50 transition-colors">
            <FaPaintbrush className="w-3 h-3 text-gray-700" />
            <div
              className="w-3 h-0.5 rounded-sm mt-0.5 border border-gray-300"
              style={{ backgroundColor: formData.backgroundColor }}
            />
          </div>
        </div>

        {/* Padding */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-gray-600">Padding</Label>
          <Select
            value={formData.padding}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, padding: value }))
            }
          >
            <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
              <SelectValue placeholder="P" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8px 16px">Small</SelectItem>
              <SelectItem value="12px 24px">Medium</SelectItem>
              <SelectItem value="16px 32px">Large</SelectItem>
              <SelectItem value="20px 40px">XL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Border Radius */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-gray-600">Radius</Label>
          <Select
            value={formData.borderRadius}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, borderRadius: value }))
            }
          >
            <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
              <SelectValue placeholder="R" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0px">None</SelectItem>
              <SelectItem value="4px">Small</SelectItem>
              <SelectItem value="8px">Medium</SelectItem>
              <SelectItem value="16px">Large</SelectItem>
              <SelectItem value="24px">XL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
