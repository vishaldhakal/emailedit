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
import { ColumnComponentManager } from "@/components/email-components/column-component-manager";

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
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
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
        id: nanoid(),
        type: componentData.type,
        data: componentData.defaultData,
      };

      if (columnId === "left") {
        const newComponents = [...leftComponents, newComponent];
        onUpdate({ ...data, leftComponents: newComponents });
      } else if (columnId === "right") {
        const newComponents = [...rightComponents, newComponent];
        onUpdate({ ...data, rightComponents: newComponents });
      }
    } catch (error) {
      console.error("Error parsing dropped component:", error);
    }
    setDragOverIndex(null);
    setDragOverColumn(null);
  };
  const handleDropBetween = (e, columnId, index) => {
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
      if (columnId === "left") {
        const newLeft = [...leftComponents];
        newLeft.splice(index, 0, newComponent);
        onUpdate({ ...data, leftComponents: newLeft });
      } else if (columnId === "right") {
        const newRight = [...rightComponents];
        newRight.splice(index, 0, newComponent);
        onUpdate({ ...data, rightComponents: newRight });
      }
    } catch (error) {
      console.error("Error parsing dropped component:", error);
    }
    setDragOverIndex(null);
    setDragOverColumn(null);
  };

  const handleDragOverBetween = (e, columnId, index) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(index);
    setDragOverColumn(columnId);
  };
  const handleDragLeaveBetween = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
    setDragOverColumn(null);
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
          onDrop={(e) => handleColumnDrop(e, "left")}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {leftComponents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-xl mb-2">📄</div>
              <div>Left Column</div>
              <div className="text-sm">Drop content here</div>
            </div>
          ) : (
            <div className="space-y-1">
              {leftComponents.map((component, index) => (
                <React.Fragment key={component.id}>
                  {/* Drop zone before each component */}
                  <div
                    className={`h-2 transition-all duration-200 rounded-sm ${
                      dragOverIndex === index && dragOverColumn === "left"
                        ? "bg-blue-400/30 h-6 my-1"
                        : "h-2"
                    }`}
                    onDrop={(e) => handleDropBetween(e, "left", index)}
                    onDragOver={(e) => handleDragOverBetween(e, "left", index)}
                    onDragLeave={handleDragLeaveBetween}
                  />
                  {/* main component */}
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
                </React.Fragment>
              ))}
              {/* Drop zone at end */}
              <div
                className={`h-2 transition-colors rounded-sm ${
                  dragOverIndex === leftComponents.length &&
                  dragOverColumn === "left"
                    ? "bg-blue-400/30 h-4 my-1"
                    : "h-2"
                }`}
                onDragOver={(e) =>
                  handleDragOverBetween(e, "left", leftComponents.length)
                }
                onDrop={(e) =>
                  handleDropBetween(e, "left", leftComponents.length)
                }
                onDragLeave={handleDragLeaveBetween}
              />
            </div>
          )}
        </div>
        <div
          style={{ width: rightWidth }}
          className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground flex flex-col transition-colors hover:border-primary/50"
          data-column-id="right"
          onDrop={(e) => handleColumnDrop(e, "right")}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {rightComponents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-xl mb-2">📄</div>
              <div>Right Column</div>
              <div className="text-sm">Drop content here</div>
            </div>
          ) : (
            <div className="space-y-1">
              {rightComponents.map((component, index) => (
                <React.Fragment key={component.id}>
                  {/* Drop zone before each component */}
                  <div
                    className={`h-2 transition-all duration-200 rounded-sm ${
                      dragOverIndex === index && dragOverColumn === "right"
                        ? "bg-blue-400/30 h-6 my-1"
                        : "h-2"
                    }`}
                    onDrop={(e) => handleDropBetween(e, "right", index)}
                    onDragOver={(e) => handleDragOverBetween(e, "right", index)}
                    onDragLeave={handleDragLeaveBetween}
                  />
                  {/* main component */}
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
                </React.Fragment>
              ))}
              {/* Drop zone at end */}
              <div
                className={`h-2 transition-colors rounded-sm ${
                  dragOverIndex === rightComponents.length &&
                  dragOverColumn === "right"
                    ? "bg-blue-400/30 h-4 my-1"
                    : "h-2"
                }`}
                onDragOver={(e) =>
                  handleDragOverBetween(e, "right", rightComponents.length)
                }
                onDrop={(e) =>
                  handleDropBetween(e, "right", rightComponents.length)
                }
                onDragLeave={handleDragLeaveBetween}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

TwoColumns.Editor = function TwoColumnsEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    onUpdate(formData);
  }, [formData]);

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
    </div>
  );
};
