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
export function ImageComponent({ data, onUpdate, isSelected }) {
  const { src, alt, width, height } = data;

  if (!src) {
    return (
      <div className="relative">
        <div className="border-2 border-dashed border-gray-200 rounded-md text-center text-gray-400 py-12 px-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
          <div className="text-3xl mb-2 opacity-60">🖼️</div>
          <div className="text-sm font-medium">Add Image</div>
        </div>
        {isSelected && (
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
            <ImageComponent.Editor data={data} onUpdate={onUpdate} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="flex justify-center items-center">
        <img
          src={src}
          alt={alt}
          style={{
            width: width,
            height: height,
            maxWidth: "100%",
            display: "block",
          }}
          className="rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
        />
      </div>
      {isSelected && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
          <ImageComponent.Editor data={data} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

ImageComponent.Editor = function ImageEditor({ data, onUpdate }) {
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
          <Label htmlFor="src" className="text-xs font-medium text-gray-600">
            URL
          </Label>
          <Input
            className="w-56 h-7 text-xs border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
            id="src"
            value={formData.src}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, src: e.target.value }))
            }
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="alt" className="text-xs font-medium text-gray-600">
            Alt
          </Label>
          <Input
            className="w-36 h-7 text-xs border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
            id="alt"
            value={formData.alt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, alt: e.target.value }))
            }
            placeholder="Description"
          />
        </div>
      </div>

      {/* Second Line */}
      <div className="flex items-center gap-2">
        {/* Width */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-gray-600">Width</Label>
          <Select
            value={formData.width}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, width: value }))
            }
          >
            <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
              <SelectValue placeholder="W" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100%">100%</SelectItem>
              <SelectItem value="75%">75%</SelectItem>
              <SelectItem value="50%">50%</SelectItem>
              <SelectItem value="25%">25%</SelectItem>
              <SelectItem value="200px">200px</SelectItem>
              <SelectItem value="300px">300px</SelectItem>
              <SelectItem value="400px">400px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Height */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-gray-600">Height</Label>
          <Select
            value={formData.height}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, height: value }))
            }
          >
            <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
              <SelectValue placeholder="H" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">auto</SelectItem>
              <SelectItem value="100px">100px</SelectItem>
              <SelectItem value="200px">200px</SelectItem>
              <SelectItem value="300px">300px</SelectItem>
              <SelectItem value="400px">400px</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
