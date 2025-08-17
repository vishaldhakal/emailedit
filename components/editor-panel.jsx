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
      <div className=" border-l border-border bg-muted  text-muted-foreground">
        <p>No editor available for: {selectedComponent.type}</p>
      </div>
    );
  }
  return (
    <div className=" h-14 bg-red  border-l  border-border flex flex-col ">
      <Editor
        key={selectedComponent.id}
        data={selectedComponent.data}
        onUpdate={(newData) =>
          handleComponentUpdate(selectedComponent.id, newData)
        }
      />
    </div>
  );
}
