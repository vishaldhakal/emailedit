"use client";

import { useState, useCallback } from "react";
import { EmailComponent } from "@/components/email-component";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";

export function ColumnComponentManager({
  component,
  index,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  totalComponents,
  setSelectedComponent,
}) {
  const handleUpdate = useCallback(
    (updatedData) => {
      onUpdate(updatedData);
      // Don't close the popover - let user close it manually
    },
    [onUpdate]
  );

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
        setSelectedComponent({ component, index });
      }}
    >
      {/* Management Controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="flex gap-1">
          {/* <Popover
            open={isEditing}
            onOpenChange={(isOpen) => setIsEditing(isOpen)}
            modal={true}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-card hover:bg-accent text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                Edit
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-4 bg-card border border-border rounded-lg shadow-lg"
              side="right"
              align="start"
              sideOffset={5}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Edit Component</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="text-xs"
                    >
                      Close
                    </Button>
                  </div>
                  <EmailComponent
                    type={component.type}
                    data={component.data}
                    isEditing={true}
                    onUpdate={handleUpdate}
                    onCancel={handleCancel}
                  />
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover> */}

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
          setSelectedComponent={setSelectedComponent}
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
