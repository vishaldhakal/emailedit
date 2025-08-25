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
    <>
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
      {isSelected && <ButtonComponent.Editor data={data} onUpdate={onUpdate} />}
    </>
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
    <div
      className="flex items-center gap-3 bg-white px-3 py-2 h-12 
  shadow-lg rounded-md fixed top-[74px] left-1/2 -translate-x-1/2 
  z-50 border"
    >
      <div className="flex items-center gap-2">
        <Label htmlFor="text">Button Text</Label>
        <Input
          id="text"
          className="w-28"
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
          className="w-52"
          id="url"
          value={formData.url}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, url: e.target.value }))
          }
          placeholder="https://example.com"
        />
      </div>

      {/* text color  */}
      <div className="relative">
        {/* Hidden native input */}
        <input
          type="color"
          value={formData.color}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              color: e.target.value,
            }))
          }
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* A icon with underline */}
        <div className="flex flex-col items-center justify-center cursor-pointer">
          <span className="text-lg font-bold">A</span>
          <span
            className="w-5 h-1 rounded-sm -mt-1"
            style={{ backgroundColor: formData.color }}
          ></span>
        </div>
      </div>

      {/* backgroundColor */}
      <div className="flex flex-col items-center justify-center relative">
        {/* Hidden color input */}
        <input
          type="color"
          value={formData.backgroundColor}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              backgroundColor: e.target.value,
            }))
          }
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Paint brush icon */}
        <FaPaintbrush className="w-5 h-5 text-black" />

        {/* Horizontal color line */}
        <div
          className="w-5 h-1 rounded-sm mt-0.5"
          style={{ backgroundColor: formData.backgroundColor }}
        />
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
