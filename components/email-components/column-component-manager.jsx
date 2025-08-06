"use client";

import { EmailComponent } from "@/components/email-component";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import React from "react";

export function ColumnComponentManager({
  component,
  index,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  totalComponents,
  setSelectedComponentId,
}) {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(index);
  };

  const handleMoveUp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onMoveUp(index);
  };

  const handleMoveDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onMoveDown(index);
  };

  return (
    <div
      className="relative group/inner border-2 border-transparent hover:border-primary/30 rounded-lg transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponentId(component.id);
      }}
    >
      <div className="absolute top-1/2 -translate-y-1/2 -right-8 z-10 opacity-0  group-hover/inner:opacity-100 transition-colors">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="text-destructive hover:bg-destructive/20 hover:text-destructive transition-colors"
        >
          <Trash2 className="h-2 w-2" />
        </Button>
      </div>

      <div className="p-2">
        <EmailComponent
          key={component.id}
          setSelectedComponentId={setSelectedComponentId}
          type={component.type}
          data={component.data}
          onUpdate={onUpdate}
        />
      </div>

      {/* Move Controls */}
      <div className="absolute top-1/2 -left-5 -translate-y-1/2 transform opacity-0 group-hover/inner:opacity-100 transition-opacity z-10">
        <div className="flex flex-col items-center gap-[2px] bg-muted px-1 py-[2px] rounded-md shadow-sm">
          {index > 0 && (
            <ChevronUp
              className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleMoveUp(e);
              }}
            />
          )}
          {index < totalComponents - 1 && (
            <ChevronDown
              className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleMoveDown(e);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
