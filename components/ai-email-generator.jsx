"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

export default function AIEmailGenerator({ onEmailGenerated }) {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1];
      setImage(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1];
      setImage(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const clearImage = () => setImage(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your email");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim(), image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate email");
      }

      const data = await response.json();

      if (data.emailStructure) {
        const emailComponents = JSON.parse(data.emailStructure);
        onEmailGenerated(emailComponents.components);
        toast.success("Email generated successfully!");
        setIsOpen(false);
        setPrompt("");
        setImage(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating email:", error);
      toast.error(
        error.message || "Failed to generate email. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Campaign Builder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Campaign Builder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label htmlFor="prompt" className="text-sm font-medium">
              Describe your template
            </Label>
            <Textarea
              id="prompt"
              placeholder="e.g., Describe your template or what type of template you need (newsletter, promo sale, event invite)…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] mt-2"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Add sample template example (if any)
            </Label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="group relative flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center transition-colors hover:border-muted-foreground/40"
            >
              {!image ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop an image here, or
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="ml-1 underline underline-offset-2 hover:text-foreground"
                    >
                      browse
                    </button>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              ) : (
                <div className="relative w-full max-w-[360px]">
                  <img
                    src={`data:image/*;base64,${image}`}
                    alt="Selected"
                    className="w-full rounded-md border object-contain"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 h-7 w-7 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsOpen(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
