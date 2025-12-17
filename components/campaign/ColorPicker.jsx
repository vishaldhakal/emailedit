"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ColorPicker({
  value,
  onChange,
  label,
  showTransparent = false,
  size = "default",
  triggerClassName = "",
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label className="text-xs font-medium text-gray-700">{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={`w-full justify-start text-left font-normal px-2 ${triggerClassName} ${
              size === "sm" ? "h-8" : "h-10"
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              {value === "transparent" ? (
                <div className="w-4 h-4 rounded border border-gray-200 bg-[url('/checker.png')] bg-center bg-cover" />
              ) : (
                <div
                  className="w-4 h-4 rounded border border-gray-200"
                  style={{ backgroundColor: value }}
                />
              )}
              <span className="text-xs truncate flex-1">
                {value === "transparent" ? "Transparent" : value}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Custom Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={value === "transparent" ? "#ffffff" : value}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border border-gray-200 p-0.5"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="flex-1 px-2 text-xs border border-gray-200 rounded h-8"
                  placeholder="#000000"
                />
              </div>
            </div>
            
            {showTransparent && (
              <Button
                variant="outline"
                size="sm" 
                className="w-full h-8 text-xs justify-start"
                onClick={() => onChange("transparent")}
              >
                <div className="w-4 h-4 mr-2 rounded border border-gray-200 bg-[url('/checker.png')] bg-center bg-cover" />
                Transparent
              </Button>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">Presets</Label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  "#000000", "#ffffff", "#ef4444", "#f97316", "#f59e0b",
                  "#84cc16", "#22c55e", "#10b981", "#14b8a6", "#06b6d4",
                  "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
                  "#d946ef", "#ec4899", "#f43f5e", "#64748b", "transparent"
                ].map((color) => {
                  if (color === "transparent" && !showTransparent) return null;
                  return (
                    <button
                      key={color}
                      className="w-full aspect-square rounded border border-gray-200 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      style={{ backgroundColor: color !== "transparent" ? color : undefined }}
                      onClick={() => onChange(color)}
                      title={color}
                    >
                      {color === "transparent" && (
                         <div className="w-full h-full rounded bg-[url('/checker.png')] bg-center bg-cover" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
