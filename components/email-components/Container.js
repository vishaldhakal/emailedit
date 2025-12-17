"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { nanoid } from "nanoid";
import { ColumnComponentManager } from "./ColumnComponentManager";
import AddComponent from "../addComponent";

export const Container = memo(function Container({
  data,
  onUpdate,
  setSelectedComponentId,
  isSelected,
  selectedComponentId,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const {
    backgroundColor = "transparent",
    padding = "20px",
    borderRadius = "0px",
    components = [],
  } = data;

  // Handle adding new component
  // AddComponent passes (component, columnId, index) but we only need component
  const handleComponentClick = (component, columnId, index) => {
    // Ensure component and defaultData exist
    if (!component || !component.type) {
      console.error("Invalid component passed to handleComponentClick");
      return;
    }

    // Ensure defaultData exists and is properly structured
    const defaultData = component?.defaultData || {};

    // For heading component, ensure content is always set
    if (
      component.type === "heading" &&
      (!defaultData.content || defaultData.content.trim() === "")
    ) {
      defaultData.content = "This is a Heading";
    }

    const newComponent = {
      id: nanoid(),
      type: component.type,
      data: { ...defaultData }, // Create a copy to avoid reference issues
    };
    const newComponents = [...components, newComponent];
    onUpdate({ ...data, components: newComponents });
  };

  // Update component data
  const handleComponentUpdate = (componentIndex, updatedData) => {
    const newComponents = [...components];
    newComponents[componentIndex] = {
      ...newComponents[componentIndex],
      data: updatedData,
    };
    onUpdate({ ...data, components: newComponents });
  };

  // Delete component
  const handleComponentDelete = (componentIndex) => {
    const newComponents = components.filter((_, i) => i !== componentIndex);
    onUpdate({ ...data, components: newComponents });
  };

  // Move component up/down
  const handleComponentMove = (fromIndex, toIndex) => {
    const newComponents = [...components];
    const [movedComponent] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, movedComponent);
    onUpdate({ ...data, components: newComponents });
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Listen for global drag end events
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragging(false);
    };
    document.addEventListener("dragend", handleGlobalDragEnd);
    return () => {
      document.removeEventListener("dragend", handleGlobalDragEnd);
    };
  }, []);

  // Recursively regenerate IDs for nested components
  const regenerateIds = useCallback((comp) => {
    const newComp = {
      ...comp,
      id: nanoid(),
    };

    if (newComp.data && Array.isArray(newComp.data.columnsData)) {
      newComp.data = {
        ...newComp.data,
        columnsData: newComp.data.columnsData.map((column) =>
          Array.isArray(column)
            ? column.map((nestedComp) => regenerateIds(nestedComp))
            : column
        ),
      };
    }

    if (newComp.data && Array.isArray(newComp.data.components)) {
      newComp.data = {
        ...newComp.data,
        components: newComp.data.components.map((nestedComp) =>
          regenerateIds(nestedComp)
        ),
      };
    }

    return newComp;
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      try {
        const componentData = JSON.parse(
          e.dataTransfer.getData("application/json")
        );

        if (componentData.type === "template" && componentData.components) {
          const templateComponents = componentData.components.map((comp) =>
            regenerateIds(comp)
          );
          const newComponents = [...components, ...templateComponents];
          onUpdate({ ...data, components: newComponents });
        } else {
          // Ensure defaultData exists and is properly structured
          const defaultData = componentData?.defaultData || {};

          // For heading component, ensure content is always set
          if (
            componentData.type === "heading" &&
            (!defaultData.content || defaultData.content.trim() === "")
          ) {
            defaultData.content = "This is a Heading";
          }

          const newComponent = {
            id: nanoid(),
            type: componentData.type,
            data: { ...defaultData }, // Create a copy to avoid reference issues
          };
          const newComponents = [...components, newComponent];
          onUpdate({ ...data, components: newComponents });
        }

        setTimeout(() => {
          const customDragEndEvent = new CustomEvent("column-drop-end", {
            bubbles: true,
            cancelable: true,
            detail: { source: "container" },
          });
          document.dispatchEvent(customDragEndEvent);
        }, 0);
      } catch (error) {
        console.error("Error handling drop in container:", error);
      }
    },
    [components, data, onUpdate, regenerateIds]
  );

  const handleDropBetween = useCallback(
    (e, index) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      try {
        const componentData = JSON.parse(
          e.dataTransfer.getData("application/json")
        );

        if (componentData.type === "template" && componentData.components) {
          const templateComponents = componentData.components.map((comp) =>
            regenerateIds(comp)
          );
          const newComponents = [...components];
          newComponents.splice(index + 1, 0, ...templateComponents);
          onUpdate({ ...data, components: newComponents });
        } else {
          // Ensure defaultData exists and is properly structured
          const defaultData = componentData?.defaultData || {};

          // For heading component, ensure content is always set
          if (
            componentData.type === "heading" &&
            (!defaultData.content || defaultData.content.trim() === "")
          ) {
            defaultData.content = "This is a Heading";
          }

          const newComponent = {
            id: nanoid(),
            type: componentData.type,
            data: { ...defaultData }, // Create a copy to avoid reference issues
          };
          const newComponents = [...components];
          newComponents.splice(index + 1, 0, newComponent);
          onUpdate({ ...data, components: newComponents });
        }

        setTimeout(() => {
          const customDragEndEvent = new CustomEvent("column-drop-end", {
            bubbles: true,
            cancelable: true,
            detail: { source: "container" },
          });
          document.dispatchEvent(customDragEndEvent);
        }, 0);
      } catch (error) {
        console.error("Error handling drop between in container:", error);
      }
    },
    [components, data, onUpdate, regenerateIds]
  );

  return (
    <div
      className="w-full relative"
      style={{
        backgroundColor:
          backgroundColor === "transparent" ? "transparent" : backgroundColor,
        padding: padding,
        borderRadius: borderRadius,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none z-10 flex items-center justify-center">
          <span className="text-blue-600 text-sm font-medium bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
            Drop here
          </span>
        </div>
      )}

      {/* Container components */}
      <div className="space-y-0">
        {components.length === 0 && !isDragging && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <div className="text-sm mb-2">Drop components here</div>
            <AddComponent
              handleComponentClick={handleComponentClick}
              useDropdown
              label="+ Add"
            />
          </div>
        )}

        {components.map((comp, compIndex) => (
          <ColumnComponentManager
            key={comp.id}
            component={comp}
            index={compIndex}
            totalCount={components.length}
            onUpdate={(updatedData) =>
              handleComponentUpdate(compIndex, updatedData)
            }
            onDelete={() => handleComponentDelete(compIndex)}
            onMoveUp={() => handleComponentMove(compIndex, compIndex - 1)}
            onMoveDown={() => handleComponentMove(compIndex, compIndex + 1)}
            onDropBetween={(e) => handleDropBetween(e, compIndex)}
            isFirstComponent={compIndex === 0}
            isLastComponent={compIndex === components.length - 1}
            selectedComponentId={selectedComponentId}
            setSelectedComponentId={setSelectedComponentId}
          />
        ))}

        {/* Add component button at bottom */}
        {components.length > 0 && (
          <div className="flex justify-center pt-2">
            <AddComponent
              handleComponentClick={handleComponentClick}
              useDropdown
              label="+"
            />
          </div>
        )}
      </div>
    </div>
  );
});
