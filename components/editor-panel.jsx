import React from "react";
import { componentMap } from "./email-component";

const nestedKeys = [
  "components",
  "leftComponents",
  "rightComponents",
  "column1Components",
  "column2Components",
  "column3Components",
  "column4Components",
];

export function findComponentById(components, id) {
  if (!Array.isArray(components)) return null;

  for (const component of components) {
    if (component.id === id) {
      return component;
    }

    for (const key of nestedKeys) {
      if (component.data && Array.isArray(component.data[key])) {
        const found = findComponentById(component.data[key], id);
        if (found) return found;
      }
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
  console.log(selectedComponent);

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-card border-l p-4 border-border flex flex-col">
        select a block to see editing properties
      </div>
    );
  }
  const Editor = componentMap[selectedComponent.type]?.Editor;

  if (!Editor) {
    return (
      <div className="w-80 border-l border-border bg-muted p-4 text-muted-foreground">
        <p>No editor available for: {selectedComponent.type}</p>
      </div>
    );
  }
  return (
    <div className="w-80 bg-card border-l p-4 border-border flex flex-col overflow-y-auto h-full">
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
