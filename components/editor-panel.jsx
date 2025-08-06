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
