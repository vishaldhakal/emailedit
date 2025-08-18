import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPaintbrush } from "react-icons/fa6";
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

  useEffect(() => {
    // Only update if columnWidths are different
    if (
      !data.columnWidths ||
      data.columnWidths.length !== normalizedColumnWidths.length ||
      data.columnWidths.some((w, i) => w !== normalizedColumnWidths[i])
    ) {
      onUpdate({
        ...data,
        columnWidths: normalizedColumnWidths,
      });
    }
  }, [normalizedColumnWidths]);
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
    onUpdate({ ...data, columnsData: newColumnsData });
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
    onUpdate({ ...data, columnsData: newColumnsData });
  };

  // Update component data inside a column
  const handleComponentUpdate = (columnIndex, componentIndex, updatedData) => {
    const newColumnsData = [...normalizedColumnsData];
    newColumnsData[columnIndex] = [...newColumnsData[columnIndex]];
    newColumnsData[columnIndex][componentIndex] = {
      ...newColumnsData[columnIndex][componentIndex],
      data: updatedData,
    };
    onUpdate({ ...data, columnsData: newColumnsData });
  };

  // Delete component inside a column
  const handleComponentDelete = (columnIndex, componentIndex) => {
    const newColumnsData = [...normalizedColumnsData];
    newColumnsData[columnIndex] = newColumnsData[columnIndex].filter(
      (_, i) => i !== componentIndex
    );
    onUpdate({ ...data, columnsData: newColumnsData });
  };

  // Move component inside a column up/down
  const handleComponentMove = (columnIndex, fromIndex, toIndex) => {
    const newColumnsData = [...normalizedColumnsData];
    const columnComponents = [...newColumnsData[columnIndex]];
    const [movedComponent] = columnComponents.splice(fromIndex, 1);
    columnComponents.splice(toIndex, 0, movedComponent);
    newColumnsData[columnIndex] = columnComponents;
    onUpdate({ ...data, columnsData: newColumnsData });
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
          className="border border-border rounded-md p-4"
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
  const updateField = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div
      className="flex items-center gap-3 bg-white px-3 py-2 h-12 
  shadow-lg rounded-md fixed top-[74px] left-1/2 -translate-x-1/2 
  z-50 border"
    >
      {/* Width */}
      <div className="flex items-center gap-2">
        <Label>Width</Label>
        <Select
          value={data.width}
          onValueChange={(value) => updateField("width", value)}
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

      {/* Padding */}
      <div className="flex items-center gap-2">
        <Label>Padding</Label>
        <Select
          value={data.padding}
          onValueChange={(value) => updateField("padding", value)}
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

      {/* Gap */}
      <div className="flex items-center gap-2">
        <Label>Gap</Label>
        <Select
          value={data.gap}
          onValueChange={(value) => updateField("gap", value)}
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

      {/* backgroundColor */}
      <div className="flex flex-col items-center justify-center relative">
        {/* Hidden color input */}
        <input
          type="color"
          value={data.backgroundColor}
          onChange={(e) => updateField("backgroundColor", e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Paint brush icon */}
        <FaPaintbrush className="w-4 h-4 text-black" />

        {/* Horizontal color line */}
        <div
          className="w-5 h-1 rounded-sm mt-0.5"
          style={{ backgroundColor: data.backgroundColor }}
        />
      </div>

      {/* Columns */}
      <div className="flex items-center gap-2">
        <Label>Columns</Label>
        <Select
          value={String(data.columns)}
          onValueChange={(value) => updateField("columns", Number(value))}
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
