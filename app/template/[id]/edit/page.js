"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LazyEmailEditor } from "@/components/LazyEmailEditor";
import { ComponentSidebar } from "@/components/componentSidebar";
import { UnifiedEditingToolbar } from "@/components/UnifiedEditingToolbar";
import { generateHtml } from "@/lib/export-html";
import { Loader2, ChevronLeft, Eye, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { InlineEditableTitle } from "@/components/InlineEditableTitle";

export default function Page() {
  const { id: templateId } = useParams();
  console.log(templateId);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [components, setComponents] = useState([]);
  const [latestComponents, setLatestComponents] = useState([]); // Track latest components from EmailEditor
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
  });
  const emailEditorRef = useRef(null);
  const [isTemplateUpdating, setIsTemplateUpdating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [undoRedoState, setUndoRedoState] = useState({
    canUndo: false,
    canRedo: false,
  });

  const previewModalRef = useRef(null);
  // Combined save status for UI
  // const combinedSaveStatus = useMemo(() => {
  //   const isSaving = designSaveStatus.isSaving;
  //   const lastSaved = Math.max(designSaveStatus.lastSaved);
  //   const error = designSaveStatus.error;

  //   return { isSaving, lastSaved, error };
  // }, [designSaveStatus]);

  useEffect(() => {
    if (!templateId) return;
    const fetchTemplete = async () => {
      try {
        const res = await fetch(
          `https://api.salesmonk.ca/api/templates/${templateId}/`
        );
        const data = await res.json();
        setComponents(data.component);
        setFormData((p) => ({ ...p, name: data.name }));
      } catch (error) {
        toast.success("error fetching template");
      }
    };
    fetchTemplete();
  }, [templateId]);

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

  // Auto-save design changes (components, name)
  useEffect(() => {
    const componentsToSave =
      latestComponents.length > 0 ? latestComponents : components;
    const designData = {
      name: formData.name || "",
      components: componentsToSave,
    };
  }, [latestComponents, components, formData.name]);

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

  const handleTemplateUpdate = async () => {
    if (!formData?.name?.trim())
      return toast.error("Please enter a template name");
    if (!latestComponents || latestComponents.length === 0)
      return toast.error("Cannot save empty template");

    if (!emailEditorRef.current) return;
    const canvasEl = emailEditorRef.current.getCanvasElement();
    if (!canvasEl) return;
    // Create snapshot
    const snapshotCanvas = await html2canvas(canvasEl, {
      useCORS: true,
      allowTaint: false,
    });
    // Convert to binary Blob
    const blob = await new Promise((resolve) =>
      snapshotCanvas.toBlob(resolve, "image/png")
    );

    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("component", JSON.stringify(latestComponents));
    uploadData.append("thumbnail", blob);
    try {
      setIsTemplateUpdating(true);
      const res = await fetch(
        `https://api.salesmonk.ca/api/templates/${templateId}/`,
        {
          method: "PUT",
          body: uploadData,
        }
      );

      if (!res.ok) throw new Error("Failed to update template");

      toast.success("Template updated");
      setLatestComponents([]);
      setComponents([]);
      router.push("/");
    } catch (err) {
      toast.error(err.message || "Error updating template");
    } finally {
      setIsTemplateUpdating(false);
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
                  onClick={() => router.push(`/`)}
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
              mode="edit"
              onAction={handleTemplateUpdate}
              isTemplateUpdating={isTemplateUpdating}
            />
          </div>
        </div>

        {/* Right Canvas Area - Dark Background */}
        <div className="flex-1 relative bg-gray-100 flex flex-col h-full overflow-hidden min-w-0">
          {/* Unified Editing Toolbar - Always visible, sticky at top */}
          <div className="sticky top-0 z-30 flex-shrink-0">
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

          {/* Preview Button - Floating at Top Right */}
          <div className="absolute top-16 right-4 z-40 pointer-events-none">
            <Button
              onClick={openPreview}
              className="bg-white hover:bg-gray-50 shadow-md border border-gray-200 rounded-full text-gray-700 flex items-center gap-2 h-9 px-4 text-sm font-medium transition-all hover:shadow-lg pointer-events-auto"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
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

      {/* Footer Settings Modal */}
      {/* <FooterSettingsModal
        isOpen={showFooterSettings}
        onClose={() => setShowFooterSettings(false)}
      />
      <AlertDialog open={showApplyConfirm} onOpenChange={setShowApplyConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply this template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current design with the selected template.
              You can undo immediately if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowApplyConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={applySelectedTemplate}>
              Apply Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
}
