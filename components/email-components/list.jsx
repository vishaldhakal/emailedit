import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
export function List({ data }) {
  return (
    <div style={{ color: data.color, fontSize: data.fontSize }}>
      {data.listType === "unordered" && (
        <ul style={{ listStyleType: data.listStyle, paddingLeft: "1.25rem" }}>
          {data.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {data.listType === "ordered" && (
        <ol style={{ listStyleType: data.listStyle, paddingLeft: "1.25rem" }}>
          {data.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

List.Editor = function ListEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    const timer = setTimeout(() => onUpdate(formData), 500);
    return () => clearTimeout(timer);
  }, [formData]);

  const unorderedOptions = [
    { value: "disc", label: "Disc" },
    { value: "circle", label: "Circle" },
    { value: "square", label: "Square" },
  ];

  const orderedOptions = [
    { value: "decimal", label: "1, 2, 3" },
    { value: "upper-roman", label: "I, II, III" },
    { value: "lower-alpha", label: "a, b, c" },
  ];
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, ""],
    }));
  };
  const styleOptions =
    formData.listType === "unordered" ? unorderedOptions : orderedOptions;
  return (
    <div
      className="flex items-center gap-3 bg-white px-3 py-2 h-12 
  shadow-lg rounded-md fixed top-[74px] left-1/2 -translate-x-1/2 
  z-50 border"
    >
      {/* items  */}
      <Popover>
        <PopoverTrigger
          className="inline-flex items-center px-4 py-1 bg-blue-600 text-white font-semibold rounded-md shadow-sm
                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 transition-colors duration-150 ease-in-out cursor-pointer"
        >
          Items
        </PopoverTrigger>

        <PopoverContent className="w-[320px] max-h-[400px] overflow-auto space-y-4 p-4">
          {formData.items?.map((item, i) => {
            const handleItemChange = (e) => {
              const newItems = [...formData.items];
              newItems[i] = e.target.value;
              setFormData((prev) => ({ ...prev, items: newItems }));
            };

            const removeItem = () => {
              const newItems = formData.items.filter((_, index) => index !== i);
              setFormData((prev) => ({ ...prev, items: newItems }));
            };
            return (
              <div className="flex gap-10" key={i}>
                <Input
                  type="text"
                  value={item}
                  onChange={handleItemChange}
                  placeholder="Enter a item"
                  className="text-xs"
                />
                <button
                  type="button"
                  onClick={removeItem}
                  aria-label={`Remove ${item} `}
                  className="text-red-600 hover:bg-red-400 hover:text-slate-100  rounded px-1"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
            className="w-full mt-2"
          >
            + Add Item
          </Button>
        </PopoverContent>
      </Popover>

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

      {/* Font Size */}

      <Select
        value={formData.fontSize.replace("px", "")}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, fontSize: value + "px" }))
        }
      >
        <SelectTrigger className="w-[80px] h-8">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="14">14</SelectItem>
          <SelectItem value="16">16</SelectItem>
          <SelectItem value="18">18</SelectItem>
          <SelectItem value="24">24</SelectItem>
        </SelectContent>
      </Select>

      {/* List style */}

      <div className="flex items-center gap-2">
        <Label>List Type</Label>
        <Select
          value={formData.listType}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              listType: value,
              listStyle: value === "unordered" ? "disc" : "decimal", // default style
            }))
          }
        >
          <SelectTrigger className="w-[110px] h-8">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unordered">Unordered</SelectItem>
            <SelectItem value="ordered">Ordered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Style Select */}
      <div className="flex items-center gap-2">
        <Label>Style</Label>
        <Select
          value={formData.listStyle}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, listStyle: value }))
          }
        >
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            {styleOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
