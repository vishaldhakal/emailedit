"use client";

import React, { useState, useEffect } from "react";
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

export function ThreeColumns({ data, onUpdate, setSelectedComponentId }) {
  const {
    columnWidth,
    backgroundColor,
    padding,
    gap,
    column1Components = [],
    column2Components = [],
    column3Components = [],
  } = data;

  const handleComponentClick = (component, columnId) => {
    const newComponent = {
      id: nanoid(),
      type: component.type,
      data: component.defaultData,
    };

    if (columnId === "1") {
      const newComponents = [...column1Components, newComponent];
      onUpdate({ ...data, column1Components: newComponents });
    } else if (columnId === "2") {
      const newComponents = [...column2Components, newComponent];
      onUpdate({ ...data, column2Components: newComponents });
    } else if (columnId === "3") {
      const newComponents = [...column3Components, newComponent];
      onUpdate({ ...data, column3Components: newComponents });
    }
  };

  const handleComponentUpdate = (columnId, index, updatedData) => {
    if (columnId === "1") {
      const newComponents = [...column1Components];
      newComponents[index] = { ...newComponents[index], data: updatedData };
      onUpdate({ ...data, column1Components: newComponents });
    } else if (columnId === "2") {
      const newComponents = [...column2Components];
      newComponents[index] = { ...newComponents[index], data: updatedData };
      onUpdate({ ...data, column2Components: newComponents });
    } else if (columnId === "3") {
      const newComponents = [...column3Components];
      newComponents[index] = { ...newComponents[index], data: updatedData };
      onUpdate({ ...data, column3Components: newComponents });
    }
  };

  const handleComponentDelete = (columnId, index) => {
    if (columnId === "1") {
      const newComponents = column1Components.filter((_, i) => i !== index);
      onUpdate({ ...data, column1Components: newComponents });
    } else if (columnId === "2") {
      const newComponents = column2Components.filter((_, i) => i !== index);
      onUpdate({ ...data, column2Components: newComponents });
    } else if (columnId === "3") {
      const newComponents = column3Components.filter((_, i) => i !== index);
      onUpdate({ ...data, column3Components: newComponents });
    }
  };

  const handleComponentMove = (columnId, fromIndex, toIndex) => {
    if (columnId === "1") {
      const newComponents = [...column1Components];
      const [movedComponent] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, movedComponent);
      onUpdate({ ...data, column1Components: newComponents });
    } else if (columnId === "2") {
      const newComponents = [...column2Components];
      const [movedComponent] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, movedComponent);
      onUpdate({ ...data, column2Components: newComponents });
    } else if (columnId === "3") {
      const newComponents = [...column3Components];
      const [movedComponent] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, movedComponent);
      onUpdate({ ...data, column3Components: newComponents });
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
          style={{ width: columnWidth }}
          className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground flex flex-col transition-colors hover:border-primary/50"
          data-column-id="1"
        >
          <div className="space-y-1">
            {column1Components.map((component, index) => (
              <ColumnComponentManager
                setSelectedComponentId={setSelectedComponentId}
                key={component.id}
                component={component}
                index={index}
                totalComponents={column1Components.length}
                onUpdate={(updatedData) =>
                  handleComponentUpdate("1", index, updatedData)
                }
                onDelete={(index) => handleComponentDelete("1", index)}
                onMoveUp={(index) => handleComponentMove("1", index, index - 1)}
                onMoveDown={(index) =>
                  handleComponentMove("1", index, index + 1)
                }
              />
            ))}
            <AddComponent
              columnId="1"
              handleComponentClick={handleComponentClick}
            />
          </div>
        </div>
        <div
          style={{ width: columnWidth }}
          className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground flex flex-col transition-colors hover:border-primary/50"
          data-column-id="2"
        >
          <div className="space-y-1">
            {column2Components.map((component, index) => (
              <ColumnComponentManager
                setSelectedComponentId={setSelectedComponentId}
                key={component.id}
                component={component}
                index={index}
                totalComponents={column2Components.length}
                onUpdate={(updatedData) =>
                  handleComponentUpdate("2", index, updatedData)
                }
                onDelete={(index) => handleComponentDelete("2", index)}
                onMoveUp={(index) => handleComponentMove("2", index, index - 1)}
                onMoveDown={(index) =>
                  handleComponentMove("2", index, index + 1)
                }
              />
            ))}
            <AddComponent
              columnId="2"
              handleComponentClick={handleComponentClick}
            />
          </div>
        </div>
        <div
          style={{ width: columnWidth }}
          className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground flex flex-col transition-colors hover:border-primary/50"
          data-column-id="3"
        >
          <div className="space-y-1">
            {column3Components.map((component, index) => (
              <ColumnComponentManager
                setSelectedComponentId={setSelectedComponentId}
                key={component.id}
                component={component}
                index={index}
                totalComponents={column3Components.length}
                onUpdate={(updatedData) =>
                  handleComponentUpdate("3", index, updatedData)
                }
                onDelete={(index) => handleComponentDelete("3", index)}
                onMoveUp={(index) => handleComponentMove("3", index, index - 1)}
                onMoveDown={(index) =>
                  handleComponentMove("3", index, index + 1)
                }
              />
            ))}
            <AddComponent
              columnId="3"
              handleComponentClick={handleComponentClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

ThreeColumns.Editor = function ThreeColumnsEditor({
  data,
  onUpdate,
  onCancel,
}) {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    onUpdate(formData);
  }, [formData]);

  return (
    <div className="flex items-center h-full justify-center gap-4 bg-muted px-4 py-2 shadow-sm border-b w-full overflow-x-auto">
      <div className="flex items-center gap-2">
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
            <SelectItem value="30%">30%</SelectItem>
            <SelectItem value="33.33%">33.33%</SelectItem>
            <SelectItem value="35%">35%</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
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
