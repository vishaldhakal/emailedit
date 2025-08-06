"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
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

export function TwoColumns({ data, onUpdate, setSelectedComponentId }) {
  const {
    leftWidth,
    rightWidth,
    backgroundColor,
    padding,
    gap,
    leftComponents = [],
    rightComponents = [],
  } = data;

  const handleComponentClick = (component, columnId) => {
    const newComponent = {
      id: nanoid(),
      type: component.type,
      data: component.defaultData,
    };

    if (columnId === "left") {
      const newComponents = [...leftComponents, newComponent];
      onUpdate({ ...data, leftComponents: newComponents });
    } else if (columnId === "right") {
      const newComponents = [...rightComponents, newComponent];
      onUpdate({ ...data, rightComponents: newComponents });
    }
  };

  const handleComponentUpdate = (columnId, index, updatedData) => {
    if (columnId === "left") {
      const newComponents = [...leftComponents];
      newComponents[index] = { ...newComponents[index], data: updatedData };
      onUpdate({ ...data, leftComponents: newComponents });
    } else if (columnId === "right") {
      const newComponents = [...rightComponents];
      newComponents[index] = { ...newComponents[index], data: updatedData };
      onUpdate({ ...data, rightComponents: newComponents });
    }
  };

  const handleComponentDelete = (columnId, index) => {
    if (columnId === "left") {
      const newComponents = leftComponents.filter((_, i) => i !== index);
      onUpdate({ ...data, leftComponents: newComponents });
    } else if (columnId === "right") {
      const newComponents = rightComponents.filter((_, i) => i !== index);
      onUpdate({ ...data, rightComponents: newComponents });
    }
  };

  const handleComponentMove = (columnId, fromIndex, toIndex) => {
    if (columnId === "left") {
      const newComponents = [...leftComponents];
      const [movedComponent] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, movedComponent);
      onUpdate({ ...data, leftComponents: newComponents });
    } else if (columnId === "right") {
      const newComponents = [...rightComponents];
      const [movedComponent] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, movedComponent);
      onUpdate({ ...data, rightComponents: newComponents });
    }
  };

  return (
    <div
      style={{
        backgroundColor,
        padding,
      }}
      className="border border-border rounded-lg"
    >
      <div className="flex" style={{ gap: gap || "20px" }}>
        <div
          style={{ width: leftWidth }}
          className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground flex flex-col transition-colors hover:border-primary/50"
          data-column-id="left"
        >
          <div className="space-y-1">
            {leftComponents.map((component, index) => (
              <ColumnComponentManager
                setSelectedComponentId={setSelectedComponentId}
                key={component.id}
                component={component}
                index={index}
                totalComponents={leftComponents.length}
                onUpdate={(updatedData) =>
                  handleComponentUpdate("left", index, updatedData)
                }
                onDelete={(index) => handleComponentDelete("left", index)}
                onMoveUp={(index) =>
                  handleComponentMove("left", index, index - 1)
                }
                onMoveDown={(index) =>
                  handleComponentMove("left", index, index + 1)
                }
              />
            ))}
            <AddComponent
              columnId="left"
              handleComponentClick={handleComponentClick}
            />
          </div>
        </div>
        <div
          style={{ width: rightWidth }}
          className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground flex flex-col transition-colors hover:border-primary/50"
          data-column-id="right"
        >
          <div className="space-y-1">
            {rightComponents.map((component, index) => (
              <ColumnComponentManager
                setSelectedComponentId={setSelectedComponentId}
                key={component.id}
                component={component}
                index={index}
                totalComponents={rightComponents.length}
                onUpdate={(updatedData) =>
                  handleComponentUpdate("right", index, updatedData)
                }
                onDelete={(index) => handleComponentDelete("right", index)}
                onMoveUp={(index) =>
                  handleComponentMove("right", index, index - 1)
                }
                onMoveDown={(index) =>
                  handleComponentMove("right", index, index + 1)
                }
              />
            ))}
            <AddComponent
              columnId="right"
              handleComponentClick={handleComponentClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

TwoColumns.Editor = function TwoColumnsEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    onUpdate(formData);
  }, [formData]);

  return (
    <div className="flex items-center h-full justify-center gap-4 bg-muted px-4 py-2 shadow-sm border-b w-full overflow-x-auto">
      <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-1">
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

      <div className="flex items-center gap-1">
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

      <div className="flex items-center gap-1">
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
