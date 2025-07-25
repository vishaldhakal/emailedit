"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <img
      src={src}
      alt={alt}
      style={{
        width,
        height,
        maxWidth: "100%",
        display: "block",
      }}
      className="rounded"
    />
  );
}

ImageComponent.Editor = function ImageEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, onUpdate]);

  const widthOptions = [
    { value: "100%", label: "Full Width" },
    { value: "75%", label: "75%" },
    { value: "50%", label: "50%" },
    { value: "25%", label: "25%" },
    { value: "200px", label: "200px" },
    { value: "300px", label: "300px" },
    { value: "400px", label: "400px" },
  ];

  const heightOptions = [
    { value: "auto", label: "Auto" },
    { value: "100px", label: "100px" },
    { value: "200px", label: "200px" },
    { value: "300px", label: "300px" },
    { value: "400px", label: "400px" },
  ];

  return (
    <div className="space-y-4">
      <div>
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

      <div>
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

      <div>
        <Label>Width</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {widthOptions.map((option) => (
            <Button
              key={option.value}
              variant={
                formData.width === option.value ? "default" : "secondary"
              }
              size="sm"
              onClick={() =>
                setFormData((prev) => ({ ...prev, width: option.value }))
              }
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Height</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {heightOptions.map((option) => (
            <Button
              key={option.value}
              variant={
                formData.height === option.value ? "default" : "secondary"
              }
              size="sm"
              onClick={() =>
                setFormData((prev) => ({ ...prev, height: option.value }))
              }
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {formData.src && (
        <div className="border rounded-lg p-2">
          <Label>Preview</Label>
          <img
            src={formData.src}
            alt={formData.alt}
            style={{
              width: formData.width,
              height: formData.height,
              maxWidth: "100%",
            }}
            className="mt-2 rounded"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
};
