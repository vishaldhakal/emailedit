import React from "react";
import { componentMap } from "./email-component";

export function findComponentById(components, id) {
  if (!Array.isArray(components)) return null;

  for (const component of components) {
    if (component.id === id) {
      return component;
    }

    const data = component.data;

    // Check if this is a "column" layout with columnsData
    if (data?.columnsData && Array.isArray(data.columnsData)) {
      for (const column of data.columnsData) {
        if (Array.isArray(column)) {
          const found = findComponentById(column, id); // recurse into inner components
          if (found) return found;
        }
      }
    }

    // In case some components still use nested children
    if (data?.components && Array.isArray(data.components)) {
      const found = findComponentById(data.components, id);
      if (found) return found;
    }
  }

  return null;
}

export function EditorPanel({
  selectedComponentId,
  handleComponentUpdate,
  components,
}) {
  const selectedComponent = findComponentById(components, selectedComponentId);
  if (!selectedComponent) {
    return null;
  }

  const Editor = componentMap[selectedComponent.type]?.Editor;

  if (!Editor) {
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-5xl bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 text-black shadow-lg rounded-2xl px-4 py-3">
        <p className="text-sm">
          No editor available for: {selectedComponent.type}
        </p>
      </div>
    );
  }
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-5xl bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 text-black shadow-lg rounded-2xl px-4 py-3">
      <div className="w-full overflow-x-auto">
        <Editor
          key={selectedComponent.id}
          data={selectedComponent.data}
          onUpdate={(newData) =>
            handleComponentUpdate(selectedComponent.id, newData)
          }
        />
      </div>
    </div>
  );
}
