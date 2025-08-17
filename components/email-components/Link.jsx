"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
export function Link({ data }) {
  const { text, url, color, underline, alignment } = data;

  return (
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
  );
}

Link.Editor = function LinkEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    const timer = setTimeout(() => onUpdate(formData), 500);
    return () => clearTimeout(timer);
  }, [formData]);

  return (
    <div className="flex items-center h-full justify-center gap-5 bg-muted px-4 py-2 shadow-sm border-b w-full overflow-x-auto">
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

      <div className="flex items-center gap-1">
        <Label htmlFor="color">Text Color</Label>
        <Input
          id="color"
          type="color"
          value={formData.color || "#007bff"}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, color: e.target.value }))
          }
          style={{ width: "40px", height: "30px", padding: 0 }}
        />
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
