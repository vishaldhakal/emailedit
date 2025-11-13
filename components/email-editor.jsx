"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from "react";
import { EmailCanvas } from "./email-canvas";
import { nanoid } from "nanoid";

export const EmailEditor = forwardRef(
  (
    {
      template,
      _headerVariant, // intentionally unused
      storageKey,
      onComponentsChange,
      initialComponents,
      onSave,
      _isLoading, // intentionally unused
      onSelectionChange,
      onFooterSettingsClick, // Callback for footer settings
    },
    ref
  ) => {
    const MAX_HISTORY_LENGTH = 10; // Reduced for better performance, supports multiple undo/redo steps
    const canvasRef = useRef(null);
    // History array and current pointer
    const [history, setHistory] = useState([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lastSaved, setLastSaved] = useState(Date.now());
    const [selectedComponentId, setSelectedComponentId] = useState(null);

    // Current components is always history[historyIndex]
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

    useEffect(() => {
      if (template) {
        const templateComponents = template.component || [];

        setHistory([templateComponents]);
        setHistoryIndex(0);
        onComponentsChange && onComponentsChange(templateComponents);
      } else if (initialComponents && initialComponents.length > 0) {
        // Update only if different to prevent unnecessary re-renders
        const currentComponents = history[historyIndex];
        if (
          JSON.stringify(currentComponents) !==
          JSON.stringify(initialComponents)
        ) {
          setHistory([initialComponents]);
          setHistoryIndex(0);
          onComponentsChange && onComponentsChange(initialComponents);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template, initialComponents]);

    // No internal autosave; saving handled by parent

    // Optimized deep comparison that properly detects changes including moves
    const areComponentsEqual = useCallback((a, b) => {
      if (!a || !b) return a === b;
      if (a.length !== b.length) return false;

      // First check if IDs match in order (catches moves)
      for (let i = 0; i < a.length; i++) {
        if (a[i].id !== b[i].id) return false;
      }

      // Then check if component data is different (catches updates)
      for (let i = 0; i < a.length; i++) {
        const aStr = JSON.stringify(a[i]);
        const bStr = JSON.stringify(b[i]);
        if (aStr !== bStr) return false;
      }

      return true;
    }, []);

    // Utility to update history on any change
    const pushToHistory = useCallback(
      (newComponents) => {
        const currentComponents = history[historyIndex];

        // Always create a deep copy to avoid reference issues
        const newComponentsCopy = JSON.parse(JSON.stringify(newComponents));

        // Skip if components are truly equal (no actual change)
        if (areComponentsEqual(newComponentsCopy, currentComponents)) {
          return;
        }

        // Cut off any future redo states if user edits after undo
        let newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newComponentsCopy);

        // If history exceeds max length, remove the oldest snapshot
        if (newHistory.length > MAX_HISTORY_LENGTH) {
          newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_LENGTH);
          // Adjust historyIndex if we removed items
          setHistoryIndex(newHistory.length - 1);
        } else {
          setHistoryIndex(newHistory.length - 1);
        }

        // Update history state - this triggers re-render and updates components
        setHistory(newHistory);

        // Notify parent of the change
        onComponentsChange && onComponentsChange(newComponentsCopy);
      },
      [history, historyIndex, areComponentsEqual, onComponentsChange]
    );

    const handleAddComponent = useCallback(
      (type, defaultData) => {
        const newComponent = {
          id: nanoid(),
          type,
          data: defaultData,
        };
        const newComponents = [...components, newComponent];
        pushToHistory(newComponents);
      },
      [components, pushToHistory]
    );

    // Ensure a footer component exists at least once at the end
    // const ensureFooterPresent = useCallback((comps) => {
    //   const list = Array.isArray(comps) ? [...comps] : [];
    //   const hasFooter = list.some((c) => c && c.type === "footer");
    //   if (!hasFooter) {
    //     list.push({ id: nanoid(), type: "footer", data: { html: "" } });
    //   }
    //   return list;
    // }, []);

    // Update individual component
    const handleComponentUpdate = useCallback(
      (id, updatedData) => {
        const newComponents = updateComponentById(components, id, updatedData);
        pushToHistory(newComponents);
      },
      [components, pushToHistory]
    );

    // Recursively search nested components by ID and update
    const updateComponentById = useCallback((components, id, updatedData) => {
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

        // Handle nested column layout: columnsData (array of arrays)
        if (Array.isArray(data?.columnsData)) {
          const updatedColumnsData = data.columnsData.map((column) => {
            if (Array.isArray(column)) {
              return updateComponentById(column, id, updatedData);
            }
            return column;
          });

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

        // Optional fallback: if there’s still a `components` key used
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
    }, []);

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

    // Check if undo is available
    const hasUndo = useMemo(() => {
      return historyIndex > 0;
    }, [historyIndex]);

    // Check if redo is available
    const hasRedo = useMemo(() => {
      return historyIndex < history.length - 1;
    }, [historyIndex, history.length]);

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

    // Global click handler to close editor panels when clicking outside canvas
    /* useEffect(() => {
      const handleGlobalClick = (e) => {
        if (!selectedComponentId) return;

        const target = e.target;
        const canvasElement = canvasRef.current;

        // WHITELIST APPROACH: Don't close if clicking on any interactive or UI elements

        // 1. Don't close if clicking inside the canvas
        if (
          canvasElement?.contains(target) ||
          target.closest("[data-email-canvas]")
        ) {
          return;
        }

        // 2. Don't close if clicking on ANY button, input, select, or form control
        const isFormControl =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.tagName === "BUTTON" ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select") ||
          target.closest("button") ||
          target.closest("label") ||
          target.closest("form");

        if (isFormControl) {
          return;
        }

        // 3. Don't close if clicking on high z-index elements (editor panels, modals)
        if (target.closest(".z-40") || target.closest(".z-50")) {
          return;
        }

        // 4. Don't close if clicking anywhere on Radix UI components
        // This includes portals which are rendered outside the normal DOM tree
        const isRadixUI =
          target.hasAttribute("data-radix-portal") ||
          target.closest("[data-radix-portal]") ||
          target.closest("[data-radix-popper-content-wrapper]") ||
          target.closest("[data-radix-dropdown-content]") ||
          target.closest("[data-radix-select-content]") ||
          target.closest("[data-radix-select-viewport]") ||
          target.closest("[data-radix-select-trigger]") ||
          target.closest("[data-radix-select-item]") ||
          target.closest("[data-radix-dialog-content]") ||
          target.closest("[data-radix-dialog-overlay]") ||
          target.closest("[data-radix-alert-dialog-content]") ||
          target.closest("[data-radix-popover-content]") ||
          target.closest("[data-radix-popover-trigger]") ||
          target.closest("[data-radix-tooltip-content]");

        if (isRadixUI) {
          return;
        }

        // 5. Don't close if clicking on ARIA interactive elements
        const isAriaInteractive =
          target.closest('[role="dialog"]') ||
          target.closest('[role="listbox"]') ||
          target.closest('[role="option"]') ||
          target.closest('[role="combobox"]') ||
          target.closest('[role="menu"]') ||
          target.closest('[role="menuitem"]');

        if (isAriaInteractive) {
          return;
        }

        // 6. Don't close if clicking on navigation
        if (
          target.closest("[data-sidebar]") ||
          target.closest(".sidebar") ||
          target.closest("nav") ||
          target.closest('[role="navigation"]')
        ) {
          return;
        }

        // 7. Don't close if clicking on component editor or portal content
        if (
          target.closest("[data-component-editor]") ||
          target.closest("[data-portal]") ||
          target.closest(".portal")
        ) {
          return;
        }

        // 8. Special check: if the element or any parent has data-state="open"
        // This indicates an open dropdown/menu from Radix
        if (target.closest('[data-state="open"]')) {
          return;
        }

        // 9. Check if any direct child of body with radix attributes
        // (Radix portals are often rendered as direct children of body)
        let currentElement = target;
        while (currentElement && currentElement !== document.body) {
          if (
            currentElement.parentElement === document.body &&
            (currentElement.hasAttribute("data-radix-portal") ||
              currentElement.getAttribute("data-radix-portal") !== null)
          ) {
            return;
          }
          currentElement = currentElement.parentElement;
        }

        // 10. Final safety check: Don't close if there are any open Radix components
        // This catches cases where Radix components are open but we haven't detected them yet
        const hasOpenRadixComponents = document.querySelector(
          '[data-state="open"], [data-radix-select-content], [data-radix-popover-content], [data-radix-dialog-overlay]'
        );
        if (hasOpenRadixComponents) {
          return;
        }

        // If we've passed all checks, it's safe to close the editor
        setSelectedComponentId(null);
      };

      // Use click event in capture phase to intercept early
      document.addEventListener("click", handleGlobalClick, true);

      return () => {
        document.removeEventListener("click", handleGlobalClick, true);
      };
    }, [selectedComponentId]); */

    // Manual save delegates to parent; local fallback available
    const handleSave = useCallback(() => {
      if (onSave) {
        onSave();
      } else {
        manualSave(components);
      }
    }, [components, manualSave, onSave]);

    // Recursively search for a component by ID
    const findComponentById = useCallback((componentsToSearch, id) => {
      for (const component of componentsToSearch) {
        if (component.id === id) {
          return component;
        }
        // Check nested columns
        if (
          component.data?.columnsData &&
          Array.isArray(component.data.columnsData)
        ) {
          for (const column of component.data.columnsData) {
            if (Array.isArray(column)) {
              const found = findComponentById(column, id);
              if (found) return found;
            }
          }
        }
      }
      return null;
    }, []);

    // Get selected component data
    const selectedComponent = useMemo(() => {
      if (!selectedComponentId) return null;
      return findComponentById(components, selectedComponentId);
    }, [components, selectedComponentId, findComponentById]);

    // Get component index for move operations
    const selectedIndex = useMemo(() => {
      if (!selectedComponentId) return -1;
      return components.findIndex((c) => c.id === selectedComponentId);
    }, [components, selectedComponentId]);

    // Expose update handler for external use
    const handleToolbarUpdate = useCallback(
      (updatedData) => {
        if (selectedComponentId) {
          handleComponentUpdate(selectedComponentId, updatedData);
        }
      },
      [selectedComponentId, handleComponentUpdate]
    );

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        getCanvasElement: () => canvasRef.current,
        getCurrentComponents: () => components,
        getLatestComponents: () => history[historyIndex],
        getSelectedComponent: () => {
          if (!selectedComponentId) return null;
          return findComponentById(components, selectedComponentId);
        },
        getSelectedComponentId: () => selectedComponentId,
        updateSelectedComponent: handleToolbarUpdate,
        undo,
        redo,
        hasUndo,
        hasRedo,
      }),
      [
        components,
        history,
        historyIndex,
        selectedComponentId,
        handleToolbarUpdate,
        findComponentById,
        undo,
        redo,
        hasUndo,
        hasRedo,
      ]
    );

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
            onManualSave={handleSave}
            onFooterSettingsClick={onFooterSettingsClick}
          />
        </div>
      </div>
    );
  }
);

// Export as default for lazy loading
export default EmailEditor;
