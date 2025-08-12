"use client";

import { useState, useCallback } from "react";
import { Header } from "./header";
import { EmailCanvas } from "./email-canvas";
import { EditorPanel } from "./editor-panel";
import { nanoid } from "nanoid";
import { useEffect } from "react";

export function EmailEditor() {
  const MAX_HISTORY_LENGTH = 20;

  // History array and current pointer
  const [history, setHistory] = useState([[]]); // initial empty components array in history
  const [historyIndex, setHistoryIndex] = useState(0);

  const [lastSaved, setLastSaved] = useState(Date.now());
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  // Current components is always the history[historyIndex]
  const components = history[historyIndex];

  // Utility to update history on any change
  const pushToHistory = (newComponents) => {
    const currentComponents = history[historyIndex];

    if (JSON.stringify(newComponents) === JSON.stringify(currentComponents)) {
      // Same snapshot, do nothing
      return;
    }

    // Cut off any "future" redo states if user edits after undo
    let newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newComponents);

    // If history exceeds max length, remove the oldest snapshot (at index 0)
    if (newHistory.length > MAX_HISTORY_LENGTH) {
      newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_LENGTH);
    }

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleAddComponent = (type, defaultData) => {
    const newComponent = {
      id: nanoid(),
      type,
      data: defaultData,
    };
    const newComponents = [...components, newComponent];
    pushToHistory(newComponents);
  };

  //updates individual components
  const handleComponentUpdate = (id, updatedData) => {
    const newComponents = updateComponentById(components, id, updatedData);
    pushToHistory(newComponents);
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
    pushToHistory(newComponents);
  };

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey && e.key === "y") ||
        (e.ctrlKey && e.shiftKey && e.key === "Z")
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const handleGenerateEmail = (aiComponents) => {
    // Replace current components with AI-generated ones
    pushToHistory(aiComponents);
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
