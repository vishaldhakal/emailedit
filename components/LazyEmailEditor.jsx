"use client";

import { lazy, Suspense, useState, useEffect, forwardRef } from "react";
import { Loader2 } from "lucide-react";

// Lazy load the EmailEditor component
const EmailEditor = lazy(() => import("./email-editor"));

export const LazyEmailEditor = forwardRef(
  (
    {
      template,
      headerVariant,
      storageKey,
      onComponentsChange,
      initialComponents,
      onSave,
      isLoading,
      onSelectionChange,
      onFooterSettingsClick, // Callback for footer settings
    },
    ref
  ) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      // Preload the component when needed
      const preloadComponent = async () => {
        try {
          await import("./email-editor");
          setIsLoaded(true);
        } catch (error) {
          console.error("Failed to preload EmailEditor:", error);
        }
      };

      preloadComponent();
    }, []);

    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Loading Email Editor
                </h3>
                <p className="text-gray-600">
                  Preparing your design workspace...
                </p>
              </div>
            </div>
          </div>
        }
      >
        <EmailEditor
          ref={ref}
          template={template}
          headerVariant={headerVariant}
          storageKey={storageKey}
          onComponentsChange={onComponentsChange}
          initialComponents={initialComponents}
          onSave={onSave}
          isLoading={isLoading}
          onSelectionChange={onSelectionChange}
          onFooterSettingsClick={onFooterSettingsClick}
        />
      </Suspense>
    );
  }
);
