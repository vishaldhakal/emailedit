"use client";

import { useState, useCallback } from "react";
import { Header } from "./header";
import { ComponentsPanel } from "./components-panel";
import { EmailCanvas } from "./email-canvas";
import { EditorPanel } from "./editor-panel";

export function EmailEditor() {
  const [components, setComponents] = useState([]);
  const [lastSaved, setLastSaved] = useState(Date.now());

  console.log(components);
  const [selectedComponent, setSelectedComponent] = useState({
    component: null,
    index: null,
  });

  const handleAddComponent = (type, defaultData) => {
    const newComponent = {
      type,
      data: defaultData,
    };
    setComponents((prev) => [...prev, newComponent]);
  };

  //updates individual components
  const handleComponentUpdate = (index, updatedData) => {
    const newComponents = [...components];
    newComponents[index] = {
      ...newComponents[index],
      data: updatedData,
    };
    handleUpdateComponents(newComponents);

    // Update selectedComponent if it’s the one updated
    if (selectedComponent?.index === index) {
      setSelectedComponent({ ...selectedComponent, data: updatedData });
    }
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

      <div className="flex-1 flex overflow-hidden">
        <ComponentsPanel onAddComponent={handleAddComponent} />
        <EmailCanvas
          components={components}
          onUpdateComponents={handleUpdateComponents}
          handleComponentUpdate={handleComponentUpdate}
          onAddComponent={handleAddComponent}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
        />
        <EditorPanel
          selectedComponent={selectedComponent}
          handleComponentUpdate={handleComponentUpdate}
        />
      </div>
    </div>
  );
}
