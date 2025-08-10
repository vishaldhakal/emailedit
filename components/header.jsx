"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Download, Save } from "lucide-react";
import AIEmailGenerator from "./ai-email-generator";
import { generateHtml } from "@/lib/export-html";
import { LayoutTemplate } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import { Templates } from "@/lib/templetes";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Email Editor</h1>
          <p className="text-sm text-gray-500">Build beautiful emails</p>
        </div>

        <div className="flex items-center gap-3">
          {lastSaved && formattedTime && (
            <div className="text-sm text-gray-500">
              Last saved: {formattedTime}
            </div>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex items-center gap-2 bg-black text-white hover:bg-gray-900">
                <LayoutTemplate className="w-4 h-4" />
                Templates
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {Templates?.map((template, i) => (
                  <PopoverClose key={i}>
                    <div
                      className="p-3 rounded-md hover:bg-gray-100 cursor-pointer min-h-[120px] flex flex-col justify-center"
                      onClick={() => handleTempleteClick(template)}
                    >
                      <p className="font-medium mb-1">{template.name}</p>
                      <p className="text-sm text-gray-500">
                        {template.description}
                      </p>
                    </div>
                  </PopoverClose>
                ))}
              </div>
            </PopoverContent>
          </Popover>

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
