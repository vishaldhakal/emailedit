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
import { EmailComponent } from "@/components/email-component";
import { ColumnComponentManager } from "@/components/email-components/column-component-manager";

export function ThreeColumns({ data, onUpdate }) {
  const {
    columnWidth,
    backgroundColor,
    padding,
    gap,
    column1Components = [],
    column2Components = [],
    column3Components = [],
  } = data;

  const handleColumnDrop = (e, columnId) => {
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
    } catch (error) {
      console.error("Error parsing dropped component:", error);
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
          onDrop={(e) => handleColumnDrop(e, "1")}
          onDragOver={(e) => e.preventDefault()}
        >
          {column1Components.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-xl mb-2">📄</div>
              <div>Column 1</div>
              <div className="text-sm">Drop content here</div>
            </div>
          ) : (
            <div className="space-y-3">
              {column1Components.map((component, index) => (
                <ColumnComponentManager
                  key={`${component.type}-${index}`}
                  component={component}
                  index={index}
                  totalComponents={column1Components.length}
                  onUpdate={(updatedData) =>
                    handleComponentUpdate("1", index, updatedData)
                  }
                  onDelete={(index) => handleComponentDelete("1", index)}
                  onMoveUp={(index) =>
                    handleComponentMove("1", index, index - 1)
                  }
                  onMoveDown={(index) =>
                    handleComponentMove("1", index, index + 1)
                  }
                />
              ))}
            </div>
          )}
        </div>
        <div
          style={{ width: columnWidth }}
          className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground flex flex-col transition-colors hover:border-primary/50"
          data-column-id="2"
          onDrop={(e) => handleColumnDrop(e, "2")}
          onDragOver={(e) => e.preventDefault()}
        >
          {column2Components.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-xl mb-2">📄</div>
              <div>Column 2</div>
              <div className="text-sm">Drop content here</div>
            </div>
          ) : (
            <div className="space-y-3">
              {column2Components.map((component, index) => (
                <ColumnComponentManager
                  key={`${component.type}-${index}`}
                  component={component}
                  index={index}
                  totalComponents={column2Components.length}
                  onUpdate={(updatedData) =>
                    handleComponentUpdate("2", index, updatedData)
                  }
                  onDelete={(index) => handleComponentDelete("2", index)}
                  onMoveUp={(index) =>
                    handleComponentMove("2", index, index - 1)
                  }
                  onMoveDown={(index) =>
                    handleComponentMove("2", index, index + 1)
                  }
                />
              ))}
            </div>
          )}
        </div>
        <div
          style={{ width: columnWidth }}
          className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground flex flex-col transition-colors hover:border-primary/50"
          data-column-id="3"
          onDrop={(e) => handleColumnDrop(e, "3")}
          onDragOver={(e) => e.preventDefault()}
        >
          {column3Components.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-xl mb-2">📄</div>
              <div>Column 3</div>
              <div className="text-sm">Drop content here</div>
            </div>
          ) : (
            <div className="space-y-3">
              {column3Components.map((component, index) => (
                <ColumnComponentManager
                  key={`${component.type}-${index}`}
                  component={component}
                  index={index}
                  totalComponents={column3Components.length}
                  onUpdate={(updatedData) =>
                    handleComponentUpdate("3", index, updatedData)
                  }
                  onDelete={(index) => handleComponentDelete("3", index)}
                  onMoveUp={(index) =>
                    handleComponentMove("3", index, index - 1)
                  }
                  onMoveDown={(index) =>
                    handleComponentMove("3", index, index + 1)
                  }
                />
              ))}
            </div>
          )}
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
              <SelectItem value="30%">30%</SelectItem>
              <SelectItem value="33.33%">33.33%</SelectItem>
              <SelectItem value="35%">35%</SelectItem>
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

      <div className="border rounded-lg p-4 bg-card">
        <Label>Preview</Label>
        <div className="mt-2">
          <div
            style={{
              backgroundColor: formData.backgroundColor,
              padding: formData.padding,
            }}
            className="border border-border rounded-lg"
          >
            <div className="flex" style={{ gap: formData.gap || "20px" }}>
              <div
                style={{ width: formData.columnWidth }}
                className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Column 1</div>
              </div>
              <div
                style={{ width: formData.columnWidth }}
                className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Column 2</div>
              </div>
              <div
                style={{ width: formData.columnWidth }}
                className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Column 3</div>
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
