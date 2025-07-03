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
import { EmailComponent } from "@/components/email-component"; // Import EmailComponent

export function SingleColumn({ data, onUpdate }) {
  const { width, backgroundColor, padding, components = [] } = data;
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const componentData = JSON.parse(
        e.dataTransfer.getData("application/json")
      );
      const newComponent = {
        type: componentData.type,
        data: componentData.defaultData,
      };
      const newComponents = [...components, newComponent];
      onUpdate({ ...data, components: newComponents });
    } catch (error) {
      console.error("Error parsing dropped component:", error);
    }
  };

  return (
    <div
      style={{
        width,
        backgroundColor,
        padding,
      }}
      className={`border border-border rounded-lg ${
        dragOver ? "border-primary border-dashed" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {components.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground border-2 border-dashed border-border rounded">
          <div className="text-2xl mb-2">📄</div>
          <div>Single Column Layout</div>
          <div className="text-sm">Drop content here</div>
        </div>
      ) : (
        <div className="p-4">
          {components.map((component, index) => (
            <EmailComponent
              key={`${component.type}-${index}`}
              type={component.type}
              data={component.data}
              onUpdate={(updatedData) => {
                const newComponents = [...components];
                newComponents[index] = { ...newComponents[index], data: updatedData };
                onUpdate({ ...data, components: newComponents });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

SingleColumn.Editor = function SingleColumnEditor({
  data,
  onUpdate,
  onCancel,
}) {
  const [formData, setFormData] = useState(data);

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width</Label>
          <Select
            value={formData.width}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, width: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100%">Full Width</SelectItem>
              <SelectItem value="90%">90%</SelectItem>
              <SelectItem value="80%">80%</SelectItem>
              <SelectItem value="70%">70%</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

      <div className="border rounded-lg p-4 bg-card">
        <Label>Preview</Label>
        <div className="mt-2">
          <div
            style={{
              width: formData.width,
              backgroundColor: formData.backgroundColor,
              padding: formData.padding,
            }}
            className="border border-border rounded-lg"
          >
            <div className="p-4 text-center text-muted-foreground border-2 border-dashed border-border rounded">
              <div className="text-2xl mb-2">📄</div>
              <div>Single Column Layout</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};
