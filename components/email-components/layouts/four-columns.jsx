"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FourColumns({ data }) {
  const { columnWidth, backgroundColor, padding, gap } = data;

  return (
    <div
      style={{
        backgroundColor,
        padding,
      }}
      className="border border-gray-200 rounded-lg"
    >
      <div className="flex" style={{ gap: gap || "20px" }}>
        <div
          style={{ width: columnWidth }}
          className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
        >
          <div className="text-xl mb-2">📄</div>
          <div>Column 1</div>
          <div className="text-sm">Drop content here</div>
        </div>
        <div
          style={{ width: columnWidth }}
          className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
        >
          <div className="text-xl mb-2">📄</div>
          <div>Column 2</div>
          <div className="text-sm">Drop content here</div>
        </div>
        <div
          style={{ width: columnWidth }}
          className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
        >
          <div className="text-xl mb-2">📄</div>
          <div>Column 3</div>
          <div className="text-sm">Drop content here</div>
        </div>
        <div
          style={{ width: columnWidth }}
          className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
        >
          <div className="text-xl mb-2">📄</div>
          <div>Column 4</div>
          <div className="text-sm">Drop content here</div>
        </div>
      </div>
    </div>
  );
}

FourColumns.Editor = function FourColumnsEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="columnWidth">Column Width</Label>
          <Select
            value={formData.columnWidth}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, columnWidth: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20%">20%</SelectItem>
              <SelectItem value="22%">22%</SelectItem>
              <SelectItem value="25%">25%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gap">Column Gap</Label>
          <Select
            value={formData.gap || "20px"}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, gap: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10px">Small</SelectItem>
              <SelectItem value="15px">Medium</SelectItem>
              <SelectItem value="20px">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="padding">Padding</Label>
          <Select
            value={formData.padding}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, padding: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0px">None</SelectItem>
              <SelectItem value="10px">Small</SelectItem>
              <SelectItem value="20px">Medium</SelectItem>
              <SelectItem value="30px">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={formData.backgroundColor}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                backgroundColor: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <Label>Preview</Label>
        <div className="mt-2">
          <div
            style={{
              backgroundColor: formData.backgroundColor,
              padding: formData.padding,
            }}
            className="border border-gray-200 rounded-lg"
          >
            <div className="flex" style={{ gap: formData.gap || "20px" }}>
              <div
                style={{ width: formData.columnWidth }}
                className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Column 1</div>
              </div>
              <div
                style={{ width: formData.columnWidth }}
                className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Column 2</div>
              </div>
              <div
                style={{ width: formData.columnWidth }}
                className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Column 3</div>
              </div>
              <div
                style={{ width: formData.columnWidth }}
                className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Column 4</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};
