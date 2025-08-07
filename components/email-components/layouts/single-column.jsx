"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nanoid } from "nanoid";
import { ColumnComponentManager } from "@/components/email-components/column-component-manager";
import AddComponent from "@/components/addComponent";

export function SingleColumn({ data, onUpdate, setSelectedComponentId }) {
  const { width, backgroundColor, padding, components = [] } = data;

  const handleComponentClick = (component, columnId) => {
    const newComponent = {
      id: nanoid(),
      type: component.type,
      data: component.defaultData,
    };
    const newComponents = [...components, newComponent];
    onUpdate({ ...data, components: newComponents });
  };
  const handleComponentUpdate = (index, updatedData) => {
    const newComponents = [...components];
    newComponents[index] = { ...newComponents[index], data: updatedData };
    onUpdate({ ...data, components: newComponents });
  };

  const handleComponentDelete = (index) => {
    const newComponents = components.filter((_, i) => i !== index);
    onUpdate({ ...data, components: newComponents });
  };

  const handleComponentMove = (fromIndex, toIndex) => {
    const newComponents = [...components];
    const [movedComponent] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, movedComponent);
    onUpdate({ ...data, components: newComponents });
  };

  return (
    <div
      style={{
        width,
        backgroundColor,
        padding,
      }}
      className="border border-border rounded-lg flex flex-col transition-colors hover:border-primary/50"
      data-column-id="single"
    >
      <div className="space-y-1">
        {components.map((component, index) => (
          <ColumnComponentManager
            setSelectedComponentId={setSelectedComponentId}
            key={component.id}
            component={component}
            index={index}
            totalComponents={components.length}
            onUpdate={(updatedData) =>
              handleComponentUpdate(index, updatedData)
            }
            onDelete={(index) => handleComponentDelete(index)}
            onMoveUp={(index) => handleComponentMove(index, index - 1)}
            onMoveDown={(index) => handleComponentMove(index, index + 1)}
          />
        ))}
        <AddComponent
          columnId="single"
          handleComponentClick={handleComponentClick}
        />
      </div>
    </div>
  );
}

SingleColumn.Editor = function SingleColumnEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    onUpdate(formData);
  }, [formData]);

  return (
    <div className="flex items-center h-full justify-center gap-4 bg-muted px-4 py-2 shadow-sm border-b w-full overflow-x-auto">
      <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-2 ">
        <Label htmlFor="backgroundColor" className="text-sm">
          Background Color
        </Label>
        <div className="relative w-6 h-6">
          <label className="w-full h-full cursor-pointer inline-flex items-center justify-center">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <input
              type="color"
              value={formData.backgroundColor}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  backgroundColor: e.target.value,
                }))
              }
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
