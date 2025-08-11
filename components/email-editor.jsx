"use client";

import { useState, useCallback } from "react";
import { Header } from "./header";
import { EmailCanvas } from "./email-canvas";
import { EditorPanel } from "./editor-panel";
import { nanoid } from "nanoid";

export function EmailEditor() {
  const [components, setComponents] = useState([]);
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  const handleAddComponent = (type, defaultData) => {
    const newComponent = {
      id: nanoid(),
      type,
      data: defaultData,
    };
    setComponents((prev) => [...prev, newComponent]);
  };

  //updates individual components
  const handleComponentUpdate = (id, updatedData) => {
    const newComponents = updateComponentById(components, id, updatedData);
    setComponents(newComponents);
  };

  // Recursively search nested components by ID and update
  function updateComponentById(components, id, updatedData) {
    return components.map((component) => {
      if (component.id === id) {
        return {
          ...component,
          data: updatedData,
        };
      }

      const data = component.data;
      let updated = false;
      const newComponent = { ...component };

      // Handle nested column layout: columnsData (Array of Arrays)
      if (Array.isArray(data?.columnsData)) {
        const updatedColumnsData = data.columnsData.map((column) => {
          if (Array.isArray(column)) {
            return updateComponentById(column, id, updatedData);
          }
          return column;
        });

        // Check if columnsData changed
        if (
          JSON.stringify(updatedColumnsData) !==
          JSON.stringify(data.columnsData)
        ) {
          newComponent.data = {
            ...data,
            columnsData: updatedColumnsData,
          };
          updated = true;
        }
      }

      // Optional fallback: Handle if there’s still `components` key used
      if (Array.isArray(data?.components)) {
        const updatedComponents = updateComponentById(
          data.components,
          id,
          updatedData
        );

        if (
          JSON.stringify(updatedComponents) !== JSON.stringify(data.components)
        ) {
          newComponent.data = {
            ...data,
            components: updatedComponents,
          };
          updated = true;
        }
      }

      return updated ? newComponent : component;
    });
  }

  //updates entire components list
  const handleUpdateComponents = (newComponents) => {
    setComponents(newComponents);
  };

  const handleGenerateEmail = (aiComponents) => {
    // Replace current components with AI-generated ones
    setComponents(aiComponents);
  };

  const handleSave = useCallback(() => {
    // Save to localStorage
    localStorage.setItem("emailEditorData", JSON.stringify(components));
    setLastSaved(Date.now());
    console.log("Manually saved at:", new Date().toLocaleTimeString());
  }, [components]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        components={components}
        onUpdateComponents={handleUpdateComponents}
        onSave={handleSave}
        lastSaved={lastSaved}
        onGenerateEmail={handleGenerateEmail}
      />
      <EditorPanel
        selectedComponentId={selectedComponentId}
        handleComponentUpdate={handleComponentUpdate}
        components={components}
      />

      <EmailCanvas
        components={components}
        onUpdateComponents={handleUpdateComponents}
        handleComponentUpdate={handleComponentUpdate}
        onAddComponent={handleAddComponent}
        selectedComponentId={selectedComponentId}
        setSelectedComponentId={setSelectedComponentId}
      />
    </div>
  );
}
