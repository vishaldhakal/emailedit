"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
export function Link({ data, onUpdate, isSelected }) {
  const { text, url, color, underline, alignment } = data;

  return (
    <>
      <div style={{ textAlign: alignment }}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textAlign: alignment,
            color: color || "#007bff",
            textDecoration: underline ? "underline" : "none",
            cursor: "pointer",
            fontWeight: "500",
            display: "inline-block",
          }}
        >
          {text || "Click here"}
        </a>
      </div>
      {isSelected && <Link.Editor data={data} onUpdate={onUpdate} />}
    </>
  );
}

Link.Editor = function LinkEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    const timer = setTimeout(() => onUpdate(formData), 500);
    return () => clearTimeout(timer);
  }, [formData]);

  return (
    <div
      className="flex items-center gap-3 bg-white px-3 py-2 h-12 
  shadow-lg rounded-md fixed top-[74px] left-1/2 -translate-x-1/2 
  z-50 border"
    >
      <div className="flex items-center gap-1">
        <Label htmlFor="text">Link Text</Label>
        <Input
          id="text"
          value={formData.text}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, text: e.target.value }))
          }
          placeholder="Click here"
        />
      </div>

      <div className="flex items-center gap-1">
        <Label htmlFor="url">URL</Label>
        <Input
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

      <Button
        variant={formData.underline ? "default" : "ghost"}
        size="icon"
        onClick={() =>
          setFormData((prev) => ({ ...prev, underline: !prev.underline }))
        }
      >
        <Underline className="w-4 h-4" />
      </Button>
      {/* Alignment Buttons */}
      <div className="flex items-center gap-1 border-l pl-2 ml-2">
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
              onClick={() =>
                setFormData((prev) => ({ ...prev, alignment: align }))
              }
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};
