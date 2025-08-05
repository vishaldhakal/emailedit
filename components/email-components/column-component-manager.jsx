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
      className="relative group border-2 border-transparent hover:border-primary/30 rounded-lg transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponentId(component.id);
      }}
    >
      {/* Management Controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="bg-card hover:bg-destructive/10 text-destructive hover:text-destructive text-xs"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Component Content */}
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
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          {index > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMoveUp}
              className="bg-card hover:bg-accent text-xs"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
          )}
          {index < totalComponents - 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMoveDown}
              className="bg-card hover:bg-accent text-xs"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
