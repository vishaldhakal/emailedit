"use client";

import { useState, useCallback, useEffect } from "react";
import { EmailComponent } from "./email-component";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronUp, ChevronDown } from "lucide-react";
import AddComponent from "./addComponent";
import { nanoid } from "nanoid";
export function EmailCanvas({
  components,
  handleComponentUpdate,
  onUpdateComponents,
  onAddComponent,
  setSelectedComponentId,
  storageKey,
}) {
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [formattedTime, setFormattedTime] = useState("");

  // Auto-save function
  const autoSave = useCallback(() => {
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(components));
    setLastSaved(Date.now());
    console.log("Auto-saved at:", new Date().toLocaleTimeString());
  }, [components]);

  // Auto-save when components change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(autoSave, 1000); // Auto-save after 1 second of no changes
    return () => clearTimeout(timeoutId);
  }, [components, autoSave]);

  // Load saved data on mount (only once)
  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        onUpdateComponents(parsedData);
        console.log(parsedData);
        console.log("Loaded saved data");
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []); // Empty dependency array - only run once

  // Format timestamp for display (client-side only)
  useEffect(() => {
    setFormattedTime(new Date(lastSaved).toLocaleTimeString());
  }, [lastSaved]);

  const handleComponentDelete = (id) => {
    const newComponents = components.filter((component) => component.id !== id);
    onUpdateComponents(newComponents);
    setSelectedComponentId(null);
  };

  const handleComponentMove = (fromIndex, toIndex) => {
    const newComponents = [...components];
    const [movedComponent] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, movedComponent);
    onUpdateComponents(newComponents);
  };

  const handleComponentClick = (component) => {
    onAddComponent(component.type, component.defaultData);
  };
  const handleInbetweenAdd = (component, columnId, index) => {
    const newComponent = {
      id: nanoid(),
      type: component.type,
      data: component.defaultData,
    };
    const newComponents = [...components];
    newComponents.splice(index + 1, 0, newComponent); // Insert after current index
    onUpdateComponents(newComponents);
  };

  const handleClearAll = () => {
    onUpdateComponents([]);
  };

  if (components?.length == 0) {
    return (
      <div className=" w-full p-6 max-w-4xl mx-auto">
        <AddComponent handleComponentClick={handleComponentClick} />
      </div>
    );
  }
  return (
    <div className="flex-1 h-full bg-background border-l border-border overflow-y-auto">
      <div className=" p-6 max-w-4xl mx-auto">
        <div className="flex mb-4 gap-5 items-center ">
          {formattedTime && (
            <div className="text-sm text-muted-foreground">
              Last saved: {formattedTime}
            </div>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-sm transform hover:scale-105 transition-all duration-150 rounded-md px-3 py-1">
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
              </DialogHeader>

              <p className="mt-2 mb-4 text-sm">
                This will remove all components. This action cannot be undone.
              </p>

              <DialogFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={handleClearAll}>
                  Yes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {components.map((component, index) => (
          <div
            key={component.id}
            data-component-index={index}
            className="relative group/outer  mb-4 border-2 border-transparent hover:border-primary rounded-lg transition-colors  transition-padding
   "
            onClick={(e) => {
              e.stopPropagation();
              setSelectedComponentId(component.id);
            }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -right-12 opacity-0 group-hover/outer:opacity-100 transition-opacity z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleComponentDelete(component.id);
                }}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <EmailComponent
              key={component.id}
              setSelectedComponentId={setSelectedComponentId}
              type={component.type}
              data={component.data}
              onUpdate={(updatedData) =>
                handleComponentUpdate(component.id, updatedData)
              }
            />

            {/* circluar add component icon below component */}
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className=" absolute -bottom-4 left-1/2  cursor-pointer w-3 h-3 rounded-full opacity-0 group-hover/outer:opacity-100  "
            >
              <AddComponent
                inbetween
                index={index}
                handleComponentClick={handleInbetweenAdd}
              />
            </div>

            {/* Drag handles for reordering */}
            <div className="  absolute top-1/2 -left-12 -translate-y-1/2 transform opacity-0 group-hover/outer:opacity-100 transition-opacity z-10">
              <div className="flex flex-col gap-1">
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComponentMove(index, index - 1);
                    }}
                    className=" w-8 h-8 bg-card hover:bg-accent "
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                )}

                {index < components.length - 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComponentMove(index, index + 1);
                    }}
                    className="w-8 h-8  bg-card hover:bg-accent"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
