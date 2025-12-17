"use client";

import { useState, useEffect, memo } from "react";
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

export const ButtonComponent = memo(function ButtonComponent({
  data,
  onUpdate,
  isSelected,
}) {
  const {
    text = "Click Here",
    url = "",
    backgroundColor = "#000000",
    color = "#ffffff",
    padding = "12px 24px",
    borderRadius = "4px",
    borderWidth = "0px",
    borderColor = "#000000",
    borderStyle = "solid",
    align = "center",
  } = data;

  // Build border style string
  const borderStyleString =
    borderWidth && borderWidth !== "0px" && borderWidth !== "0"
      ? `${borderWidth} ${borderStyle || "solid"} ${borderColor || "#000000"}`
      : "none";

  const containerTextAlign =
    align === "left" ? "left" : align === "right" ? "right" : "center";

  return (
    <div className={`relative group`}>
      <div style={{ textAlign: containerTextAlign }}>
        <a
          target="_blank"
          href={url?.trim() || undefined}
          onClick={(e) => e.preventDefault()}
          style={{
            backgroundColor,
            color,
            padding,
            borderRadius,
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            fontWeight: "500",
            border: borderStyleString,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          className="hover:opacity-90 shadow-sm hover:shadow-md"
        >
          {text || "Click Here"}
        </a>
      </div>
    </div>
  );
});

// Editor is now handled by UnifiedEditingToolbar
ButtonComponent.Editor = null;
