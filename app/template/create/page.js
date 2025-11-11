"use client";
import { useStat, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Eye } from "lucide-react";
import { ComponentSidebar } from "@/components/conponentSidebar";
import { UnifiedEditingToolbar } from "@/components/UnifiedEditingToolbar";
import { EmailEditor } from "@/components/email-editor";
import { InlineEditableTitle } from "@/components/InlineEditableTitle";
import { se } from "date-fns/locale";
export default function Home() {
  const router = useRouter();
  const [undoRedoState, setUndoRedoState] = useState({
    canUndo: false,
    canRedo: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [components, setComponents] = useState([]);
  const [latestComponents, setLatestComponents] = useState([]); // Track latest components from EmailEditor
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
  });

  const [selectedComponent, setSelectedComponent] = useState(null);
  const emailEditorRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const previewModalRef = useRef(null);

  const [previewHtml, setPreviewHtml] = useState("");
  const openPreview = () => {
    try {
      // Use latestComponents for preview as well
      const componentsToPreview =
        latestComponents.length > 0 ? latestComponents : components;
      const html = generateHtml(
        componentsToPreview || [],
        footerSettings || null
      );
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
  console.log(selectedComponent);

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
            <ComponentSidebar />
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
            <EmailEditor
              ref={emailEditorRef}
              // Force re-mount when campaign changes
              headerVariant="minimal"
              storageKey={`design_campaign_editor`}
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
            />
            <EmailEditor template headerVariant="template" storageKey="email" />
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
         /> */}
    </div>
  );
}
