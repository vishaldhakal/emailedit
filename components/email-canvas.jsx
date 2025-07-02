"use client";

import { useState, useCallback, useEffect } from "react";
import { EmailComponent } from "./email-component";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export function EmailCanvas({
  components,
  onUpdateComponents,
  onAddComponent,
}) {
  const [editingComponent, setEditingComponent] = useState(null);
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [dragOverIndex, setDragOverIndex] = useState(null);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const componentData = JSON.parse(
        e.dataTransfer.getData("application/json")
      );
      onAddComponent(componentData.type, componentData.defaultData);
    } catch (error) {
      console.error("Error parsing dropped component:", error);
    }
  };

  const handleComponentDrop = (e, targetIndex) => {
    e.preventDefault();
    try {
      const componentData = JSON.parse(
        e.dataTransfer.getData("application/json")
      );
      // Insert the component at the target index
      const newComponent = {
        type: componentData.type,
        data: componentData.defaultData,
      };
      const newComponents = [...components];
      newComponents.splice(targetIndex, 0, newComponent);
      onUpdateComponents(newComponents);
    } catch (error) {
      console.error("Error parsing dropped component:", error);
    }
    setDragOverIndex(null);
  };

  const handleDragOverComponent = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleComponentUpdate = (index, updatedData) => {
    const newComponents = [...components];
    newComponents[index] = {
      ...newComponents[index],
      data: updatedData,
    };
    onUpdateComponents(newComponents);
    setEditingComponent(null);
  };

  const handleComponentDelete = (index) => {
    const newComponents = components.filter((_, i) => i !== index);
    onUpdateComponents(newComponents);
    setEditingComponent(null);
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
        className="flex-1 flex items-center justify-center bg-gray-50 border-l"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center text-gray-500">
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
      className="flex-1 bg-white border-l overflow-y-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-4 text-sm text-gray-500">
          Last saved: {new Date(lastSaved).toLocaleTimeString()}
        </div>

        {components.map((component, index) => (
          <div
            key={`${component.type}-${index}`}
            className={`relative group mb-4 border-2 border-transparent hover:border-blue-300 rounded-lg transition-colors ${
              dragOverIndex === index
                ? "border-2 border-blue-300 border-dashed"
                : ""
            }`}
            onDragOver={(e) => handleDragOverComponent(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleComponentDrop(e, index)}
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingComponent(index)}
                  className="bg-white hover:bg-gray-50"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleComponentDelete(index)}
                  className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <EmailComponent
              type={component.type}
              data={component.data}
              isEditing={editingComponent === index}
              onUpdate={(updatedData) =>
                handleComponentUpdate(index, updatedData)
              }
              onCancel={() => setEditingComponent(null)}
            />

            {/* Drag handles for reordering */}
            {index > 0 && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleComponentMove(index, index - 1)}
                  className="bg-white hover:bg-gray-50 text-xs"
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
                  className="bg-white hover:bg-gray-50 text-xs"
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
