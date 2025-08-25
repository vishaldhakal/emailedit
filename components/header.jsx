"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Download, Save } from "lucide-react";
import AIEmailGenerator from "./ai-email-generator";
import { generateHtml } from "@/lib/export-html";
import { DialogClose } from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { PopoverClose } from "@radix-ui/react-popover";
import { toast } from "sonner";
import { Edit, Trash2, LayoutTemplate } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import Link from "next/link";
import TemplateModal from "./template-modal";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

export function Header({
  template,
  components,
  onSave,
  lastSaved,
  onGenerateEmail,
  onUpdateComponents,
  headerVariant,
  canvasRef,
  setLoading,
}) {
  const router = useRouter();
  const [formattedTime, setFormattedTime] = useState("");
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState("");

  useEffect(() => {
    if (lastSaved) {
      setFormattedTime(new Date(lastSaved).toLocaleTimeString());
    }
  }, [lastSaved]);

  useEffect(() => {
    if (template?.name) {
      setTemplateName(template.name);
    }
  }, [template]);

  const handleSave = () => {
    onSave();
  };
  useEffect(() => {
    const getTemplates = async () => {
      try {
        const res = await fetch("https://api.salesmonk.ca/api/templates/");
        const templates = await res.json();
        setTemplates(templates);
      } catch (error) {
        console.log("error fetching templates", error);
      }
    };
    getTemplates();
  }, []);
  const handleExport = () => {
    const html = generateHtml(components);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTempleteClick = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`https://api.salesmonk.ca/api/templates/${id}/`);
      const template = await res.json();
      onUpdateComponents(template.component);
    } catch (error) {
      console.log("error fetching templates", error);
      toast.success("error fetching template");
    } finally {
      setLoading(false);
    }
  };
  const handleSaveTemplate = async () => {
    if (!templateName.trim())
      return toast.error("Please enter a template name");
    if (!components || components.length === 0)
      return toast.error("Cannot save empty template");

    if (!canvasRef.current) return;
    const snapshotCanvas = await html2canvas(canvasRef.current);
    const previewImage = snapshotCanvas.toDataURL("image/png");

    try {
      const url = template?.id
        ? `https://api.salesmonk.ca/api/templates/${template.id}/`
        : "https://api.salesmonk.ca/api/templates/";

      const method = template?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          component: components,
        }),
      });

      if (!res.ok) throw new Error("Failed to save template");

      toast.success(template?.id ? "Template updated!" : "Template saved!");
      if (!template?.id) onUpdateComponents([]); // clear only after new template
      router.push("/");
    } catch (err) {
      toast.error(err.message || "Error saving template");
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      const res = await fetch(`https://api.salesmonk.ca/api/templates/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete template");
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success("Template deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Error deleting template");
    }
  };

  return (
    <header className="bg-white px-4 lg:px-6 py-1">
      <div className="flex h-14 items-center justify-between">
        <div className="flex flex-col justify-center">
          <Link href="/">
            <h1 className="m-0 text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Campaign Builder
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {lastSaved && formattedTime && (
            <div className="hidden sm:block text-xs sm:text-sm text-muted-foreground">
              Last saved: {formattedTime}
            </div>
          )}

          {headerVariant == "default" && (
            <TemplateModal onSelect={(id) => handleTempleteClick(id)} />
          )}

          {headerVariant == "template" ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  {template?.id ? "Update Template" : "Save as Template"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 max-h-96 overflow-y-auto flex flex-col gap-4 p-4">
                <div>
                  <Label>Template Name</Label>
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name..."
                  ></Input>
                </div>

                <PopoverClose asChild>
                  <Button
                    className="self-end"
                    variant="default"
                    onClick={handleSaveTemplate}
                  >
                    Save
                  </Button>
                </PopoverClose>
              </PopoverContent>
            </Popover>
          ) : (
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
          <AIEmailGenerator onEmailGenerated={onGenerateEmail} />
          {headerVariant == "default" && (
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
