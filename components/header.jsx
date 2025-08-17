"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Download, Save } from "lucide-react";
import AIEmailGenerator from "./ai-email-generator";
import { generateHtml } from "@/lib/export-html";

import { PopoverClose } from "@radix-ui/react-popover";
import { Templates } from "@/lib/templetes";
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

export function Header({
  components,
  onSave,
  lastSaved,
  onGenerateEmail,
  onUpdateComponents,
  headerVariant,
}) {
  const [formattedTime, setFormattedTime] = useState("");
  const [templateName, setTemplateName] = useState("");
  useEffect(() => {
    if (lastSaved) {
      setFormattedTime(new Date(lastSaved).toLocaleTimeString());
    }
  }, [lastSaved]);

  const handleSave = () => {
    onSave();
  };

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
    onUpdateComponents(template.components);
  };
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      return toast.error("Please enter a template name");
    }
    if (!components || components.length === 0) {
      return toast.error("Cannot save empty template");
    }

    try {
      const res = await fetch("https://api.salesmonk.ca/api/templates/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: templateName, components }),
      });

      if (!res.ok) throw new Error("Failed to save template");

      toast.success("Template saved successfully!");
      setTemplateName("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error saving template");
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/">
            <h1 className="text-xl font-semibold text-gray-900">
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
            // <Popover>
            //   <PopoverTrigger asChild>
            //     <Button className="flex items-center gap-2 bg-black text-white hover:bg-gray-900">
            //       <LayoutTemplate className="w-4 h-4" />
            //       Templates
            //     </Button>
            //   </PopoverTrigger>
            //   <PopoverContent className="w-[32rem] max-h-96 overflow-y-auto flex flex-col gap-5">
            //     <Link href="/template/create">
            //       <Button className="w-full" variant="default">
            //         Create Template
            //       </Button>
            //     </Link>
            //     <div className="grid grid-cols-2 gap-3">
            //       {Templates?.map((template, i) => (
            //         <PopoverClose key={i}>
            //           <div
            //             className="p-2 rounded-md hover:bg-gray-100 cursor-pointer min-h-[120px] flex flex-col justify-center"
            //             onClick={() => handleTempleteClick(template)}
            //           >
            //             <p className="font-medium mb-1">{template.name}</p>
            //           </div>
            //         </PopoverClose>
            //       ))}
            //     </div>
            //   </PopoverContent>
            // </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex items-center gap-2 bg-black text-white hover:bg-gray-900">
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

                <div className="grid grid-cols-2 gap-3">
                  {Templates?.map((template, i) => (
                    <PopoverClose key={i}>
                      <div
                        className="relative p-2 rounded-md hover:bg-gray-100 cursor-pointer min-h-[120px] flex flex-col justify-center"
                        onClick={() => handleTempleteClick(template)}
                      >
                        {/* Top-right icons */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTemplate(template.id);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>

                        <p className="font-medium mb-1">{template.name}</p>
                      </div>
                    </PopoverClose>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {headerVariant == "template" ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save as Template
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

                <Button
                  className="self-end"
                  varient="danger"
                  onClick={handleSaveTemplate}
                >
                  Save
                </Button>
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
