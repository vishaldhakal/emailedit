"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SocialMedia({ data }) {
  const { platforms, iconSize, color, alignment } = data;

  const socialIcons = {
    facebook: "📘",
    twitter: "🐦",
    instagram: "📷",
    linkedin: "💼",
    youtube: "📺",
    tiktok: "🎵",
  };

  return (
    <div style={{ textAlign: alignment }}>
      <div className="flex gap-4 justify-center">
        {platforms.map((platform, index) => (
          <a
            key={index}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: iconSize,
              color: color,
              textDecoration: "none",
            }}
            className="hover:opacity-70 transition-opacity"
          >
            {socialIcons[platform.name] || "🔗"}
          </a>
        ))}
      </div>
    </div>
  );
}

SocialMedia.Editor = function SocialMediaEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, onUpdate]);

  const platformOptions = [
    { value: "facebook", label: "Facebook", icon: "📘" },
    { value: "twitter", label: "Twitter", icon: "🐦" },
    { value: "instagram", label: "Instagram", icon: "📷" },
    { value: "linkedin", label: "LinkedIn", icon: "💼" },
    { value: "youtube", label: "YouTube", icon: "📺" },
    { value: "tiktok", label: "TikTok", icon: "🎵" },
  ];

  const iconSizeOptions = [
    { value: "20px", label: "Small" },
    { value: "24px", label: "Medium" },
    { value: "32px", label: "Large" },
    { value: "40px", label: "Extra Large" },
  ];

  const alignmentOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ];

  const addPlatform = () => {
    setFormData((prev) => ({
      ...prev,
      platforms: [...prev.platforms, { name: "facebook", url: "" }],
    }));
  };

  const removePlatform = (index) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.filter((_, i) => i !== index),
    }));
  };

  const updatePlatform = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.map((platform, i) =>
        i === index ? { ...platform, [field]: value } : platform
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Social Platforms</Label>
        <div className="space-y-2 mt-2">
          {formData.platforms.map((platform, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Platform</Label>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      {platformOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={
                            platform.name === option.value
                              ? "default"
                              : "secondary"
                          }
                          size="sm"
                          onClick={() =>
                            updatePlatform(index, "name", option.value)
                          }
                          className="text-xs p-1"
                        >
                          {option.icon}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">URL</Label>
                    <Input
                      value={platform.url}
                      onChange={(e) =>
                        updatePlatform(index, "url", e.target.value)
                      }
                      placeholder="https://..."
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removePlatform(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addPlatform}
            className="w-full"
          >
            + Add Platform
          </Button>
        </div>
      </div>

      <div>
        <Label>Icon Size</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {iconSizeOptions.map((option) => (
            <Button
              key={option.value}
              variant={
                formData.iconSize === option.value ? "default" : "outline"
              }
              size="sm"
              onClick={() =>
                setFormData((prev) => ({ ...prev, iconSize: option.value }))
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="color">Icon Color</Label>
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, color: e.target.value }))
            }
          />
        </div>

        <div>
          <Label>Alignment</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {alignmentOptions.map((option) => (
              <Button
                key={option.value}
                variant={
                  formData.alignment === option.value ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, alignment: option.value }))
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <Label>Preview</Label>
        <div className="mt-2" style={{ textAlign: formData.alignment }}>
          <div className="flex gap-4 justify-center">
            {formData.platforms.map((platform, index) => (
              <span
                key={index}
                style={{
                  fontSize: formData.iconSize,
                  color: formData.color,
                }}
              >
                {platformOptions.find((p) => p.value === platform.name)?.icon ||
                  "🔗"}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel}>
          Close
        </Button>
      </div>
    </div>
  );
};
