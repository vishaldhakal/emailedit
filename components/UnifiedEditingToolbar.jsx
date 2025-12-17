"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Upload,
  Link as LinkIcon,
  X,
  Square,
  Circle,
  Minus,
  Type,
  AlignJustify,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { campaignImagesService } from "@/services/campaignImages";
// Removed next-auth
import { ColorPicker } from "@/components/campaign/ColorPicker";
import AIEmailGenerator from "./ai-email-generator";

export function UnifiedEditingToolbar({ selectedComponent, onUpdate, onEmailGenerated }) {
  // Use mock session/user ID since auth is removed
  const session = { user: { id: "demo-user" } }; 
  const [fontSize, setFontSize] = useState("16");
  const [headingLevel, setHeadingLevel] = useState("H1");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrlValue, setLinkUrlValue] = useState("");

  useEffect(() => {
    if (selectedComponent) {
      const data = selectedComponent.data || {};

      // Set font size
      if (data.fontSize) {
        const size = parseInt(data.fontSize.replace("px", ""));
        setFontSize(size.toString());
      }

      // Set heading level
      if (data.level) {
        setHeadingLevel(data.level.toUpperCase());
      }

      // Set font family
      if (data.font) {
        setFontFamily(data.font);
      }
    }
    // Close link input when component changes
    setShowLinkInput(false);
    setLinkUrlValue("");
  }, [selectedComponent]);

  const data = selectedComponent?.data || {};
  const type = selectedComponent?.type;

  const handleFontSizeChange = (value) => {
    const newSize = parseInt(value);
    setFontSize(value);
    onUpdate({ ...data, fontSize: `${newSize}px` });
  };

  const handleFontSizeIncrement = () => {
    const newSize = parseInt(fontSize) + 1;
    setFontSize(newSize.toString());
    onUpdate({ ...data, fontSize: `${newSize}px` });
  };

  const handleFontSizeDecrement = () => {
    const newSize = Math.max(8, parseInt(fontSize) - 1);
    setFontSize(newSize.toString());
    onUpdate({ ...data, fontSize: `${newSize}px` });
  };

  const handleHeadingChange = (level) => {
    setHeadingLevel(level);
    onUpdate({ ...data, level: level.toLowerCase() });
  };

  const handleFontFamilyChange = (font) => {
    setFontFamily(font);
    onUpdate({ ...data, font });
  };

  const handleToggleBold = () => {
    if (type === "text-block" && window.textBlockEditor) {
      // For TextBlock, use TipTap editor to apply to selection
      window.textBlockEditor.chain().focus().toggleBold().run();
    } else {
      // For Heading and other components, update data
      onUpdate({ ...data, bold: !data.bold });
    }
  };

  const handleToggleItalic = () => {
    if (type === "text-block" && window.textBlockEditor) {
      // For TextBlock, use TipTap editor to apply to selection
      window.textBlockEditor.chain().focus().toggleItalic().run();
    } else {
      // For Heading and other components, update data
      onUpdate({ ...data, italic: !data.italic });
    }
  };

  const handleToggleUnderline = () => {
    if (type === "text-block" && window.textBlockEditor) {
      // For TextBlock, use TipTap editor to apply to selection
      window.textBlockEditor.chain().focus().toggleUnderline().run();
    } else {
      // For Heading and other components, update data
      onUpdate({ ...data, underline: !data.underline });
    }
  };

  const handleAlignment = (alignment) => {
    onUpdate({ ...data, alignment });
  };

  const handleListType = (isOrdered) => {
    // Handle list type change
    if (isOrdered) {
      onUpdate({ ...data, listType: "ordered" });
    } else {
      onUpdate({ ...data, listType: "unordered" });
    }
  };

  const handleApplyLink = (url) => {
    if (!url || !url.trim()) return;

    const trimmedUrl = url.trim();
    // Ensure URL has protocol
    const finalUrl =
      trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")
        ? trimmedUrl
        : `https://${trimmedUrl}`;

    if (type === "text-block" && window.textBlockEditor) {
      // For TipTap editor, apply link to selected text
      const { from, to } = window.textBlockEditor.state.selection;
      if (from !== to) {
        // Has text selection - apply link to selection
        window.textBlockEditor
          .chain()
          .focus()
          .setLink({ href: finalUrl, target: "_blank" })
          .run();
        // Ensure underline style is applied
        window.textBlockEditor
          .chain()
          .focus()
          .updateAttributes("link", { class: "underline" })
          .run();
      } else {
        // No selection - insert link at cursor
        window.textBlockEditor
          .chain()
          .focus()
          .insertContent(
            `<a href="${finalUrl}" target="_blank" style="text-decoration: underline;">${finalUrl}</a>`
          )
          .run();
      }
    } else if (type === "heading" && window.selectedHeadingRef) {
      // For heading component, apply link to selected text
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (
          !range.collapsed &&
          window.selectedHeadingRef.contains(range.commonAncestorContainer)
        ) {
          // Has selection within heading - wrap in link
          const link = document.createElement("a");
          link.href = finalUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.style.textDecoration = "underline";
          link.style.cursor = "pointer";
          try {
            range.surroundContents(link);
          } catch (e) {
            // If surroundContents fails, wrap manually
            const contents = range.extractContents();
            link.appendChild(contents);
            range.insertNode(link);
          }
          selection.removeAllRanges();

          // Update content
          const newContent = window.selectedHeadingRef.innerHTML;
          onUpdate({ ...data, content: newContent });
        } else {
          // No selection - wrap entire heading or insert at cursor
          const link = document.createElement("a");
          link.href = finalUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.style.textDecoration = "underline";
          link.style.cursor = "pointer";
          link.textContent = finalUrl;

          if (range.collapsed) {
            range.insertNode(link);
            range.setStartAfter(link);
          } else {
            try {
              range.surroundContents(link);
            } catch (e) {
              const contents = range.extractContents();
              link.appendChild(contents);
              range.insertNode(link);
            }
          }
          selection.removeAllRanges();
          const newContent = window.selectedHeadingRef.innerHTML;
          onUpdate({ ...data, content: newContent });
        }
      }
    } else {
      // For other components that support text selection
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          // Has selection - wrap in link
          const link = document.createElement("a");
          link.href = finalUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.style.textDecoration = "underline";
          link.style.cursor = "pointer";
          try {
            range.surroundContents(link);
          } catch (e) {
            const contents = range.extractContents();
            link.appendChild(contents);
            range.insertNode(link);
          }
          selection.removeAllRanges();
        }
      }
    }
  };

  const handleRemoveLink = () => {
    if (type === "text-block" && window.textBlockEditor) {
      // Remove link from selected text in TipTap
      window.textBlockEditor.chain().focus().unsetLink().run();
    } else if (type === "heading" && window.selectedHeadingRef) {
      // Remove links from heading
      const links = window.selectedHeadingRef.querySelectorAll("a");
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          // If text is selected, remove link from that area
          const selectedLinks = Array.from(links).filter(
            (link) => range.intersectsNode(link) || range.containsNode(link)
          );
          selectedLinks.forEach((link) => {
            const parent = link.parentNode;
            while (link.firstChild) {
              parent.insertBefore(link.firstChild, link);
            }
            parent.removeChild(link);
            parent.normalize();
          });
          selection.removeAllRanges();

          // Update content
          const newContent = window.selectedHeadingRef.innerHTML;
          onUpdate({ ...data, content: newContent });
        }
      } else {
        // Remove all links if nothing selected
        links.forEach((link) => {
          const parent = link.parentNode;
          while (link.firstChild) {
            parent.insertBefore(link.firstChild, link);
          }
          parent.removeChild(link);
          parent.normalize();
        });
        const newContent = window.selectedHeadingRef.innerHTML;
        onUpdate({ ...data, content: newContent });
      }
    }
  };

  // Determine which controls to show based on component type
  // Show text controls by default when no component is selected, or when the selected component is a text-based component
  const showTextControls =
    !selectedComponent ||
    type === "heading" ||
    type === "text-block" ||
    type === "list" ||
    type === "link";
  const showHeadingControls = type === "heading";
  const showListControls = type === "list";
  const showButtonControls = type === "button";
  const showImageControls = type === "image";
  const showLinkControls = type === "link";
  const showDividerControls = type === "divider";
  const showSpacerControls = type === "spacer";
  const showContainerControls = type === "container";

  // Determine if we should show controls (always show them now)
  const showControls = true;

  return (
    <div className="w-full bg-white text-gray-900 transition-all duration-300">
      <div className="flex items-center gap-2 px-4 py-2 h-12 transition-all duration-200">
        {showControls && (
          <>
            <div className="flex items-center justify-center gap-2 flex-1 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Magic Write / AI Tools */}
              <div className="mr-2">
                 <AIEmailGenerator onEmailGenerated={onEmailGenerated} />
              </div>

              {/* Link Button - Available for all components */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowLinkInput(!showLinkInput);
                    setLinkUrlValue("");
                  }}
                  className={`h-8 px-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-105 active:scale-95 ${
                    showLinkInput
                      ? "bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-md"
                      : "hover:bg-gray-100"
                  }`}
                  title="Add link to selected text"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>

                {/* Link Input - In-place below button */}
                {showLinkInput && (
                  <div className="link-input-container absolute top-full left-0 mt-1 z-50 bg-white border border-gray-300 rounded-md shadow-lg p-2 min-w-[280px]">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                      <Input
                        type="url"
                        placeholder="Enter URL (e.g., https://example.com)"
                        value={linkUrlValue}
                        onChange={(e) => {
                          // Use local state to prevent re-renders
                          setLinkUrlValue(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyLink(linkUrlValue);
                            setShowLinkInput(false);
                          } else if (e.key === "Escape") {
                            setShowLinkInput(false);
                            setLinkUrlValue("");
                          }
                        }}
                        onBlur={(e) => {
                          // Don't close if clicking inside the dropdown
                          const relatedTarget = e.relatedTarget;
                          if (
                            relatedTarget &&
                            relatedTarget.closest &&
                            relatedTarget.closest(".link-input-container")
                          ) {
                            return;
                          }
                          // Apply link when input loses focus (if URL is provided)
                          const currentValue = linkUrlValue.trim();
                          if (currentValue) {
                            // Use a timeout to allow the value to persist
                            setTimeout(() => {
                              handleApplyLink(currentValue);
                              setShowLinkInput(false);
                              setLinkUrlValue("");
                            }, 200);
                          } else {
                            // Close if empty
                            setTimeout(() => {
                              setShowLinkInput(false);
                            }, 150);
                          }
                        }}
                        className="h-7 flex-1 bg-white border-gray-300 text-gray-900 text-xs placeholder:text-gray-400 hover:bg-gray-50 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent blur
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLink();
                          setShowLinkInput(false);
                          setLinkUrlValue("");
                        }}
                        className="h-7 w-7 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        title="Remove link"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              {/* <div className="h-6 w-px bg-gray-600 mx-1" /> */}

              {/* Text Controls */}
              {showTextControls && (
                <>
                  {/* Heading Level */}
                  {showHeadingControls && (
                    <>
                      <Select
                        value={headingLevel}
                        onValueChange={handleHeadingChange}
                      >
                        <SelectTrigger className="h-8 w-12 bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:text-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="H1">H1</SelectItem>
                          <SelectItem value="H2">H2</SelectItem>
                          <SelectItem value="H3">H3</SelectItem>
                          <SelectItem value="H4">H4</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}

                  {/* Font Family */}
                  <Select
                    value={fontFamily}
                    onValueChange={handleFontFamilyChange}
                  >
                    <SelectTrigger className="h-8 w-24 bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">
                        Times New Roman
                      </SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Font Size Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFontSizeDecrement}
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 w-8 p-0 transition-all duration-200"
                    >
                      -
                    </Button>
                    <Input
                      type="text"
                      value={fontSize}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value) {
                          handleFontSizeChange(value);
                        } else {
                          setFontSize("");
                        }
                      }}
                      onBlur={(e) => {
                        if (!fontSize || parseInt(fontSize) < 8) {
                          setFontSize("12");
                          handleFontSizeChange("12");
                        }
                      }}
                      className="h-8 w-12 bg-white border-gray-300 text-gray-900 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 text-center p-1 transition-all duration-200"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFontSizeIncrement}
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 w-8 p-0 transition-all duration-200"
                    >
                      +
                    </Button>
                  </div>

                  {/* Text Color */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 px-2 transition-all duration-200"
                      >
                        <div
                          className="h-4 w-4 rounded border border-gray-300"
                          style={{ backgroundColor: data.color || "#000000" }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <Input
                          type="color"
                          value={data.color || "#000000"}
                          onChange={(e) => {
                            const color = e.target.value;
                            if (
                              type === "text-block" &&
                              window.textBlockEditor
                            ) {
                              // Apply to selected text in TipTap
                              const { from, to } =
                                window.textBlockEditor.state.selection;
                              if (from !== to) {
                                // Has selection, apply color
                                window.textBlockEditor
                                  .chain()
                                  .focus()
                                  .setColor(color)
                                  .run();
                              } else {
                                // No selection, update default
                                onUpdate({ ...data, color });
                              }
                            } else if (type === "heading") {
                              // Simplify: for headings, apply as global color only
                              onUpdate({ ...data, color });
                            } else {
                              onUpdate({ ...data, color });
                            }
                          }}
                          className="h-10 w-full"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Highlight Color - hidden for headings */}
                  {type !== "heading" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 px-2 transition-all duration-200"
                        >
                          <Type className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="space-y-2">
                          <Label>Highlight Color</Label>
                          <Input
                            type="color"
                            value={data.highlightColor || "#ffff00"}
                            onChange={(e) => {
                              const highlightColor = e.target.value;
                              if (
                                type === "text-block" &&
                                window.textBlockEditor
                              ) {
                                // Apply to selected text in TipTap
                                const { from, to } =
                                  window.textBlockEditor.state.selection;
                                if (from !== to) {
                                  // Has selection, apply highlight
                                  window.textBlockEditor
                                    .chain()
                                    .focus()
                                    .setMark("textStyle", {
                                      backgroundColor: highlightColor,
                                    })
                                    .run();
                                } else {
                                  // No selection, just save the color
                                  onUpdate({ ...data, highlightColor });
                                }
                              } else if (type === "heading") {
                                // For headings, do not manipulate selection; treat as global setting
                                onUpdate({ ...data, highlightColor });
                              } else {
                                onUpdate({ ...data, highlightColor });
                              }
                            }}
                            className="h-10 w-full"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}

                  {/* Text Formatting */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      if (type === "heading" && window.selectedHeadingRef) {
                        // For heading, check if text is selected
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                          const range = selection.getRangeAt(0);
                          if (
                            !range.collapsed &&
                            window.selectedHeadingRef.contains(
                              range.commonAncestorContainer
                            )
                          ) {
                            // Has selection within heading - toggle bold on selection
                            document.execCommand("bold", false);
                            selection.removeAllRanges();
                            return;
                          }
                        }
                      }
                      handleToggleBold();
                    }}
                    className={`h-8 px-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95 ${
                      (type === "text-block" &&
                        window.textBlockEditor?.isActive("bold")) ||
                      (type === "heading" && data.bold)
                        ? "bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-md"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      if (type === "heading" && window.selectedHeadingRef) {
                        // For heading, check if text is selected
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                          const range = selection.getRangeAt(0);
                          if (
                            !range.collapsed &&
                            window.selectedHeadingRef.contains(
                              range.commonAncestorContainer
                            )
                          ) {
                            // Has selection within heading - toggle italic on selection
                            document.execCommand("italic", false);
                            selection.removeAllRanges();
                            return;
                          }
                        }
                      }
                      handleToggleItalic();
                    }}
                    className={`h-8 px-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95 ${
                      (type === "text-block" &&
                        window.textBlockEditor?.isActive("italic")) ||
                      (type === "heading" && data.italic)
                        ? "bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-md"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      if (type === "heading" && window.selectedHeadingRef) {
                        // For heading, check if text is selected
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                          const range = selection.getRangeAt(0);
                          if (
                            !range.collapsed &&
                            window.selectedHeadingRef.contains(
                              range.commonAncestorContainer
                            )
                          ) {
                            // Has selection within heading - toggle underline on selection
                            document.execCommand("underline", false);
                            selection.removeAllRanges();
                            return;
                          }
                        }
                      }
                      handleToggleUnderline();
                    }}
                    className={`h-8 px-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95 ${
                      (type === "text-block" &&
                        window.textBlockEditor?.isActive("underline")) ||
                      (type === "heading" && data.underline)
                        ? "bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-md"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>

                  {/* Alignment */}
                  <div className="h-6 w-px bg-gray-300 mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAlignment("left")}
                    className={`h-8 px-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95 ${
                      data.alignment === "left"
                        ? "bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-md"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAlignment("center")}
                    className={`h-8 px-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95 ${
                      data.alignment === "center"
                        ? "bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-md"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAlignment("right")}
                    className={`h-8 px-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95 ${
                      data.alignment === "right"
                        ? "bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-md"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAlignment("justify")}
                    className={`h-8 px-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95 ${
                      data.alignment === "justify"
                        ? "bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-md"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>

                  {/* Insert Tags */}
                  {(type === "heading" || type === "text-block") && (
                    <>
                      <div className="h-6 w-px bg-gray-300 mx-1" />
                      <Select
                        value=""
                        onValueChange={(value) => {
                          if (!value) return;

                          const tagValue = `{${value}}`;

                          if (type === "text-block" && window.textBlockEditor) {
                            // Insert tag at cursor position in TipTap
                            window.textBlockEditor
                              .chain()
                              .focus()
                              .insertContent(tagValue)
                              .run();
                          } else if (
                            type === "heading" &&
                            window.selectedHeadingRef
                          ) {
                            // Insert tag at cursor position in heading
                            const selection = window.getSelection();
                            if (selection && selection.rangeCount > 0) {
                              const range = selection.getRangeAt(0);
                              if (!range.collapsed) {
                                // Replace selection with tag
                                range.deleteContents();
                                range.insertNode(
                                  document.createTextNode(tagValue)
                                );
                                range.collapse(false);
                              } else {
                                // Insert at cursor
                                range.insertNode(
                                  document.createTextNode(tagValue)
                                );
                                range.collapse(false);
                              }
                              selection.removeAllRanges();
                              selection.addRange(range);

                              // Update content
                              const newContent =
                                window.selectedHeadingRef.innerHTML;
                              onUpdate({ ...data, content: newContent });
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="h-8 w-[140px] bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 text-sm px-2">
                          <SelectValue placeholder="Insert tag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="first_name">First Name</SelectItem>
                          <SelectItem value="last_name">Last Name</SelectItem>
                          <SelectItem value="full_name">Full Name</SelectItem>
                          <SelectItem value="email">Email Address</SelectItem>
                          <SelectItem value="company_name">
                            Company Name
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}

                  {/* List Controls */}
                  {showListControls && (
                    <>
                      <div className="h-6 w-px bg-gray-300 mx-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleListType(false)}
                        className={`h-8 px-2 text-gray-700 hover:text-gray-900 transition-colors ${
                          data.listType !== "ordered"
                            ? "bg-blue-100 hover:bg-blue-200 text-blue-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleListType(true)}
                        className={`h-8 px-2 text-gray-700 hover:text-gray-900 transition-colors ${
                          data.listType === "ordered"
                            ? "bg-blue-100 hover:bg-blue-200 text-blue-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Handle indent
                        }}
                        className="h-8 px-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <Indent className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Handle outdent
                        }}
                        className="h-8 px-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <Outdent className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </>
              )}

              {/* Button Controls */}
              {showButtonControls && (
                <>
                  <div className="h-6 w-px bg-gray-300 mx-1" />
                  <Input
                    type="text"
                    placeholder="Button text"
                    value={data.text || ""}
                    onChange={(e) =>
                      onUpdate({ ...data, text: e.target.value })
                    }
                    className="h-8 w-32 bg-white border-gray-300 text-gray-900 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 text-sm px-2 transition-all duration-200"
                  />
                  <Input
                    type="text"
                    placeholder="URL"
                    value={data.url || ""}
                    onChange={(e) => onUpdate({ ...data, url: e.target.value })}
                    className="h-8 w-48 bg-white border-gray-300 text-gray-900 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 text-sm px-2 transition-all duration-200"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 px-2 transition-all duration-200"
                      >
                        <div
                          className="h-4 w-4 rounded border border-gray-300"
                          style={{
                            backgroundColor: data.backgroundColor || "#000000",
                          }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <Input
                          type="color"
                          value={data.backgroundColor || "#000000"}
                          onChange={(e) =>
                            onUpdate({
                              ...data,
                              backgroundColor: e.target.value,
                            })
                          }
                          className="h-10 w-full"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 px-2 transition-all duration-200"
                      >
                        <div
                          className="h-4 w-4 rounded border border-gray-300"
                          style={{ backgroundColor: data.color || "#ffffff" }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <Input
                          type="color"
                          value={data.color || "#ffffff"}
                          onChange={(e) =>
                            onUpdate({ ...data, color: e.target.value })
                          }
                          className="h-10 w-full"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Border Radius (Roundness) */}
                  <Select
                    value={data.borderRadius || "4px"}
                    onValueChange={(value) =>
                      onUpdate({ ...data, borderRadius: value })
                    }
                  >
                    <SelectTrigger className="h-8 w-20 bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:text-gray-900 text-xs">
                      <SelectValue placeholder="Round" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0px">None</SelectItem>
                      <SelectItem value="2px">Small</SelectItem>
                      <SelectItem value="4px">Medium</SelectItem>
                      <SelectItem value="8px">Large</SelectItem>
                      <SelectItem value="12px">XL</SelectItem>
                      <SelectItem value="16px">XXL</SelectItem>
                      <SelectItem value="24px">Round</SelectItem>
                      <SelectItem value="999px">Pill</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Border Controls */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 px-2 transition-all duration-200"
                        title="Border settings"
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className="h-4 w-4 rounded border-2"
                            style={{
                              borderColor: data.borderColor || "#000000",
                              borderWidth:
                                data.borderWidth &&
                                data.borderWidth !== "0px" &&
                                data.borderWidth !== "0"
                                  ? data.borderWidth
                                  : "2px",
                              borderStyle: data.borderStyle || "solid",
                            }}
                          />
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Border Width</Label>
                          <Select
                            value={data.borderWidth || "0px"}
                            onValueChange={(value) =>
                              onUpdate({ ...data, borderWidth: value })
                            }
                          >
                            <SelectTrigger className="h-8 w-full bg-white border-gray-300 text-gray-900 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0px">None</SelectItem>
                              <SelectItem value="1px">1px</SelectItem>
                              <SelectItem value="2px">2px</SelectItem>
                              <SelectItem value="3px">3px</SelectItem>
                              <SelectItem value="4px">4px</SelectItem>
                              <SelectItem value="5px">5px</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {data.borderWidth &&
                          data.borderWidth !== "0px" &&
                          data.borderWidth !== "0" && (
                            <>
                              <div className="space-y-2">
                                <Label className="text-xs">Border Style</Label>
                                <Select
                                  value={data.borderStyle || "solid"}
                                  onValueChange={(value) =>
                                    onUpdate({ ...data, borderStyle: value })
                                  }
                                >
                                  <SelectTrigger className="h-8 w-full bg-white border-gray-300 text-gray-900 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="solid">Solid</SelectItem>
                                    <SelectItem value="dashed">
                                      Dashed
                                    </SelectItem>
                                    <SelectItem value="dotted">
                                      Dotted
                                    </SelectItem>
                                    <SelectItem value="double">
                                      Double
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Border Color</Label>
                                <Input
                                  type="color"
                                  value={data.borderColor || "#000000"}
                                  onChange={(e) =>
                                    onUpdate({
                                      ...data,
                                      borderColor: e.target.value,
                                    })
                                  }
                                  className="h-10 w-full"
                                />
                              </div>
                            </>
                          )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              )}

              {/* Image Controls */}
              {showImageControls && (
                <>
                  <div className="h-6 w-px bg-gray-300 mx-1" />
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 px-3 transition-all duration-200"
                    onClick={() => setShowImagePicker(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {data.src ? "Replace Image" : "Add Image"}
                  </Button> */}
                  <Input
                    type="text"
                    placeholder="Image URL"
                    value={data.src || ""}
                    onChange={(e) => onUpdate({ ...data, src: e.target.value })}
                    className="h-8 w-64 bg-white border-gray-300 text-gray-900 text-sm px-2"
                  />
                  <Input
                    type="text"
                    placeholder="Alt text"
                    value={data.alt || ""}
                    onChange={(e) => onUpdate({ ...data, alt: e.target.value })}
                    className="h-8 w-32 bg-white border-gray-300 text-gray-900 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 text-sm px-2 transition-all duration-200"
                  />
                  <div className="h-6 w-px bg-gray-300 mx-1" />
                  <div className="flex items-center gap-1">
                    <Label className="text-xs text-gray-600 whitespace-nowrap">
                      Width:
                    </Label>
                    <Select
                      value={
                        data.width &&
                        [
                          "auto",
                          "100%",
                          "75%",
                          "50%",
                          "33%",
                          "25%",
                          "200px",
                          "300px",
                          "400px",
                          "500px",
                          "600px",
                          "800px",
                        ].includes(data.width)
                          ? data.width
                          : "custom"
                      }
                      onValueChange={(value) => {
                        if (value !== "custom") {
                          onUpdate({ ...data, width: value });
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 w-24 bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:text-gray-900 text-xs">
                        <SelectValue placeholder="Width" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="100%">100%</SelectItem>
                        <SelectItem value="75%">75%</SelectItem>
                        <SelectItem value="50%">50%</SelectItem>
                        <SelectItem value="33%">33%</SelectItem>
                        <SelectItem value="25%">25%</SelectItem>
                        <SelectItem value="200px">200px</SelectItem>
                        <SelectItem value="300px">300px</SelectItem>
                        <SelectItem value="400px">400px</SelectItem>
                        <SelectItem value="500px">500px</SelectItem>
                        <SelectItem value="600px">600px</SelectItem>
                        <SelectItem value="800px">800px</SelectItem>
                        <SelectItem value="custom">Custom...</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      placeholder="Custom width"
                      value={
                        data.width &&
                        ![
                          "auto",
                          "100%",
                          "75%",
                          "50%",
                          "33%",
                          "25%",
                          "200px",
                          "300px",
                          "400px",
                          "500px",
                          "600px",
                          "800px",
                        ].includes(data.width)
                          ? data.width
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        if (
                          value === "" ||
                          /^(\d+(%|px))$/.test(value) ||
                          value === "auto"
                        ) {
                          onUpdate({ ...data, width: value || "100%" });
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        if (
                          !value ||
                          (!/^(\d+(%|px))$/.test(value) && value !== "auto")
                        ) {
                          // Revert to last valid value or default
                          const currentWidth = data.width;
                          if (
                            !currentWidth ||
                            (![
                              "auto",
                              "100%",
                              "75%",
                              "50%",
                              "33%",
                              "25%",
                              "200px",
                              "300px",
                              "400px",
                              "500px",
                              "600px",
                              "800px",
                            ].includes(currentWidth) &&
                              !/^(\d+(%|px))$/.test(currentWidth))
                          ) {
                            onUpdate({ ...data, width: "100%" });
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.target.blur();
                        }
                      }}
                      className="h-8 w-28 bg-white border-gray-300 text-gray-900 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 text-xs px-2 transition-all duration-200"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Label className="text-xs text-gray-600 whitespace-nowrap">
                      Height:
                    </Label>
                    <Select
                      value={
                        data.height &&
                        [
                          "auto",
                          "100px",
                          "150px",
                          "200px",
                          "250px",
                          "300px",
                          "400px",
                          "500px",
                          "600px",
                        ].includes(data.height)
                          ? data.height
                          : "custom"
                      }
                      onValueChange={(value) => {
                        if (value !== "custom") {
                          onUpdate({ ...data, height: value });
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 w-24 bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:text-gray-900 text-xs">
                        <SelectValue placeholder="Height" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="100px">100px</SelectItem>
                        <SelectItem value="150px">150px</SelectItem>
                        <SelectItem value="200px">200px</SelectItem>
                        <SelectItem value="250px">250px</SelectItem>
                        <SelectItem value="300px">300px</SelectItem>
                        <SelectItem value="400px">400px</SelectItem>
                        <SelectItem value="500px">500px</SelectItem>
                        <SelectItem value="600px">600px</SelectItem>
                        <SelectItem value="custom">Custom...</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      placeholder="Custom height"
                      value={
                        data.height &&
                        ![
                          "auto",
                          "100px",
                          "150px",
                          "200px",
                          "250px",
                          "300px",
                          "400px",
                          "500px",
                          "600px",
                        ].includes(data.height)
                          ? data.height
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        if (
                          value === "" ||
                          /^(\d+px)$/.test(value) ||
                          value === "auto"
                        ) {
                          onUpdate({ ...data, height: value || "auto" });
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        if (
                          !value ||
                          (!/^(\d+px)$/.test(value) && value !== "auto")
                        ) {
                          // Revert to last valid value or default
                          const currentHeight = data.height;
                          if (
                            !currentHeight ||
                            (![
                              "auto",
                              "100px",
                              "150px",
                              "200px",
                              "250px",
                              "300px",
                              "400px",
                              "500px",
                              "600px",
                            ].includes(currentHeight) &&
                              !/^(\d+px)$/.test(currentHeight))
                          ) {
                            onUpdate({ ...data, height: "auto" });
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.target.blur();
                        }
                      }}
                      className="h-8 w-28 bg-white border-gray-300 text-gray-900 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 text-xs px-2 transition-all duration-200"
                    />
                  </div>
                </>
              )}

              {/* Link Controls - additional to text controls */}
              {showLinkControls && (
                <>
                  <div className="h-6 w-px bg-gray-300 mx-1" />
                  <Input
                    type="text"
                    placeholder="Link text"
                    value={data.text || ""}
                    onChange={(e) =>
                      onUpdate({ ...data, text: e.target.value })
                    }
                    className="h-8 w-32 bg-white border-gray-300 text-gray-900 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 text-sm px-2 transition-all duration-200"
                  />
                  <Input
                    type="text"
                    placeholder="URL"
                    value={data.url || ""}
                    onChange={(e) => onUpdate({ ...data, url: e.target.value })}
                    className="h-8 w-48 bg-white border-gray-300 text-gray-900 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 text-sm px-2 transition-all duration-200"
                  />
                </>
              )}

              {/* Divider Controls */}
              {showDividerControls && (
                <>
                  <div className="h-6 w-px bg-gray-300 mx-1" />
                  <Select
                    value={data.style || "solid"}
                    onValueChange={(value) =>
                      onUpdate({ ...data, style: value })
                    }
                  >
                    <SelectTrigger className="h-8 w-24 bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 px-2 transition-all duration-200"
                      >
                        <div
                          className="h-4 w-4 rounded border border-gray-300"
                          style={{ backgroundColor: data.color || "#e5e7eb" }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Input
                          type="color"
                          value={data.color || "#e5e7eb"}
                          onChange={(e) =>
                            onUpdate({ ...data, color: e.target.value })
                          }
                          className="h-10 w-full"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              )}

              {/* Spacer Controls */}
              {showSpacerControls && (
                <>
                  <div className="h-6 w-px bg-gray-300 mx-1" />
                  <Input
                    type="number"
                    placeholder="Height (px)"
                    value={parseInt(data.height?.replace("px", "") || "20")}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 20;
                      onUpdate({ ...data, height: `${value}px` });
                    }}
                    className="h-8 w-24 bg-white border-gray-300 text-gray-900 text-sm px-2 transition-all duration-200 hover:border-gray-400 focus:border-blue-500"
                  />
                </>
              )}

              {/* Container Controls */}
              {showContainerControls && (
                <>
                  <div className="h-6 w-px bg-gray-300 mx-1" />
                  
                  {/* Background Color */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-8 px-2 transition-all duration-200"
                        title="Background Color"
                      >
                        <div
                          className="h-4 w-4 rounded border border-gray-300"
                          style={{ backgroundColor: data.backgroundColor || "transparent" }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <Input
                          type="color"
                          value={data.backgroundColor === "transparent" ? "#ffffff" : data.backgroundColor || "#ffffff"}
                          onChange={(e) =>
                            onUpdate({ ...data, backgroundColor: e.target.value })
                          }
                          className="h-10 w-full"
                        />
                         <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => onUpdate({ ...data, backgroundColor: "transparent" })}
                        >
                          Clear (Transparent)
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Padding */}
                  <div className="flex items-center gap-1">
                    <Label className="text-xs text-gray-500">Pad:</Label>
                    <Select
                      value={data.padding || "20px"}
                      onValueChange={(value) =>
                        onUpdate({ ...data, padding: value })
                      }
                    >
                      <SelectTrigger className="h-8 w-20 bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:text-gray-900 text-xs">
                        <SelectValue placeholder="Padding" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0px">0px</SelectItem>
                        <SelectItem value="10px">10px</SelectItem>
                        <SelectItem value="20px">20px</SelectItem>
                        <SelectItem value="30px">30px</SelectItem>
                        <SelectItem value="40px">40px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Border Radius */}
                  <div className="flex items-center gap-1">
                    <Label className="text-xs text-gray-500">Radius:</Label>
                    <Select
                      value={data.borderRadius || "0px"}
                      onValueChange={(value) =>
                        onUpdate({ ...data, borderRadius: value })
                      }
                    >
                      <SelectTrigger className="h-8 w-20 bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:text-gray-900 text-xs">
                        <SelectValue placeholder="Radius" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="0px">None</SelectItem>
                         <SelectItem value="4px">Small</SelectItem>
                         <SelectItem value="8px">Medium</SelectItem>
                         <SelectItem value="16px">Large</SelectItem>
                         <SelectItem value="24px">X-Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Image Picker Dialog */}
      {showImagePicker && (
        <Dialog open={showImagePicker} onOpenChange={setShowImagePicker}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Select or Upload Image</DialogTitle>
            </DialogHeader>
            <ImagePicker
              onSelectUrl={(url) => {
                onUpdate({ ...data, src: url });
                setShowImagePicker(false);
              }}
              session={session}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Image Picker Component
function ImagePicker({ onSelectUrl, session }) {
  const [tab, setTab] = useState("gallery");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");

  const onUpload = async (file) => {
    if (!file || !userId) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const created = await campaignImagesService.uploadFile(
        file,
        file.name,
        userId
      );
      setImages((prev) => [created, ...prev]);
      onSelectUrl(created.url);
    } catch (e) {
      setError(e?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const onSaveLink = async () => {
    if (!link || !userId) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const created = await campaignImagesService.saveLink(link, "", userId);
      setImages((prev) => [created, ...prev]);
      onSelectUrl(created.url);
    } catch (e) {
      setError(e?.message || "Save link failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          className={`px-3 py-1 rounded border ${
            tab === "gallery" ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => setTab("gallery")}
        >
          Gallery
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded border ${
            tab === "upload" ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => setTab("upload")}
        >
          Upload
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded border ${
            tab === "link" ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => setTab("link")}
        >
          Link
        </button>
      </div>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {loading && <div className="text-sm text-gray-500">Loading...</div>}

      {tab === "gallery" && (
        <div className="grid grid-cols-6 gap-3 max-h-72 overflow-auto">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => onSelectUrl(img.url)}
              className="border rounded overflow-hidden hover:ring-2 hover:ring-blue-500"
            >
              <img
                src={img.url}
                alt={img.name || "image"}
                className="w-full h-24 object-cover"
              />
            </button>
          ))}
          {!images.length && !loading && (
            <div className="text-sm text-gray-500 col-span-6">
              No images yet
            </div>
          )}
        </div>
      )}

      {tab === "upload" && (
        <ImageUploadSection onUpload={onUpload} loading={loading} />
      )}

      {tab === "link" && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="https://..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button
            type="button"
            className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={onSaveLink}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

function ImageUploadSection({ onUpload, loading }) {
  const [file, setFile] = useState(null);
  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFile(
            e.target.files && e.target.files[0] ? e.target.files[0] : null
          )
        }
      />
      <button
        type="button"
        disabled={!file || loading}
        className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
        onClick={() => file && onUpload(file)}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
