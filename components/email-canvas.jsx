"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { EmailComponent } from "./email-component";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import React from "react";
import { forwardRef } from "react";

import { ChevronUp, ChevronDown } from "lucide-react";
import AddComponent from "./addComponent";
import { nanoid } from "nanoid";
export const EmailCanvas = forwardRef(
  (
    {
      components,
      handleComponentUpdate,
      onUpdateComponents,
      onAddComponent,
      setSelectedComponentId,
      storageKey,
      setLastSaved,
      selectedComponentId,
      loading,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const isAddingComponentRef = useRef(false);
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

          console.log("Loaded saved data");
        } catch (error) {
          console.error("Error loading saved data:", error);
        }
      }
    }, []); // Empty dependency array - only run once

    // Listen for column drop events to reset drag state
    useEffect(() => {
      const handleColumnDropEnd = () => {
        setIsDragging(false);
      };

      document.addEventListener("column-drop-end", handleColumnDropEnd);
      return () => {
        document.removeEventListener("column-drop-end", handleColumnDropEnd);
      };
    }, []);

    const handleComponentDelete = (id) => {
      const newComponents = components.filter(
        (component) => component.id !== id
      );
      onUpdateComponents(newComponents);
      setSelectedComponentId(null);
    };

    const handleComponentMove = (fromIndex, toIndex) => {
      const newComponents = [...components];
      const [movedComponent] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, movedComponent);
      onUpdateComponents(newComponents);
    };

    const handleDragOver = useCallback((e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
      // Only set dragging to false if we're leaving the main container
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsDragging(false);
      }
    }, []);

    const handleDragEnd = useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
      (e) => {
        e.preventDefault();
        setIsDragging(false);
        isAddingComponentRef.current = true;
        try {
          const componentData = JSON.parse(
            e.dataTransfer.getData("application/json")
          );
          const newComponent = {
            id: nanoid(),
            type: componentData.type,
            data: componentData.defaultData,
          };
          const newComponents = [...components, newComponent];
          onUpdateComponents(newComponents);
          // Reset flag after a short delay
          setTimeout(() => {
            isAddingComponentRef.current = false;
          }, 100);
        } catch (error) {
          console.error("Error handling drop:", error);
          isAddingComponentRef.current = false;
        }
      },
      [components, onUpdateComponents]
    );

    const handleDropBetween = useCallback(
      (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        isAddingComponentRef.current = true;
        try {
          const componentData = JSON.parse(
            e.dataTransfer.getData("application/json")
          );
          const newComponent = {
            id: nanoid(),
            type: componentData.type,
            data: componentData.defaultData,
          };
          const newComponents = [...components];
          newComponents.splice(index + 1, 0, newComponent);
          onUpdateComponents(newComponents);
          // Reset flag after a short delay
          setTimeout(() => {
            isAddingComponentRef.current = false;
          }, 100);
        } catch (error) {
          console.error("Error handling drop between:", error);
          isAddingComponentRef.current = false;
        }
      },
      [components, onUpdateComponents]
    );

    if (loading) {
      return (
        <div className="flex items-center justify-center h-full w-full">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      );
    }

    if (components?.length == 0) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="w-full max-w-xl">
            <div
              className="bg-white/80 backdrop-blur p-10 rounded-2xl border-2 border-dashed border-slate-300 shadow-sm text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-black">
                Design your email
              </h2>
              <p className="mt-2 text-slate-600">
                Drag components from the sidebar to begin designing.
              </p>
              <div className="mt-4 text-sm text-slate-500">
                <p>• Drag & drop components anywhere</p>
                <p>• Click to select and edit</p>
                <p>• Use drag handles to reorder</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className=" w-full max-w-3xl  mx-auto px-14 py-8 ">
        <div
          ref={ref}
          data-email-canvas
          className={`bg-white rounded-2xl shadow-xl border border-slate-200/60 backdrop-blur-sm transition-all duration-200 py-6 ${
            isDragging ? "border-blue-400 bg-blue-50/30" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          onDrop={(e) => {
            // Only handle drop on main canvas if no drop zone was targeted
            if (!e.target.closest("[data-drop-zone]")) {
              handleDrop(e);
            }
          }}
        >
          {components?.map((component, index) => (
            <div key={component.id} className="mb-1">
              <div
                data-component-index={index}
                className="relative group/outer px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedComponentId(component.id);
                }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -right-10 opacity-0 group-hover/outer:opacity-100 transition-opacity z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComponentDelete(component.id);
                    }}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 shadow-lg bg-white border border-red-200 hover:scale-110 transition-transform duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <EmailComponent
                  id={component.id}
                  key={component.id}
                  selectedComponentId={selectedComponentId}
                  setSelectedComponentId={setSelectedComponentId}
                  type={component.type}
                  data={component.data}
                  onUpdate={(updatedData) =>
                    handleComponentUpdate(component.id, updatedData)
                  }
                />

                {/* Drag handles for reordering */}
                <div className="absolute top-1/2 -left-10 -translate-y-1/2 transform opacity-0 group-hover/outer:opacity-100 transition-opacity z-10">
                  <div className="flex flex-col gap-2">
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComponentMove(index, index - 1);
                        }}
                        className="w-8 h-8 bg-white border border-slate-200 hover:bg-slate-50 shadow-lg hover:scale-110 transition-transform duration-200"
                      >
                        <ChevronUp className="h-4 w-4 text-slate-600" />
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
                        className="w-8 h-8 bg-white border border-slate-200 hover:bg-slate-50 shadow-lg hover:scale-110 transition-transform duration-200"
                      >
                        <ChevronDown className="h-4 w-4 text-slate-600" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Drop zone at bottom of each component */}
              <div
                data-drop-zone
                className={`transition-all duration-200 rounded-lg mx-4 group/dropzone relative ${
                  isDragging
                    ? "h-3 opacity-100 bg-blue-100"
                    : "h-0 opacity-0 hover:opacity-100 hover:bg-blue-100 hover:border-2 hover:border-dashed hover:border-blue-300"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.dataTransfer.dropEffect = "copy";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDropBetween(e, index);
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
