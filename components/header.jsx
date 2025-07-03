"use client";

import { Button } from "./ui/button";
import { Download, Save } from "lucide-react";
import AIEmailGenerator from "./ai-email-generator";
import { generateHtml } from "@/lib/export-html";

export function Header({ components, onSave, lastSaved, onGenerateEmail }) {
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

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Email Editor</h1>
          <p className="text-sm text-gray-500">
            Build beautiful emails with drag and drop
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastSaved && (
            <div className="text-sm text-gray-500">
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </div>
          )}

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
