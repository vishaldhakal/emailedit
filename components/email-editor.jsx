"use client";

import { useState, useCallback, forwardRef } from "react";
import { EmailCanvas } from "./email-canvas";
import { useRef } from "react";
import { nanoid } from "nanoid";
import { useEffect } from "react";

export const EmailEditor = forwardRef(
  (
    {
      template,
      headerVariant,
      storageKey,
      onComponentsChange,
      initialComponents,
      onSelectionChange,
    },
    ref
  ) => {
    const MAX_HISTORY_LENGTH = 20;
    const canvasRef = useRef(null);
    // History array and current pointer
    const [history, setHistory] = useState([[]]); // initial empty components array in history
    const [historyIndex, setHistoryIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lastSaved, setLastSaved] = useState(Date.now());
    const [selectedComponentId, setSelectedComponentId] = useState(null);

    // Current components is always the history[historyIndex]
    const components = history[historyIndex];

    // Manual save function (defined before refs that depend on it)
    const manualSave = useCallback(
      async (componentsToSave) => {
        if (!componentsToSave) return;

        try {
          localStorage.setItem(
            storageKey || "emailEditorData",
            JSON.stringify(componentsToSave)
          );

          setLastSaved(Date.now());

          onComponentsChange && onComponentsChange(componentsToSave);
        } catch (error) {
          console.error("Save failed:", error);
        }
      },
      [storageKey, onComponentsChange]
    );

    // Notify parent when selection changes
    useEffect(() => {
      if (onSelectionChange) {
        onSelectionChange(selectedComponentId);
      }
    }, [selectedComponentId, onSelectionChange]);

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
            JSON.stringify(updatedComponents) !==
            JSON.stringify(data.components)
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

    // Update entire components list
    const handleUpdateComponents = useCallback(
      (newComponents) => {
        pushToHistory(newComponents);
      },
      [pushToHistory]
    );

    // Undo function
    const undo = useCallback(() => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        const previousState = history[newIndex];

        // Create a deep copy to avoid reference issues
        const restoredState = JSON.parse(JSON.stringify(previousState));

        // Update history index - this will cause components to update since it's computed from history[historyIndex]
        setHistoryIndex(newIndex);

        // Notify parent of the change so it syncs
        onComponentsChange && onComponentsChange(restoredState);
      }
    }, [historyIndex, history, onComponentsChange]);

    // Redo function
    const redo = useCallback(() => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        const nextState = history[newIndex];

        // Create a deep copy to avoid reference issues
        const restoredState = JSON.parse(JSON.stringify(nextState));

        // Update history index - this will cause components to update since it's computed from history[historyIndex]
        setHistoryIndex(newIndex);

        // Notify parent of the change so it syncs
        onComponentsChange && onComponentsChange(restoredState);
      }
    }, [historyIndex, history, onComponentsChange]);

    // Keyboard event handler - capture phase to catch events before contentEditable handles them
    useEffect(() => {
      const handleKeyDown = (e) => {
        // Handle Ctrl+Z for undo (works in all contexts)
        if (
          (e.ctrlKey || e.metaKey) &&
          !e.shiftKey &&
          (e.key === "z" || e.key === "Z")
        ) {
          // Don't prevent default if user is typing in an input/textarea/contentEditable
          // unless we're actually going to undo
          const target = e.target;
          const isContentEditable =
            target?.isContentEditable || target?.contentEditable === "true";
          const isInput =
            target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

          // Only prevent default and undo if we have history to undo
          if (historyIndex > 0) {
            e.preventDefault();
            e.stopPropagation();
            undo();
          } else if (!isContentEditable && !isInput) {
            // If no history but not in editable element, still prevent default
            e.preventDefault();
          }
        }
        // Handle Ctrl+Y or Ctrl+Shift+Z for redo
        else if (
          (e.ctrlKey || e.metaKey) &&
          (e.key === "y" ||
            e.key === "Y" ||
            (e.shiftKey && (e.key === "z" || e.key === "Z")))
        ) {
          const target = e.target;
          const isContentEditable =
            target?.isContentEditable || target?.contentEditable === "true";
          const isInput =
            target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

          // Only prevent default and redo if we have history to redo
          if (historyIndex < history.length - 1) {
            e.preventDefault();
            e.stopPropagation();
            redo();
          } else if (!isContentEditable && !isInput) {
            // If no history but not in editable element, still prevent default
            e.preventDefault();
          }
        }
        // Handle Escape to deselect
        else if (e.key === "Escape") {
          if (selectedComponentId) {
            e.preventDefault();
            setSelectedComponentId(null);
          }
        }
      };

      // Use capture phase to catch events early, before contentEditable can handle them
      document.addEventListener("keydown", handleKeyDown, true);

      return () => document.removeEventListener("keydown", handleKeyDown, true);
    }, [undo, redo, selectedComponentId, historyIndex, history.length]);

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
      <div className="flex-1 bg-gray-100 relative flex flex-col h-full">
        {/* Canvas Area */}
        <div className="flex-1 pb-52">
          <EmailCanvas
            loading={loading}
            ref={canvasRef}
            setLastSaved={setLastSaved}
            storageKey={storageKey}
            components={components}
            onUpdateComponents={handleUpdateComponents}
            handleComponentUpdate={handleComponentUpdate}
            onAddComponent={handleAddComponent}
            selectedComponentId={selectedComponentId}
            setSelectedComponentId={setSelectedComponentId}
            // onManualSave={handleSave}
            // onFooterSettingsClick={onFooterSettingsClick}
          />
        </div>
      </div>
    );
  }
);
