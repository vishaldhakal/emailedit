import React, { useEffect, useState, useCallback } from "react";
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

export function Column({
  data,
  onUpdate,
  setSelectedComponentId,
  isSelected,
  selectedComponentId,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState(null);

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

  // Drag and drop handlers for columns
  const handleDragOver = useCallback((e, columnIndex) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
    setDragOverColumn(columnIndex);
  }, []);

  const handleDragLeave = useCallback((e, columnIndex) => {
    e.stopPropagation();
    // Only clear drag state if we're leaving the column area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
      setDragOverColumn(null);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragOverColumn(null);
  }, []);

  // Listen for global drag end events to reset local drag state
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragging(false);
      setDragOverColumn(null);
    };

    document.addEventListener("dragend", handleGlobalDragEnd);
    return () => {
      document.removeEventListener("dragend", handleGlobalDragEnd);
    };
  }, []);

  const handleDrop = useCallback(
    (e, columnIndex) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragOverColumn(null);

      try {
        const componentData = JSON.parse(
          e.dataTransfer.getData("application/json")
        );
        const newComponent = {
          id: nanoid(),
          type: componentData.type,
          data: componentData.defaultData,
        };

        const newColumnsData = [...normalizedColumnsData];
        newColumnsData[columnIndex] = [
          ...newColumnsData[columnIndex],
          newComponent,
        ];

        onUpdate({ ...data, columnsData: newColumnsData });

        // Trigger global drag end to reset main canvas drag state
        setTimeout(() => {
          // Dispatch a custom event that the main canvas can listen to
          const customDragEndEvent = new CustomEvent("column-drop-end", {
            bubbles: true,
            cancelable: true,
            detail: { source: "column" },
          });
          document.dispatchEvent(customDragEndEvent);
        }, 0);
      } catch (error) {
        console.error("Error handling drop in column:", error);
      }
    },
    [normalizedColumnsData, data, onUpdate]
  );

  const handleDropBetween = useCallback(
    (e, columnIndex, index) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragOverColumn(null);

      try {
        const componentData = JSON.parse(
          e.dataTransfer.getData("application/json")
        );
        const newComponent = {
          id: nanoid(),
          type: componentData.type,
          data: componentData.defaultData,
        };

        const newColumnsData = [...normalizedColumnsData];
        const columnComponents = [...newColumnsData[columnIndex]];
        columnComponents.splice(index + 1, 0, newComponent);
        newColumnsData[columnIndex] = columnComponents;

        onUpdate({ ...data, columnsData: newColumnsData });

        // Trigger global drag end to reset main canvas drag state
        setTimeout(() => {
          // Dispatch a custom event that the main canvas can listen to
          const customDragEndEvent = new CustomEvent("column-drop-end", {
            bubbles: true,
            cancelable: true,
            detail: { source: "column" },
          });
          document.dispatchEvent(customDragEndEvent);
        }, 0);
      } catch (error) {
        console.error("Error handling drop between components:", error);
      }
    },
    [normalizedColumnsData, data, onUpdate]
  );

  // Render nothing if no columns
  if (columns === 0) return null;

  return (
    <div className="relative">
      <div
        style={{
          width,
          backgroundColor,
          padding,
          display: "flex",
          gap,
        }}
        className="bg-gray-100 rounded-lg transition-colors hover:border-primary/50"
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
            className={`bg-white  transition-all duration-200 relative ${
              dragOverColumn === columnIndex
                ? "border-blue-400 bg-blue-50/30"
                : "hover:border-primary/50"
            }`}
            onDragOver={(e) => handleDragOver(e, columnIndex)}
            onDragLeave={(e) => handleDragLeave(e, columnIndex)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, columnIndex)}
          >
            {/* Drop zone indicator when dragging over empty column */}
            {components.length === 0 &&
              isDragging &&
              dragOverColumn === columnIndex && (
                <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50/50 rounded-md flex items-center justify-center">
                  <div className="text-blue-600 text-sm font-medium">
                    Drop component here
                  </div>
                </div>
              )}

            {components.length === 0 && !isDragging && (
              <AddComponent
                columnId={`column-${columnIndex}`}
                handleComponentClick={(comp) =>
                  handleComponentClick(comp, columnIndex)
                }
              />
            )}

            {components.map((component, index) => (
              <div key={component.id} className="relative">
                {/* Drop zone between components */}
                <div
                  data-drop-zone
                  className={`transition-all duration-200 rounded-lg ${
                    isDragging
                      ? "h-2 opacity-100 bg-blue-100"
                      : "h-0 opacity-0 hover:opacity-100 hover:bg-blue-100 hover:border-2 hover:border-dashed hover:border-blue-300"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = "copy";
                  }}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDropBetween(e, columnIndex, index);
                  }}
                />

                <ColumnComponentManager
                  selectedComponentId={selectedComponentId}
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
                    index > 0 &&
                    handleComponentMove(columnIndex, index, index - 1)
                  }
                  onMoveDown={() =>
                    index < components.length - 1 &&
                    handleComponentMove(columnIndex, index, index + 1)
                  }
                />
              </div>
            ))}
            {/* Drop zone at bottom of column */}
            <div
              data-drop-zone
              className={`transition-all duration-200 rounded-lg mt-2 ${
                isDragging
                  ? "h-2 opacity-100 bg-blue-100"
                  : "h-0 opacity-0 hover:opacity-100 hover:bg-blue-100 hover:border-2 hover:border-dashed hover:border-blue-300"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDragEnd={handleDragEnd}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDropBetween(e, columnIndex, components.length - 1);
              }}
            />
          </div>
        ))}
      </div>
      {isSelected && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
          <Column.Editor data={data} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

Column.Editor = function ColumnEditor({ data, onUpdate }) {
  const updateField = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="bg-white px-3 py-2 max-w-2xl rounded-lg shadow-lg border border-gray-100 backdrop-blur-sm">
      {/* First Line */}
      <div className="flex items-center gap-2 mb-2">
        {/* Width */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-gray-600">Width</Label>
          <Select
            value={data.width}
            onValueChange={(value) => updateField("width", value)}
          >
            <SelectTrigger className="w-[70px] h-7 text-xs border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100%">100%</SelectItem>
              <SelectItem value="90%">90%</SelectItem>
              <SelectItem value="80%">80%</SelectItem>
              <SelectItem value="70%">70%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Padding */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-gray-600">Padding</Label>
          <Select
            value={data.padding}
            onValueChange={(value) => updateField("padding", value)}
          >
            <SelectTrigger className="w-[70px] h-7 text-xs border-gray-200">
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
          <Label className="text-xs font-medium text-gray-600">Gap</Label>
          <Select
            value={data.gap}
            onValueChange={(value) => updateField("gap", value)}
          >
            <SelectTrigger className="w-[70px] h-7 text-xs border-gray-200">
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

        {/* Columns */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-gray-600">Columns</Label>
          <Select
            value={String(data.columns)}
            onValueChange={(value) => updateField("columns", Number(value))}
          >
            <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
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

      {/* Second Line */}
      <div className="flex items-center gap-2">
        {/* Background Color */}
        <div className="flex flex-col items-center justify-center relative">
          <input
            type="color"
            value={data.backgroundColor}
            onChange={(e) => updateField("backgroundColor", e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="p-1 rounded-md hover:bg-gray-50 transition-colors">
            <FaPaintbrush className="w-3 h-3 text-gray-700" />
            <div
              className="w-3 h-0.5 rounded-sm mt-0.5 border border-gray-300"
              style={{ backgroundColor: data.backgroundColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
