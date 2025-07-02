"use client";

import { useState } from "react";
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
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const examplePrompts = [
  {
    title: "Newsletter",
    prompt:
      "Create a monthly newsletter for a tech company with latest product updates, team highlights, and upcoming events. Include a call-to-action button for subscribing to updates.",
  },
  {
    title: "Promotional Sale",
    prompt:
      "Design a summer sale promotional email with product showcase, discount codes, and a prominent 'Shop Now' button. Include images of summer products.",
  },
  {
    title: "Event Invitation",
    prompt:
      "Generate an event invitation for a product launch with venue details, RSVP button, and social media links. Include an image of the event venue.",
  },
  {
    title: "Welcome Email",
    prompt:
      "Create a welcome email for new customers with product recommendations, getting started guide, and customer support information. Include product images.",
  },
  {
    title: "Restaurant Menu",
    prompt:
      "Design a restaurant menu email with featured dishes, special offers, and online booking button. Include appetizing food images.",
  },
];

export default function AIEmailGenerator({ onEmailGenerated }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        body: JSON.stringify({ prompt: prompt.trim() }),
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

  const handleExampleClick = (examplePrompt) => {
    setPrompt(examplePrompt);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Generate Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Email Generator
          </DialogTitle>
          <DialogDescription>
            Describe the email you want to create. The AI will generate a
            complete email structure with appropriate components and real
            images.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt" className="text-sm font-medium">
              Describe your email
            </Label>
            <Textarea
              id="prompt"
              placeholder="e.g., Create a promotional email for a summer sale with product images and discount codes..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] mt-2"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Quick Examples</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto p-3"
                  onClick={() => handleExampleClick(example.prompt)}
                >
                  <div>
                    <div className="font-medium text-sm">{example.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {example.prompt.substring(0, 80)}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
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
