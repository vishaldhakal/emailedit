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

export function TwoColumns({ data }) {
  const { leftWidth, rightWidth, backgroundColor, padding, gap } = data;

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
          style={{ width: leftWidth }}
          className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
        >
          <div className="text-xl mb-2">📄</div>
          <div>Left Column</div>
          <div className="text-sm">Drop content here</div>
        </div>
        <div
          style={{ width: rightWidth }}
          className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
        >
          <div className="text-xl mb-2">📄</div>
          <div>Right Column</div>
          <div className="text-sm">Drop content here</div>
        </div>
      </div>
    </div>
  );
}

TwoColumns.Editor = function TwoColumnsEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="leftWidth">Left Column Width</Label>
          <Select
            value={formData.leftWidth}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, leftWidth: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25%">25%</SelectItem>
              <SelectItem value="33%">33%</SelectItem>
              <SelectItem value="40%">40%</SelectItem>
              <SelectItem value="50%">50%</SelectItem>
              <SelectItem value="60%">60%</SelectItem>
              <SelectItem value="67%">67%</SelectItem>
              <SelectItem value="75%">75%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rightWidth">Right Column Width</Label>
          <Select
            value={formData.rightWidth}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, rightWidth: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="75%">75%</SelectItem>
              <SelectItem value="67%">67%</SelectItem>
              <SelectItem value="60%">60%</SelectItem>
              <SelectItem value="50%">50%</SelectItem>
              <SelectItem value="40%">40%</SelectItem>
              <SelectItem value="33%">33%</SelectItem>
              <SelectItem value="25%">25%</SelectItem>
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
              <SelectItem value="20px">Medium</SelectItem>
              <SelectItem value="30px">Large</SelectItem>
              <SelectItem value="40px">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                style={{ width: formData.leftWidth }}
                className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Left Column</div>
              </div>
              <div
                style={{ width: formData.rightWidth }}
                className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Right Column</div>
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
