"use client";

import React, { memo } from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export const Link = memo(function Link({ data, onUpdate, isSelected }) {
  const { text, url, color, underline, alignment } = data;

  return (
    <div className={`relative group`}>
      <div
        className={`min-h-[1.5rem] hover:bg-gray-50/30 transition-colors duration-200 rounded-sm ${
          alignment === "center"
            ? "flex justify-center items-center"
            : alignment === "right"
            ? "flex justify-end items-center"
            : "flex justify-start items-center"
        }`}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: color || "#000000",
            textDecoration: underline ? "underline" : "none",
            cursor: "pointer",
            fontWeight: "500",
            display: "inline-block",
            padding: "0.25rem 0",
          }}
          className="hover:opacity-80 transition-all duration-200 focus-within:bg-blue-50/20"
        >
          {text || "Click here"}
        </a>
      </div>
      {/* Individual editor disabled - using unified toolbar */}
      {false && isSelected && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
          <Link.Editor data={data} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
});

Link.Editor = function LinkEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    const timer = setTimeout(() => onUpdate(formData), 500);
    return () => clearTimeout(timer);
  }, [formData]);

  return (
    <div className="bg-white px-3 py-2 max-w-2xl rounded-lg shadow-lg border border-gray-100 backdrop-blur-sm">
      {/* First Line */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="text" className="text-xs font-medium text-gray-600">
            Text
          </Label>
          <Input
            id="text"
            className="h-7 w-28 text-xs border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
            value={formData.text}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder="Click here"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="url" className="text-xs font-medium text-gray-600">
            URL
          </Label>
          <Input
            id="url"
            className="h-7 w-48 text-xs border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder="https://example.com"
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

        {/* Underline Toggle */}
        <Button
          variant={formData.underline ? "default" : "ghost"}
          size="icon"
          className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          onClick={() =>
            setFormData((prev) => ({ ...prev, underline: !prev.underline }))
          }
        >
          <Underline className="w-3 h-3" />
        </Button>

        {/* Alignment Buttons */}
        <div className="flex items-center gap-0.5">
          {["left", "center", "right"].map((align) => {
            const Icon =
              align === "left"
                ? AlignLeft
                : align === "center"
                ? AlignCenter
                : AlignRight;
            return (
              <Button
                key={align}
                variant={formData.alignment === align ? "default" : "ghost"}
                size="icon"
                className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, alignment: align }))
                }
              >
                <Icon className="w-3 h-3" />
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
