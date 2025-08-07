import React, { useEffect, useState } from "react";
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

export function Column({ data, onUpdate, setSelectedComponentId }) {
  const {
    width,
    backgroundColor,
    padding,
    gap,
    columns,
    columnWidths = [],
    columnsData = [], // Array of arrays: components per column
  } = data;

  // Ensure columnsData length matches columns count
  // (Useful if columns changed but data not synced)
  const normalizedColumnsData =
    columnsData.length === columns
      ? columnsData
      : Array(columns)
          .fill(0)
          .map((_, i) => columnsData[i] || []);

  const normalizedColumnWidths =
    columnWidths.length === columns
      ? columnWidths
      : Array(columns).fill(`${(100 / columns).toFixed(2)}%`);

  // Update whole data helper
  function updateData(newData) {
    onUpdate({ ...data, ...newData });
  }

  // Handle adding new component to a specific column
  const handleComponentClick = (component, columnIndex) => {
    const newComponent = {
      id: nanoid(),
      type: component.type,
      data: component.defaultData,
    };
    const newColumnsData = [...normalizedColumnsData];
    newColumnsData[columnIndex] = [
      ...newColumnsData[columnIndex],
      newComponent,
    ];
    updateData({ columnsData: newColumnsData });
  };

  // Insert component after a given index inside a column
  const handleInbetweenAdd = (component, columnIndex, index) => {
    const newComponent = {
      id: nanoid(),
      type: component.type,
      data: component.defaultData,
    };
    const newColumnsData = [...normalizedColumnsData];
    const columnComponents = [...newColumnsData[columnIndex]];
    columnComponents.splice(index + 1, 0, newComponent);
    newColumnsData[columnIndex] = columnComponents;
    updateData({ columnsData: newColumnsData });
  };

  // Update component data inside a column
  const handleComponentUpdate = (columnIndex, componentIndex, updatedData) => {
    const newColumnsData = [...normalizedColumnsData];
    newColumnsData[columnIndex] = [...newColumnsData[columnIndex]];
    newColumnsData[columnIndex][componentIndex] = {
      ...newColumnsData[columnIndex][componentIndex],
      data: updatedData,
    };
    updateData({ columnsData: newColumnsData });
  };

  // Delete component inside a column
  const handleComponentDelete = (columnIndex, componentIndex) => {
    const newColumnsData = [...normalizedColumnsData];
    newColumnsData[columnIndex] = newColumnsData[columnIndex].filter(
      (_, i) => i !== componentIndex
    );
    updateData({ columnsData: newColumnsData });
  };

  // Move component inside a column up/down
  const handleComponentMove = (columnIndex, fromIndex, toIndex) => {
    const newColumnsData = [...normalizedColumnsData];
    const columnComponents = [...newColumnsData[columnIndex]];
    const [movedComponent] = columnComponents.splice(fromIndex, 1);
    columnComponents.splice(toIndex, 0, movedComponent);
    newColumnsData[columnIndex] = columnComponents;
    updateData({ columnsData: newColumnsData });
  };

  // Render nothing if no columns
  if (columns === 0) return null;

  return (
    <div
      style={{
        width,
        backgroundColor,
        padding,
        display: "flex",
        gap,
      }}
      className="border border-border rounded-lg transition-colors hover:border-primary/50"
    >
      {normalizedColumnsData.map((components, columnIndex) => (
        <div
          key={columnIndex}
          style={{
            width: normalizedColumnWidths[columnIndex],
            display: "flex",
            flexDirection: "column",
          }}
          data-column-id={`column-${columnIndex}`}
          className="border border-border rounded-md p-2"
        >
          {components.length === 0 && (
            <AddComponent
              columnId={`column-${columnIndex}`}
              handleComponentClick={(comp) =>
                handleComponentClick(comp, columnIndex)
              }
            />
          )}
          {components.map((component, index) => (
            <ColumnComponentManager
              key={component.id}
              component={component}
              index={index}
              totalComponents={components.length}
              setSelectedComponentId={setSelectedComponentId}
              handleInbetweenAdd={(comp, _, i) =>
                handleInbetweenAdd(comp, columnIndex, i)
              }
              onUpdate={(updatedData) =>
                handleComponentUpdate(columnIndex, index, updatedData)
              }
              onDelete={() => handleComponentDelete(columnIndex, index)}
              onMoveUp={() =>
                index > 0 && handleComponentMove(columnIndex, index, index - 1)
              }
              onMoveDown={() =>
                index < components.length - 1 &&
                handleComponentMove(columnIndex, index, index + 1)
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}

Column.Editor = function ColumnEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  // When number of columns changes, initialize columnsData and columnWidths if needed
  useEffect(() => {
    const n = Number(formData.columns) || 1;

    let updated = false;
    let newColumnsData = formData.columnsData || [];
    if (newColumnsData.length !== n) {
      newColumnsData = Array(n)
        .fill(0)
        .map((_, i) => formData.columnsData?.[i] || []);
      updated = true;
    }

    let newColumnWidths = formData.columnWidths || [];
    if (newColumnWidths.length !== n) {
      newColumnWidths = Array(n).fill(`${(100 / n).toFixed(2)}%`);
      updated = true;
    }

    if (updated) {
      setFormData((prev) => ({
        ...prev,
        columns: n,
        columnsData: newColumnsData,
        columnWidths: newColumnWidths,
      }));
    }
  }, [formData.columns]);

  // Propagate changes upstream
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
      <div className="flex items-center gap-2">
        <Label htmlFor="padding">Gap</Label>
        <Select
          value={formData.gap}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, gap: value }))
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

      <div className="flex items-center gap-2">
        <Label htmlFor="columns">Columns</Label>
        <Select
          value={formData.columns}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, columns: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
