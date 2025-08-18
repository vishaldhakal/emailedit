"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Download, Save } from "lucide-react";
import AIEmailGenerator from "./ai-email-generator";
import { generateHtml } from "@/lib/export-html";
import { DialogClose } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
}) {
  const router = useRouter();
  const [formattedTime, setFormattedTime] = useState("");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
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

  const handleTempleteClick = (template) => {
    onUpdateComponents(template.component);
  };
  const handleSaveTemplate = async () => {
    if (!templateName.trim())
      return toast.error("Please enter a template name");
    if (!components || components.length === 0)
      return toast.error("Cannot save empty template");

    try {
      const url = template?.id
        ? `https://api.salesmonk.ca/api/templates/${template.id}/`
        : "https://api.salesmonk.ca/api/templates/";

      const method = template?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: templateName, component: components }),
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
      toast.error(err.message || "Error deleting template");
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col justify-center gap-1">
          <Link href="/">
            <h1 className="m-0 text-xl font-semibold text-gray-900">
              Email Editor
            </h1>
          </Link>
          <p className="text-sm text-gray-500">Build beautiful emails</p>
        </div>

        <div className="flex items-center gap-3">
          {lastSaved && formattedTime && (
            <div className="text-sm text-gray-500">
              Last saved: {formattedTime}
            </div>
          )}

          {headerVariant == "default" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-400">
                  <LayoutTemplate className="w-4 h-4" />
                  Templates
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[32rem] max-h-96 overflow-y-auto flex flex-col gap-5">
                <Link href="/template/create">
                  <Button className="w-full" variant="default">
                    Create Template
                  </Button>
                </Link>

                {templates.length === 0 || !templates ? (
                  <div className="flex flex-1 items-center justify-center min-h-[200px]">
                    <p className="text-gray-500">No templates</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {templates?.map((template, i) => (
                      <div
                        key={i}
                        className="relative group/temp  hover:border-gray-300 transition-colors duration-200 "
                      >
                        {/* Wrap only the clickable area that selects the template */}
                        <PopoverClose asChild>
                          <div
                            className="p-2 rounded-md cursor-pointer min-h-[120px] flex flex-col justify-center border  border-gray-300 hover:border-gray-950 transition-colors duration-200"
                            onClick={() => handleTempleteClick(template)}
                          >
                            <p className="font-medium mb-1 text-center">
                              {template.name}
                            </p>
                          </div>
                        </PopoverClose>

                        {/* Top-right icons (edit/delete) */}
                        <div className="absolute opacity-0 top-2 right-2 flex gap-1 group-hover/temp:opacity-100">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/template/${template.id}/edit`);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                              </DialogHeader>

                              <p className="mt-2 mb-4 text-sm">
                                This will permanently delete template. This
                                action cannot be undone.
                              </p>

                              <DialogFooter className="flex justify-end gap-2">
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteTemplate(template.id)
                                    }
                                  >
                                    Yes
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}

          {headerVariant == "template" ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  {template?.id ? "Update Template" : "Save as Template"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 max-h-96 overflow-y-auto flex flex-col gap-5 ">
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
                    varient="danger"
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
