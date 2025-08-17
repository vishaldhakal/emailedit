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
export function ImageComponent({ data }) {
  const { src, alt, width, height } = data;

  if (!src) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 p-8">
        <div className="text-4xl mb-2">📷</div>
        <div>Click to add image</div>
      </div>
    );
  }

  return (
    <div className="flex w-auto justify-center items-center">
      <img
        src={src}
        alt={alt}
        style={{
          width: width,
          height: height,
          maxWidth: "100%",
          display: "block",
        }}
        className="rounded"
      />
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
    <div className="flex items-center justify-start gap-5 px-2 py-2 w-full overflow-x-auto text-black">
      <div className="flex items-center gap-1">
        <Label htmlFor="src">Image URL</Label>
        <Input
          id="src"
          value={formData.src}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, src: e.target.value }))
          }
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center gap-1">
        <Label htmlFor="alt">Alt Text</Label>
        <Input
          id="alt"
          value={formData.alt}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, alt: e.target.value }))
          }
          placeholder="Description of the image"
        />
      </div>

      <div className="flex items-center gap-2">
        <Label>Width</Label>
        <Select
          value={formData.width}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, width: value }))
          }
        >
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue placeholder="width" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100%">Full Width</SelectItem>
            <SelectItem value="75%">75%</SelectItem>
            <SelectItem value="50%">50%</SelectItem>
            <SelectItem value="25%">25%</SelectItem>
            <SelectItem value="200px">200px</SelectItem>
            <SelectItem value="300px">300px</SelectItem>
            <SelectItem value="400px">400px</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label>Height</Label>
        <Select
          value={formData.height}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, height: value }))
          }
        >
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue placeholder="width" />
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
  );
};
