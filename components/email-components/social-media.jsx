"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PopoverClose } from "@radix-ui/react-popover";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
export function SocialMedia({ data }) {
  const { platforms, iconSize, color, alignment } = data;

  const socialIcons = {
    facebook: FaFacebookF,
    twitter: FaTwitter,
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
    youtube: FaYoutube,
    tiktok: SiTiktok,
  };
  const justifyContentMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };
  return (
    <div style={{ textAlign: alignment }}>
      <div
        className="flex gap-4 "
        style={{ justifyContent: justifyContentMap[alignment] || "center" }}
      >
        {platforms?.map((platform, index) => {
          const Icon = socialIcons[platform.name];
          const sizeNumber = parseInt(iconSize, 10) || 24;
          return (
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
              {Icon ? <Icon size={sizeNumber} color={color} /> : "🔗"}
            </a>
          );
        })}
      </div>
    </div>
  );
}

SocialMedia.Editor = function SocialMediaEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const platformOptions = [
    { value: "facebook", label: "Facebook", icon: FaFacebookF },
    { value: "twitter", label: "Twitter", icon: FaTwitter },
    { value: "instagram", label: "Instagram", icon: FaInstagram },
    { value: "linkedin", label: "LinkedIn", icon: FaLinkedinIn },
    { value: "youtube", label: "YouTube", icon: FaYoutube },
    { value: "tiktok", label: "TikTok", icon: SiTiktok },
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
    <div
      className="flex items-center gap-3 bg-white px-3 py-2 h-12 
  shadow-lg rounded-md fixed top-[74px] left-1/2 -translate-x-1/2 
  z-50 border"
    >
      <Popover>
        <PopoverTrigger
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm
             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
             transition-colors duration-150 ease-in-out cursor-pointer"
        >
          Platforms
        </PopoverTrigger>

        <PopoverContent className="w-[320px] max-h-[400px] overflow-auto space-y-4 p-4">
          <Label className="block mb-2 font-semibold text-base">
            Social Platforms
          </Label>

          {formData.platforms?.map((platform, index) => (
            <fieldset
              key={index}
              className="flex items-center gap-3 border border-gray-200 rounded p-2"
            >
              <legend className="sr-only">
                Edit social platform {platform.name}
              </legend>

              <div className="flex-1 grid grid-cols-2 gap-3">
                {/* Platform selector */}
                <div>
                  <Label className="text-xs mb-1 block">Platform</Label>
                  <div className="grid grid-cols-3 gap-1">
                    {platformOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = platform.name === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            updatePlatform(index, "name", option.value)
                          }
                          aria-pressed={isSelected}
                          className={`flex items-center justify-center p-1 rounded border 
                      ${
                        isSelected
                          ? "bg-primary text-white border-primary"
                          : "border-gray-300 text-gray-600"
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary`}
                          title={option.label}
                        >
                          <Icon size={18} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* URL input */}
                <div>
                  <Label
                    className="text-xs mb-1 block"
                    htmlFor={`url-${index}`}
                  >
                    URL
                  </Label>
                  <Input
                    id={`url-${index}`}
                    type="url"
                    value={platform.url}
                    onChange={(e) =>
                      updatePlatform(index, "url", e.target.value)
                    }
                    placeholder="https://..."
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePlatform(index)}
                aria-label={`Remove ${platform.name} platform`}
                className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-600 rounded px-1"
                title="Remove platform"
              >
                ✕
              </button>
            </fieldset>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={addPlatform}
            className="w-full mt-2"
          >
            + Add Platform
          </Button>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <Label>Icon Size</Label>
        <Select
          value={formData.iconSize}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, iconSize: value }))
          }
        >
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue placeholder="icon Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20px">Small</SelectItem>
            <SelectItem value="24px">Medium</SelectItem>
            <SelectItem value="32px">Large</SelectItem>
            <SelectItem value="40px">Extra Large</SelectItem>
          </SelectContent>
        </Select>
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
