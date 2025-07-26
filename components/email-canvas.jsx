"use client";

import { useState, useCallback, useEffect } from "react";
import { EmailComponent } from "./email-component";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export function EmailCanvas({
  components,
  handleComponentUpdate,
  onUpdateComponents,
  onAddComponent,
  selectedComponent,
  setSelectedComponent,
}) {
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [formattedTime, setFormattedTime] = useState("");

  // Auto-save function
  const autoSave = useCallback(() => {
    // Save to localStorage
    localStorage.setItem("emailEditorData", JSON.stringify(components));
    setLastSaved(Date.now());
    console.log("Auto-saved at:", new Date().toLocaleTimeString());
  }, [components]);

  // Auto-save when components change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(autoSave, 1000); // Auto-save after 1 second of no changes
    return () => clearTimeout(timeoutId);
  }, [components, autoSave]);

  // Load saved data on mount (only once)
  useEffect(() => {
    const savedData = localStorage.getItem("emailEditorData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        onUpdateComponents(parsedData);
        console.log("Loaded saved data");
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []); // Empty dependency array - only run once

  // Format timestamp for display (client-side only)
  useEffect(() => {
    setFormattedTime(new Date(lastSaved).toLocaleTimeString());
  }, [lastSaved]);

  // Add visual feedback for column drag over
  useEffect(() => {
    const columnElements = document.querySelectorAll("[data-column-id]");

    columnElements.forEach((element) => {
      if (dragOverColumn && element.dataset.columnId === dragOverColumn) {
        element.classList.add(
          "border-primary",
          "bg-primary/10",
          "scale-[1.02]"
        );
        element.style.transform = "scale(1.02)";
        element.style.transition = "all 0.2s ease";
      } else {
        element.classList.remove(
          "border-primary",
          "bg-primary/10",
          "scale-[1.02]"
        );
        element.style.transform = "scale(1)";
      }
    });
  }, [dragOverColumn]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    // Check if we're dragging over a column area
    const columnElement = e.target.closest("[data-column-id]");
    if (columnElement) {
      const columnId = columnElement.dataset.columnId;
      setDragOverColumn(columnId);
    } else {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    // First check if we're dropping into a column area
    const columnElement = e.target.closest("[data-column-id]");
    if (columnElement) {
      const columnId = columnElement.dataset.columnId;
      const componentIndex = findComponentIndexFromElement(columnElement);
      if (componentIndex !== null) {
        handleComponentDrop(e, componentIndex, columnId);
        setDragOverColumn(null);
        return;
      }
    }

    // If not dropping into a column, check for regular component drops
    const target = findTarget(e.target);
    if (target) {
      handleComponentDrop(e, target.index, target.columnId);
    } else {
      try {
        const componentData = JSON.parse(
          e.dataTransfer.getData("application/json")
        );
        onAddComponent(componentData.type, componentData.defaultData);
      } catch (error) {
        console.error("Error parsing dropped component:", error);
      }
    }
    setDragOverColumn(null);
  };

  const findComponentIndexFromElement = (element) => {
    // Find the closest component container
    let currentElement = element;
    while (currentElement) {
      if (currentElement.dataset.componentIndex) {
        return parseInt(currentElement.dataset.componentIndex, 10);
      }
      currentElement = currentElement.parentElement;
    }
    return null;
  };

  const handleComponentDrop = (e, targetIndex, columnId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const componentData = JSON.parse(
        e.dataTransfer.getData("application/json")
      );
      const newComponent = {
        type: componentData.type,
        data: componentData.defaultData,
      };

      if (columnId) {
        // Dropping into a column
        const newComponents = [...components];
        const layoutComponent = newComponents[targetIndex];

        if (layoutComponent && layoutComponent.type.includes("columns")) {
          const newLayoutData = { ...layoutComponent.data };
          const targetArray = `${columnId}Components`;

          if (newLayoutData[targetArray]) {
            newLayoutData[targetArray] = [
              ...newLayoutData[targetArray],
              newComponent,
            ];
            layoutComponent.data = newLayoutData;
            onUpdateComponents(newComponents);
          }
        } else if (
          layoutComponent &&
          layoutComponent.type === "single-column"
        ) {
          // Handle single column layout
          const newLayoutData = { ...layoutComponent.data };
          newLayoutData.components = [
            ...(newLayoutData.components || []),
            newComponent,
          ];
          layoutComponent.data = newLayoutData;
          onUpdateComponents(newComponents);
        }
      } else {
        // Dropping between components
        const newComponents = [...components];
        newComponents.splice(targetIndex, 0, newComponent);
        onUpdateComponents(newComponents);
      }
    } catch (error) {
      console.error("Error parsing dropped component:", error);
    }
    setDragOverIndex(null);
    setDragOverColumn(null);
  };

  const findTarget = (element) => {
    while (element) {
      if (element.dataset.componentIndex) {
        return {
          index: parseInt(element.dataset.componentIndex, 10),
          columnId: element.dataset.columnId,
        };
      }
      element = element.parentElement;
    }
    return null;
  };

  const handleDragOverComponent = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
    setDragOverColumn(null);
  };

  const handleComponentDelete = (index) => {
    const newComponents = components.filter((_, i) => i !== index);
    onUpdateComponents(newComponents);
    setSelectedComponent({ component: null, index: null });
  };

  const handleComponentMove = (fromIndex, toIndex) => {
    const newComponents = [...components];
    const [movedComponent] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, movedComponent);
    onUpdateComponents(newComponents);
  };

  if (components.length === 0) {
    return (
      <div
        className="flex-1 flex items-center justify-center bg-background border-l border-border"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center text-muted-foreground">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-lg font-medium mb-2">
            Start Building Your Email
          </h3>
          <p className="text-sm">
            Drag components from the left panel to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 bg-background border-l border-border overflow-y-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <div className="p-6 max-w-4xl mx-auto">
        {formattedTime && (
          <div className="mb-4 text-sm text-muted-foreground">
            Last saved: {formattedTime}
          </div>
        )}

        {components.map((component, index) => (
          <div
            key={`${component.type}-${index}`}
            data-component-index={index}
            className={`relative group mb-4 border-2 border-transparent hover:border-primary rounded-lg transition-colors ${
              dragOverIndex === index
                ? "border-2 border-primary border-dashed"
                : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedComponent((prev) => {
                if (prev?.index === index && prev?.component === component)
                  return prev;
                return { component, index };
              });
            }}
            onDragOver={(e) => handleDragOverComponent(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) =>
              handleComponentDrop(e, index, e.target.dataset.columnId)
            }
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="flex gap-1">
                {/* <Popover
                  open={editingComponent === index}
                  onOpenChange={(isOpen) =>
                    setEditingComponent(isOpen ? index : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-card hover:bg-accent"
                    >
                      Edit
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 bg-card border border-border rounded-lg shadow-lg">
                    <ScrollArea className="h-96">
                      <EmailComponent
                        type={component.type}
                        data={component.data}
                        isEditing={true}
                        onUpdate={(updatedData) =>
                          handleComponentUpdate(index, updatedData)
                        }
                        onCancel={() => setEditingComponent(null)}
                      />
                    </ScrollArea>
                  </PopoverContent>
                </Popover> */}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComponentDelete(index);
                  }}
                  className="bg-card hover:bg-destructive/10 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <EmailComponent
              setSelectedComponent={setSelectedComponent}
              type={component.type}
              data={component.data}
              onUpdate={(updatedData) =>
                handleComponentUpdate(index, updatedData)
              }
            />

            {/* Drag handles for reordering */}
            {index > 0 && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleComponentMove(index, index - 1)}
                  className="bg-card hover:bg-accent text-xs"
                >
                  ↑ Move Up
                </Button>
              </div>
            )}

            {index < components.length - 1 && (
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleComponentMove(index, index + 1)}
                  className="bg-card hover:bg-accent text-xs"
                >
                  ↓ Move Down
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
