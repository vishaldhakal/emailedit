"use client";

import { useState, useEffect } from "react";
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

export function FourColumns({ data, onUpdate, setSelectedComponent }) {
  const {
    columnWidth,
    backgroundColor,
    padding,
    gap,
    column1Components = [],
    column2Components = [],
    column3Components = [],
    column4Components = [],
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
      } else if (columnId === "4") {
        const newComponents = [...column4Components, newComponent];
        onUpdate({ ...data, column4Components: newComponents });
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
    } else if (columnId === "4") {
      const newComponents = [...column4Components];
      newComponents[index] = { ...newComponents[index], data: updatedData };
      onUpdate({ ...data, column4Components: newComponents });
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
    } else if (columnId === "4") {
      const newComponents = column4Components.filter((_, i) => i !== index);
      onUpdate({ ...data, column4Components: newComponents });
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
    } else if (columnId === "4") {
      const newComponents = [...column4Components];
      const [movedComponent] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, movedComponent);
      onUpdate({ ...data, column4Components: newComponents });
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
                  setSelectedComponent={setSelectedComponent}
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
        <div
          style={{ width: columnWidth }}
          className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground flex flex-col transition-colors hover:border-primary/50"
          data-column-id="4"
          onDrop={(e) => handleColumnDrop(e, "4")}
          onDragOver={(e) => e.preventDefault()}
        >
          {column4Components.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-xl mb-2">📄</div>
              <div>Column 4</div>
              <div className="text-sm">Drop content here</div>
            </div>
          ) : (
            <div className="space-y-3">
              {column4Components.map((component, index) => (
                <ColumnComponentManager
                  key={`${component.type}-${index}`}
                  component={component}
                  index={index}
                  totalComponents={column4Components.length}
                  onUpdate={(updatedData) =>
                    handleComponentUpdate("4", index, updatedData)
                  }
                  onDelete={(index) => handleComponentDelete("4", index)}
                  onMoveUp={(index) =>
                    handleComponentMove("4", index, index - 1)
                  }
                  onMoveDown={(index) =>
                    handleComponentMove("4", index, index + 1)
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

FourColumns.Editor = function FourColumnsEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    onUpdate(formData);
  }, [formData]);

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
    </div>
  );
};
