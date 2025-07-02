"use client";

import { Button } from "./ui/button";
import { Download, Save } from "lucide-react";
import AIEmailGenerator from "./ai-email-generator";

export function Header({ onSave, lastSaved, onGenerateEmail }) {
  const handleSave = () => {
    onSave();
  };

  const handleExport = () => {
    // Export functionality can be added here
    console.log("Exporting email...");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
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
