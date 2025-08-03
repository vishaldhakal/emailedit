"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import { ColumnComponentManager } from "@/components/email-components/column-component-manager";

export function SingleColumn({ data, onUpdate, setSelectedComponentId }) {
  const { width, backgroundColor, padding, components = [] } = data;
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const handleColumnDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onUpdate) {
      console.error("onUpdate function is not available");
      return;
    }

    try {
      const componentData = JSON.parse(
        e.dataTransfer.getData("application/json")
      );
      const newComponent = {
        id: nanoid(),
        type: componentData.type,
        data: componentData.defaultData,
      };
      const newComponents = [...components, newComponent];
      onUpdate({ ...data, components: newComponents });
    } catch (error) {
      console.error("Error parsing dropped component:", error);
    }
    setDragOverIndex(null);
  };
  const handleDropBetween = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const componentData = JSON.parse(
        e.dataTransfer.getData("application/json")
      );
      const newComponent = {
        id: nanoid(),
        type: componentData.type,
        data: componentData.defaultData,
      };
      const newComponents = [...components];
      newComponents.splice(index, 0, newComponent);
      onUpdate({ ...data, components: newComponents });
    } catch (error) {
      console.error("Error parsing dropped component:", error);
    }
    setDragOverIndex(null);
  };

  const handleDragOverBetween = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(index);
  };
  const handleDragLeaveBetween = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
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
      onDrop={handleColumnDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {components.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border-2 border-dashed border-border rounded">
          <div className="text-2xl mb-2">📄</div>
          <div>Single Column Layout</div>
          <div className="text-sm">Drop content here</div>
        </div>
      ) : (
        <div className="space-y-1">
          {components.map((component, index) => (
            <React.Fragment key={component.id}>
              {/* Drop zone before each component */}
              <div
                className={`h-2 transition-all duration-200 rounded-sm ${
                  dragOverIndex === index ? "bg-blue-400/30 h-6 my-1" : "h-2"
                }`}
                onDrop={(e) => handleDropBetween(e, index)}
                onDragOver={(e) => handleDragOverBetween(e, index)}
                onDragLeave={handleDragLeaveBetween}
              />
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
            </React.Fragment>
          ))}
          {/* Drop zone at end */}
          <div
            className={`h-2 transition-colors rounded-sm ${
              dragOverIndex === components.length
                ? "bg-blue-400/30 h-4 my-1"
                : "h-2"
            }`}
            onDragOver={(e) => handleDragOverBetween(e, components.length)}
            onDrop={(e) => handleDropBetween(e, components.length)}
            onDragLeave={handleDragLeaveBetween}
          />
        </div>
      )}
    </div>
  );
}

SingleColumn.Editor = function SingleColumnEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    onUpdate(formData);
  }, [formData]);

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
    </div>
  );
};
