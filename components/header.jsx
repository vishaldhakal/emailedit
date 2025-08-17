"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Download, Save } from "lucide-react";
import AIEmailGenerator from "./ai-email-generator";
import { generateHtml } from "@/lib/export-html";
import { LayoutTemplate } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Templates } from "@/lib/templetes";

export function Header({
  components,
  onSave,
  lastSaved,
  onGenerateEmail,
  onUpdateComponents,
}) {
  const [formattedTime, setFormattedTime] = useState("");

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

  return (
    <header className="bg-card  px-6 py-2 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Emailer</h1>
        </div>

        <div className="flex items-center gap-3">
          {lastSaved && formattedTime && (
            <div className="text-sm text-gray-500">
              Last saved: {formattedTime}
            </div>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-black text-white hover:bg-gray-900">
                <LayoutTemplate className="w-4 h-4" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[92vw] max-w-5xl max-h-[80vh] p-0">
              <div className="flex max-h-[75vh] flex-col">
                <DialogHeader className="sticky top-0 z-10 border-b bg-background/95 px-6 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-lg">
                  <DialogTitle className="text-base sm:text-lg">
                    Choose a template
                  </DialogTitle>
                </DialogHeader>
                <div className="min-h-0 flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Templates?.map((template, i) => (
                      <DialogClose asChild key={i}>
                        <button
                          type="button"
                          onClick={() => handleTempleteClick(template)}
                          className="group w-full overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {template.image && (
                            <div className="aspect-[4/3] w-full overflow-hidden">
                              <img
                                src={template.image}
                                alt={template.name}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                              />
                            </div>
                          )}
                          <div className="p-3">
                            <p className="font-medium text-sm">
                              {template.name}
                            </p>
                          </div>
                        </button>
                      </DialogClose>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <AIEmailGenerator onEmailGenerated={onGenerateEmail} />

          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}
