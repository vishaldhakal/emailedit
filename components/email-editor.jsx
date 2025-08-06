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

  //keys for nested component search
  const NESTED_KEYS = [
    "components",
    "leftComponents",
    "rightComponents",
    "column1Components",
    "column2Components",
    "column3Components",
    "column4Components",
  ];

  //recursivly search nested component by id and update
  const updateComponentById = (components, id, updatedData) => {
    return components.map((component) => {
      if (component.id === id) {
        return {
          ...component,
          data: updatedData,
        };
      }

      // Check and update nested component arrays
      let updated = false;
      const newComponent = { ...component };

      for (const key of NESTED_KEYS) {
        if (Array.isArray(component.data?.[key])) {
          const updatedChildren = updateComponentById(
            component.data[key],
            id,
            updatedData
          );

          // Check if children changed
          if (
            JSON.stringify(updatedChildren) !==
            JSON.stringify(component.data[key])
          ) {
            newComponent.data = {
              ...component.data,
              [key]: updatedChildren,
            };
            updated = true;
          }
        }
      }

      return updated ? newComponent : component;
    });
  };

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
