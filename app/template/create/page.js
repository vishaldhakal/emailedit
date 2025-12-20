"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LazyEmailEditor } from "@/components/LazyEmailEditor";
import { ComponentSidebar } from "@/components/componentSidebar";
import { UnifiedEditingToolbar } from "@/components/UnifiedEditingToolbar";
import { generateHtml } from "@/lib/export-html";
import { ChevronLeft, Eye } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { InlineEditableTitle } from "@/components/InlineEditableTitle";

const DRAFT_STORAGE_KEY = "template_create_draft";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [components, setComponents] = useState([]);
  const [latestComponents, setLatestComponents] = useState([]); // Track latest components from EmailEditor
  const [formData, setFormData] = useState({
    name: "",
  });
  const emailEditorRef = useRef(null);
  const [isTemplateUploading, setIsTemplateUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [undoRedoState, setUndoRedoState] = useState({
    canUndo: false,
    canRedo: false,
  });
  const [footerSettings, setFooterSettings] = useState(null);
  const [showFooterSettings, setShowFooterSettings] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isNavigatingAwayRef = useRef(false);

  const previewModalRef = useRef(null);

  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    try {
      const draft = {
        components: latestComponents.length > 0 ? latestComponents : components,
        formData,
        footerSettings,
        timestamp: Date.now(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }, [latestComponents, components, formData, footerSettings]);

  // Load draft from localStorage
  const loadDraft = useCallback(() => {
    try {
      const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draftJson) {
        const draft = JSON.parse(draftJson);
        if (draft.components && draft.components.length > 0) {
          setComponents(draft.components);
          setLatestComponents(draft.components);
        }
        if (draft.formData) {
          setFormData(draft.formData);
        }
        if (draft.footerSettings) {
          setFooterSettings(draft.footerSettings);
        }
        setHasUnsavedChanges(true);
        return true;
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
    return false;
  }, []);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  }, []);

  // Check if there are meaningful unsaved changes
  const hasMeaningfulChanges = useCallback(() => {
    const hasComponents = (latestComponents.length > 0 || components.length > 0);
    const hasName = formData.name && formData.name.trim();
    return hasComponents || hasName;
  }, [latestComponents, components, formData.name]);

  // Auto-save draft when components or formData changes
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    // Debounce auto-save
    const timeoutId = setTimeout(() => {
      if (hasMeaningfulChanges()) {
        saveDraft();
      } else {
        // Clear draft if there's nothing meaningful
        clearDraft();
      }
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [latestComponents, components, formData, isInitialLoad, saveDraft, hasMeaningfulChanges, clearDraft]);

  // Load draft on mount
  useEffect(() => {
    const hasDraft = loadDraft();
    if (hasDraft) {
      toast.info("Draft restored", {
        description: "Your previous work has been restored",
      });
    }
  }, [loadDraft]);

  // Save draft when tab becomes hidden (user switching tabs or closing)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasMeaningfulChanges() && !isNavigatingAwayRef.current) {
        // Save draft when tab becomes hidden
        saveDraft();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [latestComponents, components, formData, saveDraft, hasMeaningfulChanges]);

  // Warn user before page refresh/close if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasMeaningfulChanges() && !isNavigatingAwayRef.current) {
        // Save draft one more time before leaving
        saveDraft();
        e.preventDefault();
        e.returnValue = ""; // Chrome requires returnValue to be set
        return ""; // For older browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [latestComponents, components, formData, saveDraft, hasMeaningfulChanges]);

  // Handle browser back button - auto-save before navigating
  useEffect(() => {
    const handleRouteChange = () => {
      if (hasMeaningfulChanges() && !isNavigatingAwayRef.current) {
        isNavigatingAwayRef.current = true;
        saveDraft();
        toast.info("Draft saved automatically", {
          description: "Your work has been saved as a draft",
        });
      }
    };

    // Listen to router events
    const handlePopState = () => {
      handleRouteChange();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [latestComponents, components, formData, saveDraft, hasMeaningfulChanges]);

  // Handle manual navigation (back button click)
  const handleBackClick = useCallback(() => {
    if (hasMeaningfulChanges()) {
      isNavigatingAwayRef.current = true;
      saveDraft();
      toast.info("Draft saved automatically", {
        description: "Your work has been saved as a draft",
      });
    }
    router.push("/");
  }, [latestComponents, components, formData, saveDraft, router, hasMeaningfulChanges]);

  // Handle ESC key to close preview
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (showPreview) {
          setShowPreview(false);
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showPreview]);

  // Cleanup thumbnail preview object URL
  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  // Sync undo/redo state with EmailEditor
  useEffect(() => {
    const syncUndoRedoState = () => {
      if (emailEditorRef.current) {
        setUndoRedoState({
          canUndo: emailEditorRef.current.hasUndo || false,
          canRedo: emailEditorRef.current.hasRedo || false,
        });
      }
    };

    // Sync on mount and when components change
    syncUndoRedoState();

    // Also sync periodically to catch state changes
    const interval = setInterval(syncUndoRedoState, 200);
    return () => clearInterval(interval);
  }, [components, latestComponents]);

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setThumbnailFile(file);

    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreview(objectUrl);
  };

  const getThumbnailForUpload = async () => {
    if (thumbnailFile) {
      return thumbnailFile;
    }

    if (!emailEditorRef.current) return null;
    const canvasEl = emailEditorRef.current.getCanvasElement();
    if (!canvasEl) return null;

    const snapshotCanvas = await html2canvas(canvasEl, {
      useCORS: true,
      allowTaint: false,
    });

    const blob = await new Promise((resolve) =>
      snapshotCanvas.toBlob(resolve, "image/png")
    );

    return blob;
  };

  const handleSaveDesign = async () => {
    setIsLoading(true);
    try {
      // Use latestComponents instead of components to ensure we save the most recent state
      // Fallback to ref if latestComponents is empty
      let componentsToSave =
        latestComponents.length > 0 ? latestComponents : components;

      // Additional fallback: try to get components from EmailEditor ref
      if (componentsToSave.length === 0 && emailEditorRef.current) {
        const refComponents = emailEditorRef.current.getCurrentComponents();
        if (refComponents && refComponents.length > 0) {
          componentsToSave = refComponents;
        }
      }

      const html = generateHtml(componentsToSave || [], footerSettings || null);

      // Only send changed fields, ensure name/subject are not empty
      const submitData = {};

      // Only include name if it's not empty
      if (formData.name && formData.name.trim()) {
        submitData.name = formData.name.trim();
      }

      // Only include subject if it's not empty
      if (formData.subject && formData.subject.trim()) {
        submitData.subject = formData.subject.trim();
      }

      // Always include components and message
      submitData.components = componentsToSave;
      submitData.message = html;

      // Use React Query mutation to update campaign
      await updateCampaign({
        id: campaignId,
        data: submitData,
      });

      // Update local cache immediately for better UX
      updateCampaignCache(submitData);

      // Update local state to reflect the saved state
      setComponents(componentsToSave);
      setLatestComponents(componentsToSave);

      toast.success("Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
      toast.error(error.message || "Failed to save design");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailGenerated = (newComponents) => {
    setComponents(newComponents);
    setLatestComponents(newComponents);
    toast.success("Design updated with AI generated content");
  };

  const openPreview = () => {
    try {
      // Use latestComponents for preview as well
      const componentsToPreview =
        latestComponents.length > 0 ? latestComponents : components;
      const html = generateHtml(componentsToPreview || []);
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <style>
    /* Basic email-safe resets for preview */
    body { margin: 0 ; padding: 0; background: #f6f7f9; }
    .preview-wrapper { padding: 0; }
    .preview-canvas { max-width: 720px; margin: 30px auto;border-radius: 8px; overflow: hidden; }
  </style>
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  </head>
  <body>
    <div class="preview-wrapper">
      <div class="preview-canvas">${html}</div>
    </div>
  </body>
</html>`;
      setPreviewHtml(fullHtml);
      setShowPreview(true);
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate preview");
    }
  };

  const handleTemplateUpload = async () => {
    if (!formData?.name?.trim())
      return toast.error("Please enter a template name");
    if (!latestComponents || latestComponents.length === 0)
      return toast.error("Cannot save empty template");

    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("component", JSON.stringify(latestComponents));
    const thumbnail = await getThumbnailForUpload();
    if (thumbnail) {
      uploadData.append("thumbnail", thumbnail);
    }
    try {
      setIsTemplateUploading(true);
      const res = await fetch("https://api.salesmonk.ca/api/templates/", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) throw new Error("Failed to upload template");

      // Clear draft after successful save
      clearDraft();
      isNavigatingAwayRef.current = true;
      
      toast.success("Template uploaded");
      setLatestComponents([]);
      setComponents([]);

      router.push("/");
    } catch (err) {
      toast.error(err.message || "Error uploading template");
    } finally {
      setIsTemplateUploading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white h-screen overflow-hidden">
      <div className="flex h-full overflow-hidden">
        {/* Left Sidebar - Header + Component Library */}
        <div className="w-fit bg-white flex flex-col flex-shrink-0 h-full overflow-hidden">
          {/* Campaign Header - Left Side for Design Mode - Fixed */}
          <div className="flex-shrink-0 border-b border-gray-100 bg-white px-4 py-1.5 z-10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={handleBackClick}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </Button>
                <InlineEditableTitle
                  value={formData.name || "Untitled"}
                  onSave={async (newName) => {
                    try {
                      setFormData((p) => ({ ...p, name: newName }));
                      toast.success("Campaign name updated successfully!");
                    } catch (e) {
                      console.error(e);
                      toast.error(
                        e.message || "Failed to update campaign name"
                      );
                    }
                  }}
                  placeholder="Untitled Campaign"
                />
              </div>
              {/* Auto-save Status Indicator */}
              {/* <div className="flex items-center gap-2 text-xs text-gray-600">
                {combinedSaveStatus.isSaving ? (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                    <span className="text-blue-600 font-medium">Saving...</span>
                  </div>
                ) : combinedSaveStatus.error ? (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                    <span className="text-red-600 font-medium">
                      Save failed
                    </span>
                  </div>
                ) : combinedSaveStatus.lastSaved ? (
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-green-600 font-medium">Saved</span>
                  </div>
                ) : null}
              </div> */}
            </div>
          </div>

          {/* Component Library - Scrollable - Isolated */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
            <ComponentSidebar
              onUndo={() => {
                if (emailEditorRef.current?.undo) {
                  emailEditorRef.current.undo();
                  // Update state after undo with a small delay to ensure state is updated
                  requestAnimationFrame(() => {
                    if (emailEditorRef.current) {
                      setUndoRedoState({
                        canUndo: emailEditorRef.current.hasUndo || false,
                        canRedo: emailEditorRef.current.hasRedo || false,
                      });
                    }
                  });
                }
              }}
              onRedo={() => {
                if (emailEditorRef.current?.redo) {
                  emailEditorRef.current.redo();
                  // Update state after redo with a small delay to ensure state is updated
                  requestAnimationFrame(() => {
                    if (emailEditorRef.current) {
                      setUndoRedoState({
                        canUndo: emailEditorRef.current.hasUndo || false,
                        canRedo: emailEditorRef.current.hasRedo || false,
                      });
                    }
                  });
                }
              }}
              canUndo={undoRedoState.canUndo}
              canRedo={undoRedoState.canRedo}
              onAction={handleTemplateUpload}
              mode="create"
              isTemplateUploading={isTemplateUploading}
              thumbnailPreview={thumbnailPreview}
              existingThumbnailUrl={null}
              onThumbnailChange={handleThumbnailChange}
              onPreview={openPreview}
            />
          </div>
        </div>

        {/* Right Canvas Area - Dark Background */}
        <div className="flex-1 relative bg-gray-100 flex flex-col h-full overflow-hidden min-w-0">
          {/* Unified Editing Toolbar */}
          <div className="sticky top-0 z-30 flex-shrink-0 border-b border-gray-200 bg-gray-50/80 backdrop-blur">
            <UnifiedEditingToolbar
              selectedComponent={selectedComponent}
              onUpdate={(updatedData) => {
                if (emailEditorRef.current?.updateSelectedComponent) {
                  emailEditorRef.current.updateSelectedComponent(updatedData);
                  // Refresh selected component after update
                  setTimeout(() => {
                    if (emailEditorRef.current) {
                      const updated =
                        emailEditorRef.current.getSelectedComponent();
                      setSelectedComponent(updated);
                    }
                  }, 0);
                }
              }}
              onEmailGenerated={handleEmailGenerated}
            />
          </div>

          {/* Canvas Content - Scrollable - Isolated */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative min-h-0">
            <LazyEmailEditor
              ref={emailEditorRef}
              key={`campaign`} // Force re-mount when campaign changes
              headerVariant="minimal"
              storageKey={`design_campaign_editor`}
              onComponentsChange={(val) => {
                setComponents(val);
                setLatestComponents(val); // Update latest components whenever EmailEditor changes them
                // Update undo/redo state after a brief delay to ensure EmailEditor has updated
                setTimeout(() => {
                  if (emailEditorRef.current) {
                    setUndoRedoState({
                      canUndo: emailEditorRef.current.hasUndo || false,
                      canRedo: emailEditorRef.current.hasRedo || false,
                    });
                  }
                }, 0);
              }}
              initialComponents={components}
              onSave={handleSaveDesign}
              isLoading={isLoading}
              onSelectionChange={(componentId) => {
                // Update selected component when selection changes in EmailEditor
                if (componentId && emailEditorRef.current) {
                  // Use a small timeout to ensure EmailEditor has updated its state
                  setTimeout(() => {
                    if (emailEditorRef.current) {
                      const comp =
                        emailEditorRef.current.getSelectedComponent();
                      setSelectedComponent(comp);
                    }
                  }, 0);
                } else {
                  setSelectedComponent(null);
                }
              }}
              onFooterSettingsClick={() => {
                console.log("Opening footer settings modal");
                setShowFooterSettings(true);
              }}
            />
          </div>

        </div>
      </div>

      {showPreview && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowPreview(false)}
        >
          <div
            ref={previewModalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">This is how it looks</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
              </div>
            </div>
            <div className="flex-1 bg-gray-100">
              <iframe
                title="This is how it looks"
                className="w-full h-full bg-white"
                srcDoc={previewHtml}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
