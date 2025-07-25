import React from "react";
import { componentMap } from "./email-component";
export function EditorPanel({ selectedComponent, handleComponentUpdate }) {
  if (!selectedComponent.component) {
    return (
      <div className="w-80 bg-card border-l p-4 border-border flex flex-col">
        select a block to see editing properties
      </div>
    );
  }
  const Editor = componentMap[selectedComponent.component.type]?.Editor;

  if (!Editor) {
    return (
      <div className="w-80 border-l border-border bg-muted p-4 text-muted-foreground">
        <p>No editor available for: {selectedComponent.component.type}</p>
      </div>
    );
  }
  return (
    <div className="w-80 bg-card border-l p-4 border-border flex flex-col overflow-y-auto h-full">
      <Editor
        key={selectedComponent.component.id}
        data={selectedComponent.component.data}
        onUpdate={(newData) =>
          handleComponentUpdate(selectedComponent.index, newData)
        }
      />
    </div>
  );
}
