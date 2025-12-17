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
  const [prompt, setPrompt] = useState("Make the design exact same as given image");
  const [image, setImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
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

  // Helper function to normalize components (map 'column' to specific types)
  const normalizeComponents = (components) => {
    return components.map((comp) => {
      const newComp = { ...comp };

      // Map 'column' type to specific column components
      if (newComp.type === "column") {
        const colCount = newComp.data?.columns || 2;
        if (colCount === 3) {
          newComp.type = "three-column";
        } else {
          // Default to two-column for 2 or unspecified
          newComp.type = "two-column";
        }
      }

      // Recursively normalize nested components in 'container'
      if (
        newComp.data?.components &&
        Array.isArray(newComp.data.components)
      ) {
        newComp.data.components = normalizeComponents(newComp.data.components);
      }

      // Recursively normalize nested components in 'column' (columnsData)
      if (
        newComp.data?.columnsData &&
        Array.isArray(newComp.data.columnsData)
      ) {
        newComp.data.columnsData = newComp.data.columnsData.map((col) =>
          Array.isArray(col) ? normalizeComponents(col) : col
        );
      }

      return newComp;
    });
  };

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

        // Normalize the components before passing them to the editor
        const normalizedComponents = normalizeComponents(
          emailComponents.components
        );

        onEmailGenerated(normalizedComponents);
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

  const handleCopyPrompt = () => {
        const systemPrompt = `You are an expert email designer and developer. Create a professional and visually appealing email structure based on the user's description.

AVAILABLE COMPONENTS:
1. heading - For titles and section headers
2. text-block - For body text content
3. image - For images (will be fetched from Pexels API)
4. button - For call-to-action buttons
5. divider - For horizontal separators
6. spacer - For vertical spacing
7. social-media - For social media links
8. link - for block level link text
9. two-column - 2 columns side-by-side layout
10. three-column - 3 columns side-by-side layout
11. list - can list ordered or unordered items
12. container - wrapper for grouping components with specific background/padding (like cards, badges, sections)

COMPONENT DATA STRUCTURES:
- heading: { content: string, level: "h1"|"h2"|"h3"|"h4"|"h5"|"h6", color: string, alignment: "left"|"center"|"right",font:"Arial"|"Georgia"|"Times New Roman" |"Verdana",bold:boolean,italic:boolean,underline:boolean ,backgroundColor:string}
- text-block: { content: string, fontSize: "12px" |"14px"|"16px" |"18px"|"24px" ,font:"Arial"|"Georgia"|"Times New Roman" |"Verdana", alignment: "left"|"center"|"right",backgoundColor:string}
- image: { src: string, alt: string, width: "100%"|"75%"|"50%"|"25%"|"200px"|"300px"|"400px", height: "auto"|"100px"| "200px"|"300px"|"400px", pexelsQuery: string, alignment: "left"|"center"|"right" }
- button: { text: string, url: string, backgroundColor: string, textColor: string, padding: "10px 20px" | "18px 40px", borderRadius: "4px"|"8px"|"999px", alignment: "center"|"left"|"right", font: "Helvetica Neue" }
- divider: { style: "solid"|"dashed"|"dotted", color: string, height: "1px"|"2px"|"3px"|"4px"|}
- spacer: { height: "10px"|"20px"|"30px"|"40px"|"50px"|"60px"| }
- social-media: { platforms: [{ name: "facebbok"|"twitter"|"instagram"|"linkedin"|"youtube"|"tiktok", url: string }], iconSize:"20px"|"24px"|"32px"|"40px", color: string, alignment: "left"|"center"|"right" }
- link: {text:string,url:string, color:string,underline:boolean ,alignment: "left" || "right" || "center"}
- two-column: { width: "100%", backgroundColor: string, padding: "0px"|"10px"|"20px"|"30px", gap:"0px"|"10px"|"20px"|"30px", columnsData: [] } // Array of 2 arrays: components per column
- three-column: { width: "100%", backgroundColor: string, padding: "0px"|"10px"|"20px"|"30px", gap:"0px"|"10px"|"20px"|"30px", columnsData: [] } // Array of 3 arrays: components per column
- list :{content:html,font:"Arial"|"Georgia"|"Times New Roman" |"Verdana", fontSize:"12px" |"14px"|"16px" |"18px"|"24px"  } //cpntent can have bullet or numbered list
- container: { padding: "10px"|"20px"|"30px", backgroundColor: string, borderRadius: "0px"|"8px"|"16px", components: [] }

INSTRUCTIONS:
1.  Analyze the user's request carefully to understand the email's purpose and tone.
2.  Use 'container' component generously to create distinct sections, cards, or badges (e.g., 'New Arrival' badge, 'Featured' section card).
3.  Nest headings, text-blocks, buttons, etc., inside containers to group them visually.
4.  Use professional and harmonious color palettes. For corporate emails, prefer blues, grays, and whites. For promotional emails, use brighter, more vibrant colors.
5.  Choose appropriate font sizes and styles for headings and body text to ensure readability and visual hierarchy.
6.  Incorporate engaging and well-written copy.
7.  Use spacers and dividers effectively to create a clean and well-organized layout.
8.  For every image component, provide a direct src URL of a relevant image from Pexels and include a meaningful pexelsQuery.
9.  Include clear and compelling call-to-action buttons.
10. Add social media links to enhance brand presence.
11. Do NOT generate any HTML (except for list content). Only use the provided component data structures.
12. Keep the alignment for components to center where appropriate.
13. Consider the whole canvas to be 600px max width.

RESPONSE FORMAT:
Return ONLY a valid JSON object with this exact structure:
{
  "components": [
    {"id":"unique id",
      "type": "component-type",
      "data": { /* component data */ }
    }
  ]
}

Make the email professional, engaging, and well-structured with nested containers where applicable.`;
    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;
    navigator.clipboard.writeText(fullPrompt);
    toast.success("Prompt copied to clipboard!");
  };

  const handleJsonSubmit = () => {
      try {
          const parsed = JSON.parse(jsonInput);
          let componentsToProcess = [];

          if (Array.isArray(parsed)) {
              componentsToProcess = parsed;
          } else if (parsed.components && Array.isArray(parsed.components)) {
              componentsToProcess = parsed.components;
          } else {
              throw new Error("Invalid JSON structure: expected array or object with 'components' array");
          }

          const normalizedComponents = normalizeComponents(componentsToProcess);
          onEmailGenerated(normalizedComponents);
          toast.success("Design loaded from JSON!");
          setIsOpen(false);
          setJsonInput("");
          setShowJsonInput(false);
      } catch (e) {
          console.error("JSON Parse Error:", e);
          toast.error("Invalid JSON format. Please check your input.");
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
      <DialogContent className="sm:max-w-[620px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Campaign Builder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
           {!showJsonInput ? (
             <>
                <div>
                    <div className="flex justify-between items-center mb-2">
                         <Label htmlFor="prompt" className="text-sm font-medium">
                        Describe your template
                        </Label>
                        <div className="flex gap-2">
                             <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowJsonInput(true)}
                                className="h-7 text-xs"
                             >
                                Paste JSON
                             </Button>
                             <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyPrompt}
                                disabled={!prompt.trim()}
                                className="h-7 text-xs"
                             >
                                Copy Prompt
                             </Button>
                        </div>
                    </div>
                   
                    <Textarea
                    id="prompt"
                    placeholder="e.g., Describe your template or what type of template you need (newsletter, promo sale, event invite)…"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px]"
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
             </>
           ) : (
             <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Paste JSON Data</Label>
                    <Button variant="ghost" size="sm" onClick={() => setShowJsonInput(false)}>
                        Back to Generator
                    </Button>
                 </div>
                 <Textarea 
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='{"components": [...]}'
                    className="min-h-[300px] font-mono text-xs"
                 />
                 <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => setShowJsonInput(false)}>Cancel</Button>
                      <Button onClick={handleJsonSubmit} disabled={!jsonInput.trim()}>Import Design</Button>
                 </div>
             </div>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
