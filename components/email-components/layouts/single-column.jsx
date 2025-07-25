"use client";

import { use, useEffect, useState } from "react";
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
import { EmailComponent } from "@/components/email-component";
import { ColumnComponentManager } from "@/components/email-components/column-component-manager";

export function SingleColumn({ data, onUpdate, setSelectedComponent }) {
  const { width, backgroundColor, padding, components = [] } = data;

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
        type: componentData.type,
        data: componentData.defaultData,
      };
      const newComponents = [...components, newComponent];
      onUpdate({ ...data, components: newComponents });
    } catch (error) {
      console.error("Error parsing dropped component:", error);
    }
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
      onDragOver={(e) => e.preventDefault()}
    >
      {components.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border-2 border-dashed border-border rounded">
          <div className="text-2xl mb-2">📄</div>
          <div>Single Column Layout</div>
          <div className="text-sm">Drop content here</div>
        </div>
      ) : (
        <div className="space-y-3">
          {components.map((component, index) => (
            <ColumnComponentManager
              setSelectedComponent={setSelectedComponent}
              key={`${component.type}-${index}`}
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
