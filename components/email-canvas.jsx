"use client";

import { useState, useCallback, useEffect, useRef } from "react";
// FIX: Changed import path from "@/components/campaign/EmailComponent" to "./email-component"
import { EmailComponent } from "./email-component";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronUp, ChevronDown, ChevronRight, Copy, Plus } from "lucide-react";
import React from "react";
import { forwardRef } from "react";
import { nanoid } from "nanoid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      onManualSave,
      onFooterSettingsClick, // Callback for footer settings
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragStateRef = useRef({
      isActive: false,
      componentId: null,
      edge: null, // 'top' | 'right' | 'bottom' | 'left'
      startX: 0,
      startY: 0,
      startPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const getContainerPadding = useCallback((component) => {
      const pad = component?.data?.containerPadding || {};
      const toNum = (v, fallback) =>
        typeof v === "number"
          ? v
          : typeof v === "string"
          ? parseInt(v, 10) || fallback
          : fallback;
      return {
        top: toNum(pad.top, 0),
        right: toNum(pad.right, 0),
        bottom: toNum(pad.bottom, 0),
        left: toNum(pad.left, 0),
      };
    }, []);

    const startPaddingDrag = useCallback(
      (e, component, edge) => {
        e.preventDefault();
        e.stopPropagation();
        const padding = getContainerPadding(component);
        dragStateRef.current = {
          isActive: true,
          componentId: component.id,
          edge,
          startX: e.clientX,
          startY: e.clientY,
          startPadding: padding,
        };

        const handleMove = (ev) => {
          const state = dragStateRef.current;
          if (!state.isActive) return;
          const dx = ev.clientX - state.startX;
          const dy = ev.clientY - state.startY;

          const clamp = (n) => Math.max(0, Math.min(96, Math.round(n)));

          // SYMMETRIC PADDING: Both sides move together
          // Left/Right handles: Dragging inward increases BOTH left and right
          // Top/Bottom handles: Dragging inward increases BOTH top and bottom

          let nextPadding = { ...state.startPadding };
          
          if (state.edge === "left") {
            const change = clamp(state.startPadding.left + dx);
            nextPadding.left = change;
            nextPadding.right = change;
          }
          if (state.edge === "right") {
            const change = clamp(state.startPadding.right - dx);
            nextPadding.left = change;
            nextPadding.right = change;
          }
          if (state.edge === "top") {
            const change = clamp(state.startPadding.top + dy);
            nextPadding.top = change;
            nextPadding.bottom = change;
          }
          if (state.edge === "bottom") {
            const change = clamp(state.startPadding.bottom - dy);
            nextPadding.top = change;
            nextPadding.bottom = change;
          }

          const comp = components.find((c) => c.id === state.componentId);
          if (!comp) return;
          const updatedData = {
            ...(comp.data || {}),
            containerPadding: nextPadding,
          };
          handleComponentUpdate(state.componentId, updatedData);
        };

        const endDrag = () => {
          dragStateRef.current.isActive = false;
          document.removeEventListener("mousemove", handleMove);
          document.removeEventListener("mouseup", endDrag);
        };

        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", endDrag);
      },
      [components, getContainerPadding, handleComponentUpdate]
    );

    // Manual save function
    const manualSave = useCallback(() => {
      if (onManualSave) {
        onManualSave();
      } else {
        // Fallback to localStorage
        localStorage.setItem(storageKey, JSON.stringify(components));
        setLastSaved(Date.now());
      }
    }, [components, storageKey, onManualSave]);

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

    // Load saved data on mount only if no initial components are provided
    useEffect(() => {
      // Only load from localStorage if we don't have initial components
      // This prevents localStorage from overriding campaign data
      if (components.length === 0) {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            if (parsedData && parsedData.length > 0) {
              onUpdateComponents(parsedData);
            }
          } catch (error) {
            console.error("Error loading saved data:", error);
          }
        }
      }
    }, []); // Empty dependency array - only run once

    const handleComponentDelete = useCallback(
      (id) => {
        const newComponents = components.filter(
          (component) => component.id !== id
        );
        onUpdateComponents(newComponents);
        setSelectedComponentId(null);
      },
      [components, onUpdateComponents, setSelectedComponentId]
    );

    const handleComponentMove = useCallback(
      (fromIndex, toIndex) => {
        const newComponents = [...components];
        const [movedComponent] = newComponents.splice(fromIndex, 1);
        newComponents.splice(toIndex, 0, movedComponent);
        onUpdateComponents(newComponents);
      },
      [components, onUpdateComponents]
    );

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

    // Recursively regenerate IDs for nested components
    const regenerateIds = useCallback((comp) => {
      const newComp = {
        ...comp,
        id: nanoid(),
      };

      // If this is a column with columnsData, recursively update all nested components
      if (newComp.data && Array.isArray(newComp.data.columnsData)) {
        newComp.data = {
          ...newComp.data,
          columnsData: newComp.data.columnsData.map((column) =>
            Array.isArray(column)
              ? column.map((nestedComp) => regenerateIds(nestedComp))
              : column
          ),
        };
      }

      // If this is a container with components, recursively update them
      if (newComp.type === "container" && Array.isArray(newComp.data?.components)) {
         newComp.data = {
            ...newComp.data,
            components: newComp.data.components.map((nestedComp) => regenerateIds(nestedComp))
         }
      }

      return newComp;
    }, []);

    const handleDrop = useCallback(
      (e) => {
        e.preventDefault();
        setIsDragging(false);

        try {
          const componentData = JSON.parse(
            e.dataTransfer.getData("application/json")
          );

          // Check if this is a template (multiple components)
          if (componentData.type === "template" && componentData.components) {
            // Add all template components with new IDs (including nested ones)
            const templateComponents = componentData.components.map((comp) =>
              regenerateIds(comp)
            );
            const newComponents = [...components, ...templateComponents];
            onUpdateComponents(newComponents);
          } else {
            // Single component drop
            const newComponent = {
              id: nanoid(),
              type: componentData.type,
              data: componentData.defaultData,
            };
            const newComponents = [...components, newComponent];
            onUpdateComponents(newComponents);
          }
        } catch (error) {
          console.error("Error handling drop:", error);
        }
      },
      [components, onUpdateComponents, regenerateIds]
    );

    const handleDropBetween = useCallback(
      (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        try {
          const componentData = JSON.parse(
            e.dataTransfer.getData("application/json")
          );

          // Check if this is a template (multiple components)
          if (componentData.type === "template" && componentData.components) {
            // Add all template components with new IDs (including nested ones)
            const templateComponents = componentData.components.map((comp) =>
              regenerateIds(comp)
            );
            const newComponents = [...components];
            newComponents.splice(index + 1, 0, ...templateComponents);
            onUpdateComponents(newComponents);
          } else {
            // Single component drop
            const newComponent = {
              id: nanoid(),
              type: componentData.type,
              data: componentData.defaultData,
            };
            const newComponents = [...components];
            newComponents.splice(index + 1, 0, newComponent);
            onUpdateComponents(newComponents);
          }
        } catch (error) {
          console.error("Error handling drop between:", error);
        }
      },
      [components, onUpdateComponents, regenerateIds]
    );

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">
              Loading your campaign...
            </p>
          </div>
        </div>
      );
    }

    if (components?.length == 0) {
      return (
        <div className="w-full max-w-[600px] mx-auto py-8 px-4">
          <div
            className="bg-white min-h-[40rem] relative overflow-hidden transition-colors duration-200"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Animated visual cue */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-8 max-w-lg mx-auto px-6">
                {/* Animated arrow pointing from left (sidebar) to center */}
                <div className="flex items-center justify-center gap-6 md:gap-10">
                  {/* Sidebar representation */}
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shadow-sm">
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Animated arrow */}
                  <div className="relative flex items-center">
                    <ChevronRight className="w-12 h-12 md:w-16 md:h-16 text-gray-300 animate-bounce-x" />
                  </div>

                  {/* Canvas representation */}
                  <div className="relative">
                    <div className="w-14 h-16 md:w-16 md:h-20 rounded border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-2.5">
                        <div className="w-10 h-1.5 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="w-7 h-1.5 bg-gray-200 rounded-full animate-pulse delay-100"></div>
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text instruction */}
                <div className="space-y-1 pt-2">
                  <h3 className="text-base md:text-lg font-medium text-gray-700">
                    Drag components from the sidebar
                  </h3>
                </div>
              </div>
            </div>

            {/* Subtle background pattern when dragging */}
            <div
              className={`absolute inset-0 transition-all duration-300 pointer-events-none ${
                isDragging
                  ? "opacity-100 bg-blue-50/40 backdrop-blur-sm"
                  : "opacity-0 bg-transparent"
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-blue-600 text-base font-semibold animate-pulse flex items-center gap-3 bg-white/90 px-6 py-4 rounded-xl shadow-lg border-2 border-blue-400 border-dashed">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Drop here to add component
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-[600px] mx-auto py-8 px-4">
        <div
          ref={ref}
          data-email-canvas
          className={`bg-white min-h-[40rem] transition-all duration-200 p-0 ${
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
            <div
              key={component.id}
              className="relative group/component -mt-[1px] first:mt-0"
            >
              {/* Move Up/Down Buttons - Left Side */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover/component:opacity-100 transition-opacity z-10 flex flex-col gap-1 mr-2">
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComponentMove(index, index - 1);
                    }}
                    className="w-5 h-5 text-black hover:text-slate-900 hover:bg-white hover:scale-110 transition-transform"
                    title="Move up"
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
                    className="w-5 h-5 text-black hover:text-slate-900 hover:bg-white hover:scale-110 transition-transform"
                    title="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Delete Button - Right Side */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full opacity-0 group-hover/component:opacity-100 transition-opacity z-10 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComponentDelete(component.id);
                  }}
                  className="w-6 h-6 text-red-600 hover:text-red-700 hover:bg-white"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>

              <div
                data-component-index={index}
                className="relative transition-all"
                onClick={(e) => {
                  // Prevent link navigation during editing
                  if (e.target.closest("a")) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Select component instead of navigating
                    setSelectedComponentId(component.id);
                    return;
                  }
                  // Don't select if clicking on footer settings button
                  if (
                    e.target.closest(
                      'button[title="Configure Footer Settings"]'
                    )
                  ) {
                    return;
                  }
                  e.stopPropagation();
                  setSelectedComponentId(component.id);
                }}
              >
                {/* Container padding wrapper with selection handles */}
                {(() => {
                  const pad = getContainerPadding(component);
                  const isSelected = selectedComponentId === component.id;
                  const isDraggingThis = dragStateRef.current.isActive && dragStateRef.current.componentId === component.id;
                  
                  return (
                    <div className={`relative ${isSelected ? "z-30" : ""}`}>
                      {/* Padding wrapper */}
                      <div
                        className="relative group"
                        style={{
                          paddingTop: pad.top,
                          paddingRight: pad.right,
                          paddingBottom: pad.bottom,
                          paddingLeft: pad.left,
                          minHeight: 28,
                          transition: isDraggingThis ? "none" : "padding 100ms ease-out",
                          borderRadius: 0,
                        }}
                      >
                        {/* Hover border */}
                        {!isSelected && (
                          <div className="pointer-events-none absolute inset-0 border-2 border-purple-300/60 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                        )}
                        
                        {/* Selected border */}
                        {isSelected && (
                          <div className="pointer-events-none absolute inset-0 border-2 border-purple-400/70 z-20" />
                        )}
                        
                        {/* Actual component */}
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
                          onSettingsClick={
                            component.type === "footer" && onFooterSettingsClick
                              ? () => {
                                  if (onFooterSettingsClick) {
                                    onFooterSettingsClick();
                                  }
                                }
                              : undefined
                          }
                        />
                      </div>

                      {/* Drag handles - outside padding wrapper, positioned absolutely to parent */}
                      {isSelected && (
                        <>
                          {/* Live padding indicator */}
                          {isDraggingThis && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                              <div className="bg-slate-900/95 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-semibold backdrop-blur-sm border border-slate-600">
                                {(dragStateRef.current.edge === 'left' || dragStateRef.current.edge === 'right') && 
                                  `↔ ${pad.left}px`}
                                {(dragStateRef.current.edge === 'top' || dragStateRef.current.edge === 'bottom') && 
                                  `↕ ${pad.top}px`}
                              </div>
                            </div>
                          )}

                          {/* Left handle */}
                          <div
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startPaddingDrag(e, component, "left");
                            }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-10 bg-purple-500 hover:bg-purple-600 rounded-full shadow-md hover:shadow-lg hover:scale-125 transition-all cursor-ew-resize z-50"
                            style={{ touchAction: 'none' }}
                            title="Drag right to increase padding"
                          />
                          
                          {/* Right handle */}
                          <div
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startPaddingDrag(e, component, "right");
                            }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-10 bg-purple-500 hover:bg-purple-600 rounded-full shadow-md hover:shadow-lg hover:scale-125 transition-all cursor-ew-resize z-50"
                            style={{ touchAction: 'none' }}
                            title="Drag left to increase padding"
                          />
                          
                          {/* Top handle */}
                          <div
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startPaddingDrag(e, component, "top");
                            }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-3 bg-purple-500 hover:bg-purple-600 rounded-full shadow-md hover:shadow-lg hover:scale-125 transition-all cursor-ns-resize z-50"
                            style={{ touchAction: 'none' }}
                            title="Drag down to increase padding"
                          />
                          
                          {/* Bottom handle */}
                          <div
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startPaddingDrag(e, component, "bottom");
                            }}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-3 bg-purple-500 hover:bg-purple-600 rounded-full shadow-md hover:shadow-lg hover:scale-125 transition-all cursor-ns-resize z-50"
                            style={{ touchAction: 'none' }}
                            title="Drag up to increase padding"
                          />
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Drop zone at bottom of each component - enhanced with visual indicator */}
              <div
                data-drop-zone
                className={`transition-all duration-200 group/dropzone relative ${
                  isDragging ? "h-12 opacity-100" : "h-0 opacity-0"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.dataTransfer.dropEffect = "copy";
                  // Add hover state by adding a class
                  e.currentTarget.classList.add("bg-blue-200");
                }}
                onDragLeave={(e) => {
                  // Remove hover state
                  e.currentTarget.classList.remove("bg-blue-200");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove("bg-blue-200");
                  handleDropBetween(e, index);
                }}
              >
                {/* Visual drop indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                    <svg
                      className="w-4 h-4 animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Drop here</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Main canvas drop zone at the end */}
          {components.length > 0 && isDragging && (
            <div
              data-drop-zone="main"
              className="h-16 transition-all duration-200 relative"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = "copy";
                e.currentTarget.classList.add("bg-blue-200");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("bg-blue-200");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove("bg-blue-200");
                handleDrop(e);
              }}
            >
              {/* Visual drop indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                  <svg
                    className="w-4 h-4 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Drop here</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

EmailCanvas.displayName = "EmailCanvas";
