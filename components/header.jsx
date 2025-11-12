"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Download, Save } from "lucide-react";
import AIEmailGenerator from "./ai-email-generator";
import { generateHtml } from "@/lib/export-html";

import { PopoverClose } from "@radix-ui/react-popover";
import { toast } from "sonner";
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
    <header className="bg-gray-50 px-4 lg:px-6 py-1">
      <div className="flex h-14 items-center justify-between">
        <div className="flex flex-col justify-center">
          <Link href="/">
            <h1 className="m-0 text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Campaign Builder
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
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
