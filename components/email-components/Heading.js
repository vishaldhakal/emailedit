"use client";

import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { FaPaintbrush } from "react-icons/fa6";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const Heading = memo(function Heading({ data, onUpdate, isSelected }) {
  const {
    content,
    level,
    backgroundColor,
    color,
    alignment,
    font,
    fontSize,
    bold,
    italic,
    underline,
    letterSpacing,
    lineHeight,
  } = data;

  // Ensure boolean values are properly converted
  const normalizedBold =
    typeof bold === "string" ? bold === "true" : Boolean(bold);
  const normalizedItalic =
    typeof italic === "string" ? italic === "true" : Boolean(italic);
  const normalizedUnderline =
    typeof underline === "string" ? underline === "true" : Boolean(underline);

  const Tag = level || "h3";
  const ref = useRef(null);
  const debounceRef = useRef(null);

  // Add CSS to override default heading styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .custom-heading {
        margin: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        all: unset !important;
        display: block !important;
        padding: 0.5rem 0 !important;
        min-height: 2rem !important;
      }
      .custom-heading[contenteditable="true"] {
        font-weight: inherit !important;
        font-style: inherit !important;
        text-decoration: inherit !important;
        color: inherit !important;
        background-color: inherit !important;
        text-align: inherit !important;
        font-family: inherit !important;
        letter-spacing: inherit !important;
        line-height: inherit !important;
        font-size: inherit !important;
      }
      .custom-heading a {
        text-decoration: underline !important;
        color: inherit;
        cursor: pointer;
      }
      .custom-heading a:hover {
        opacity: 0.8;
      }
      .custom-heading mark {
        opacity: 1 !important;
        mix-blend-mode: normal !important;
        isolation: isolate;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  //update ui on the basis of content prop and level
  // Only update if not actively typing to preserve cursor position
  useEffect(() => {
    if (ref.current && !isTypingRef.current) {
      // Check if content contains HTML tags (formatting)
      const hasHtml = /<[^>]+>/.test(content);

      // Save cursor position before updating
      const selection = window.getSelection();
      let cursorPosition = 0;
      if (
        selection &&
        selection.rangeCount > 0 &&
        ref.current.contains(selection.anchorNode)
      ) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(ref.current);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        cursorPosition = preCaretRange.toString().length;
      }

      if (hasHtml) {
        // Content has HTML, set innerHTML
        if (ref.current.innerHTML !== content) {
          ref.current.innerHTML = content;
        }
      } else {
        // Plain text, set textContent
        if (ref.current.textContent !== content) {
          ref.current.textContent = content;
        }
      }

      // Restore cursor position if it was saved
      if (cursorPosition > 0) {
        requestAnimationFrame(() => {
          if (ref.current) {
            try {
              const textNode = ref.current.firstChild || ref.current;
              const textLength = ref.current.textContent?.length || 0;
              const safePosition = Math.min(cursorPosition, textLength);

              const range = document.createRange();
              if (textNode.nodeType === Node.TEXT_NODE) {
                range.setStart(textNode, safePosition);
                range.setEnd(textNode, safePosition);
              } else {
                // Try to find text node at position
                let currentPos = 0;
                const walker = document.createTreeWalker(
                  ref.current,
                  NodeFilter.SHOW_TEXT,
                  null
                );
                let node = walker.nextNode();
                while (
                  node &&
                  currentPos + node.textContent.length < safePosition
                ) {
                  currentPos += node.textContent.length;
                  node = walker.nextNode();
                }

                if (node) {
                  const offset = safePosition - currentPos;
                  range.setStart(node, offset);
                  range.setEnd(node, offset);
                } else {
                  range.selectNodeContents(ref.current);
                  range.collapse(false);
                }
              }

              const sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            } catch (e) {
              // Ignore selection errors
            }
          }
        });
      }
    }
  }, [content, level]);

  // Force font size update when fontSize or level changes
  useEffect(() => {
    if (ref.current) {
      // Directly set the font size with high specificity
      ref.current.style.setProperty(
        "font-size",
        fontSize || "24px",
        "important"
      );
      // Reset any default margins
      ref.current.style.setProperty("margin", "0", "important");
      ref.current.style.setProperty("margin-top", "0", "important");
      ref.current.style.setProperty("margin-bottom", "0", "important");
    }
  }, [fontSize, level]);

  // Apply formatting when data changes
  useEffect(() => {
    if (ref.current) {
      // Force remove any existing styles that might conflict
      ref.current.style.removeProperty("font-weight");
      ref.current.style.removeProperty("font-style");
      ref.current.style.removeProperty("text-decoration");

      // Apply new styles with maximum specificity
      ref.current.style.setProperty(
        "font-weight",
        normalizedBold ? "bold" : "normal",
        "important"
      );
      ref.current.style.setProperty(
        "font-style",
        normalizedItalic ? "italic" : "normal",
        "important"
      );
      ref.current.style.setProperty(
        "text-decoration",
        normalizedUnderline ? "underline" : "none",
        "important"
      );
      ref.current.style.setProperty("color", color || "#000000", "important");
      ref.current.style.setProperty(
        "background-color",
        backgroundColor || "transparent",
        "important"
      );
      ref.current.style.setProperty(
        "text-align",
        alignment || "left",
        "important"
      );
      ref.current.style.setProperty(
        "font-family",
        font || "Arial",
        "important"
      );
      ref.current.style.setProperty(
        "letter-spacing",
        typeof letterSpacing === "number"
          ? `${letterSpacing}px`
          : letterSpacing || "0px",
        "important"
      );
      ref.current.style.setProperty(
        "line-height",
        lineHeight || "1.2",
        "important"
      );

      // Force a reflow to ensure styles are applied
      ref.current.offsetHeight;
    }
  }, [normalizedBold, normalizedItalic, normalizedUnderline, color, backgroundColor, alignment, font, letterSpacing, lineHeight]);

  // Prevent contentEditable from inserting &nbsp;
  const handleBeforeInput = (e) => {
    // Replace non-breaking spaces with regular spaces
    if (e.data === "\u00A0" || e.data === "&nbsp;") {
      e.preventDefault();
      // Use insertText command for modern browsers
      if (document.execCommand) {
        document.execCommand("insertText", false, " ");
      } else {
        // Fallback for older browsers
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(" "));
          range.collapse(false);
        }
      }
      return false;
    }
  };

  // Track if user is actively typing to prevent interference
  const isTypingRef = useRef(false);

  // Monitor for &nbsp; insertion and replace them (only when not actively typing)
  useEffect(() => {
    if (!ref.current) return;

    let timeoutId = null;

    const observer = new MutationObserver(() => {
      // Skip if user is actively typing
      if (isTypingRef.current) return;

      // Debounce the cleanup to avoid interfering with typing
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (ref.current && !isTypingRef.current) {
          let html = ref.current.innerHTML;
          if (html.includes("&nbsp;") || html.includes("\u00A0")) {
            // Save cursor position before modifying
            const selection = window.getSelection();
            let cursorPosition = 0;
            let range = null;

            if (selection && selection.rangeCount > 0) {
              range = selection.getRangeAt(0);
              // Calculate cursor position relative to text content
              const preCaretRange = range.cloneRange();
              preCaretRange.selectNodeContents(ref.current);
              preCaretRange.setEnd(range.endContainer, range.endOffset);
              cursorPosition = preCaretRange.toString().length;
            }

            // Replace &nbsp; with regular spaces
            html = html.replace(/&nbsp;/gi, " ").replace(/\u00A0/g, " ");

            // Only update if there's a change to avoid infinite loops
            if (ref.current.innerHTML !== html) {
              ref.current.innerHTML = html;

              // Restore cursor position after a brief delay
              requestAnimationFrame(() => {
                if (ref.current && selection) {
                  try {
                    const textNode = ref.current.firstChild || ref.current;
                    const textLength = ref.current.textContent?.length || 0;
                    const safePosition = Math.min(cursorPosition, textLength);

                    const newRange = document.createRange();
                    if (textNode.nodeType === Node.TEXT_NODE) {
                      newRange.setStart(textNode, safePosition);
                      newRange.setEnd(textNode, safePosition);
                    } else {
                      newRange.setStart(ref.current, 0);
                      newRange.setEnd(ref.current, 0);
                    }

                    selection.removeAllRanges();
                    selection.addRange(newRange);
                  } catch (e) {
                    // Ignore selection errors
                  }
                }
              });
            }
          }
        }
      }, 100); // Small delay to allow typing to complete
    });

    observer.observe(ref.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Handle paste events to clean up &nbsp;
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    // Replace any non-breaking spaces with regular spaces
    const cleanedText = text.replace(/\u00A0/g, " ").replace(/&nbsp;/g, " ");
    document.execCommand("insertText", false, cleanedText);
  };

  const handleInput = () => {
    // Mark that user is actively typing
    isTypingRef.current = true;

    const newText = ref.current?.innerHTML || ref.current?.textContent || "";
    // Get the HTML content to preserve formatting
    let htmlContent = ref.current?.innerHTML || "";

    // Remove all &nbsp; entities and replace with regular spaces
    if (htmlContent) {
      // Replace &nbsp; with regular spaces
      htmlContent = htmlContent
        .replace(/&nbsp;/gi, " ") // Replace all &nbsp; with spaces
        .replace(/&amp;nbsp;/gi, " ") // Replace double-encoded &nbsp;
        .replace(/\u00A0/g, " ") // Replace non-breaking space characters
        .replace(/&amp;amp;/g, "&amp;")
        .replace(/&amp;lt;/g, "&lt;")
        .replace(/&amp;gt;/g, "&gt;")
        .replace(/&amp;quot;/g, "&quot;");

      // Clean up empty tags that might contain only spaces
      htmlContent = htmlContent.replace(/<[^>]*>\s*<\/[^>]*>/g, "");
    }

    // Clean textContent as well
    const cleanedText = (ref.current?.textContent || "")
      .replace(/\u00A0/g, " ")
      .trim();

    if (cleanedText !== content.trim() || htmlContent !== content) {
      // clear previous debounce timer
      if (debounceRef.current) clearTimeout(debounceRef.current);
      // debounce: wait 500ms after last input before updating
      debounceRef.current = setTimeout(() => {
        // Use textContent if no HTML formatting, otherwise use cleaned HTML
        const hasFormatting =
          htmlContent !== cleanedText && /<[^>]+>/.test(htmlContent);
        const contentToSave = hasFormatting ? htmlContent : cleanedText;

        // Clear typing flag before updating
        isTypingRef.current = false;
        onUpdate({ ...data, content: contentToSave });
      }, 500);
    } else {
      // Clear typing flag if no change
      setTimeout(() => {
        isTypingRef.current = false;
      }, 100);
    }
  };

  // Expose heading ref to window for toolbar access
  useEffect(() => {
    if (ref.current && isSelected) {
      window.selectedHeadingRef = ref.current;
      return () => {
        if (window.selectedHeadingRef === ref.current) {
          delete window.selectedHeadingRef;
        }
      };
    }
  }, [isSelected]);

  // Handle keyboard shortcuts for formatting (only works on selected text)
  useEffect(() => {
    if (!ref.current || !isSelected) return;

    const handleKeyDown = (e) => {
      // Handle Ctrl+B for bold on selected text
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (!range.collapsed) {
            // Has selection - toggle bold
            document.execCommand("bold", false);
            selection.removeAllRanges();
          } else {
            // No selection - toggle global bold
            onUpdate({ ...data, bold: !data.bold });
          }
        } else {
          onUpdate({ ...data, bold: !data.bold });
        }
      }
      // Handle Ctrl+I for italic on selected text
      if (e.ctrlKey && e.key === "i") {
        e.preventDefault();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (!range.collapsed) {
            // Has selection - toggle italic
            document.execCommand("italic", false);
            selection.removeAllRanges();
          } else {
            // No selection - toggle global italic
            onUpdate({ ...data, italic: !data.italic });
          }
        } else {
          onUpdate({ ...data, italic: !data.italic });
        }
      }
      // Handle Ctrl+U for underline on selected text
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (!range.collapsed) {
            // Has selection - toggle underline
            document.execCommand("underline", false);
            selection.removeAllRanges();
          } else {
            // No selection - toggle global underline
            onUpdate({ ...data, underline: !data.underline });
          }
        } else {
          onUpdate({ ...data, underline: !data.underline });
        }
      }
    };

    const element = ref.current;
    element.addEventListener("keydown", handleKeyDown);
    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, data, onUpdate]);

  return (
    <div
      className={`relative group ${
        ""
      }`}
      style={{ padding: isSelected ? "2px" : "0" }}
    >
      <Tag
        className="border-none outline-none hover:bg-gray-50/30 transition-colors duration-200 rounded-sm block min-h-[1.5rem] custom-heading"
        ref={ref}
        key={level}
        onInput={handleInput}
        onBeforeInput={handleBeforeInput}
        onPaste={handlePaste}
        style={{
          color,
          backgroundColor,
          textAlign: alignment,
          letterSpacing:
            typeof letterSpacing === "number"
              ? `${letterSpacing}px`
              : letterSpacing,
          lineHeight: lineHeight || "1.2",
          fontFamily: font,
          fontSize: fontSize || "24px",
          fontWeight: normalizedBold ? "bold" : "normal",
          fontStyle: normalizedItalic ? "italic" : "normal",
          textDecoration: normalizedUnderline ? "underline" : "none",
          padding: "0.25rem 0",
          minHeight: "1.5rem",
          // Override default heading styles
          margin: "0",
          marginTop: "0",
          marginBottom: "0",
          // Ensure font size takes precedence
          fontVariant: "normal",
          textTransform: "none",
        }}
        contentEditable
        suppressContentEditableWarning
      />
      {/* Individual editor disabled - using unified toolbar */}
      {false && isSelected && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
          <Heading.Editor data={data} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
});

Heading.Editor = function HeadingEditor({ data, onUpdate }) {
  const [formData, setFormData] = useState({
    backgroundColor: data.backgroundColor,
    level: data.level,
    color: data.color,
    alignment: data.alignment,
    font: data.font,
    fontSize: data.fontSize || "24px",
    bold: data.bold || false,
    italic: data.italic || false,
    underline: data.underline || false,
    letterSpacing: data.letterSpacing || "0px",
    lineHeight: data.lineHeight || "1.5",
  });

  // Update formData when data prop changes
  useEffect(() => {
    const newFormData = {
      backgroundColor: data.backgroundColor,
      level: data.level,
      color: data.color,
      alignment: data.alignment,
      font: data.font,
      fontSize: data.fontSize || "24px",
      bold: data.bold || false,
      italic: data.italic || false,
      underline: data.underline || false,
      letterSpacing: data.letterSpacing || "0px",
      lineHeight: data.lineHeight || "1.5",
    };
    setFormData(newFormData);
  }, [data]);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const updateData = { content: data.content, ...formData };
      if (typeof onUpdate === "function") {
        onUpdate(updateData);
      }
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, data.content]);

  return (
    <div className="bg-white px-3 py-2 max-w-2xl rounded-lg shadow-lg border border-gray-100 backdrop-blur-sm">
      {/* First Line */}
      <div className="flex items-center gap-2 mb-2">
        {/* Font Family */}
        <Select
          value={formData.font}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, font: value }))
          }
        >
          <SelectTrigger className="w-[100px] h-7 text-xs border-gray-200">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
            <SelectItem value="Palatino">Palatino</SelectItem>
          </SelectContent>
        </Select>

        {/* Font Size */}
        <Select
          value={formData.fontSize?.replace("px", "") || "24"}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, fontSize: value + "px" }))
          }
        >
          <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="18">18px</SelectItem>
            <SelectItem value="20">20px</SelectItem>
            <SelectItem value="22">22px</SelectItem>
            <SelectItem value="24">24px</SelectItem>
            <SelectItem value="26">26px</SelectItem>
            <SelectItem value="28">28px</SelectItem>
            <SelectItem value="30">30px</SelectItem>
            <SelectItem value="32">32px</SelectItem>
            <SelectItem value="36">36px</SelectItem>
            <SelectItem value="40">40px</SelectItem>
            <SelectItem value="44">44px</SelectItem>
            <SelectItem value="48">48px</SelectItem>
            <SelectItem value="52">52px</SelectItem>
            <SelectItem value="56">56px</SelectItem>
            <SelectItem value="60">60px</SelectItem>
            <SelectItem value="64">64px</SelectItem>
            <SelectItem value="72">72px</SelectItem>
          </SelectContent>
        </Select>

        {/* Level */}
        <Select
          value={formData.level}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, level: value }))
          }
        >
          <SelectTrigger className="w-[45px] h-7 text-xs border-gray-200">
            <SelectValue placeholder="H" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="h1">H1</SelectItem>
            <SelectItem value="h2">H2</SelectItem>
            <SelectItem value="h3">H3</SelectItem>
            <SelectItem value="h4">H4</SelectItem>
            <SelectItem value="h5">H5</SelectItem>
            <SelectItem value="h6">H6</SelectItem>
          </SelectContent>
        </Select>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200" />

        {/* Formatting Buttons */}
        <div className="flex items-center gap-0.5">
          <Button
            variant={formData.bold ? "default" : "ghost"}
            onClick={() =>
              setFormData((prev) => ({ ...prev, bold: !prev.bold }))
            }
            size="icon"
            className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Bold className="w-3 h-3" />
          </Button>
          <Button
            variant={formData.italic ? "default" : "ghost"}
            size="icon"
            onClick={() =>
              setFormData((prev) => ({ ...prev, italic: !prev.italic }))
            }
            className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Italic className="w-3 h-3" />
          </Button>
          <Button
            variant={formData.underline ? "default" : "ghost"}
            size="icon"
            onClick={() =>
              setFormData((prev) => ({ ...prev, underline: !prev.underline }))
            }
            className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Underline className="w-3 h-3" />
          </Button>
        </div>

        {/* Letter + Line Spacing */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Move className="w-3.5 h-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-4 space-y-4">
            {/* Letter Spacing */}
            <div>
              <Label>Letter Spacing</Label>
              <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={formData.letterSpacing}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    letterSpacing: parseFloat(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="text-xs text-right">
                {(Number(formData.letterSpacing) || 0).toFixed(1)}px
              </div>
            </div>

            {/* Line Height */}
            <div>
              <Label>Line Height</Label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={formData.lineHeight}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lineHeight: parseFloat(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="text-xs text-right">
                {(Number(formData.lineHeight) || 1.5).toFixed(2)}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Second Line */}
      <div className="flex items-center gap-2">
        {/* Text Color */}
        <div className="relative group">
          <input
            type="color"
            value={formData.color || "#000000"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                color: e.target.value,
              }))
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-lg"
          />
          <div className="flex flex-col items-center justify-center cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors">
            <span className="text-xs font-bold text-gray-700">A</span>
            <span
              className="w-3 h-0.5 rounded-sm -mt-0.5 border border-gray-300"
              style={{ backgroundColor: formData.color || "#000000" }}
            ></span>
          </div>
        </div>

        {/* Background Color */}
        <div className="flex flex-col items-center justify-center relative group">
          <input
            type="color"
            value={formData.backgroundColor}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                backgroundColor: e.target.value,
              }))
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-lg"
          />
          <div className="p-1 rounded-md hover:bg-gray-50 transition-colors">
            <FaPaintbrush className="w-3 h-3 text-gray-700" />
            <div
              className="w-3 h-0.5 rounded-sm mt-0.5 border border-gray-300"
              style={{ backgroundColor: formData.backgroundColor }}
            />
          </div>
        </div>

        {/* Alignment Buttons */}
        <div className="flex items-center gap-0.5">
          {["left", "center", "right"].map((align) => {
            const Icon =
              align === "left"
                ? AlignLeft
                : align === "center"
                ? AlignCenter
                : AlignRight;
            return (
              <Button
                key={align}
                variant={formData.alignment === align ? "default" : "ghost"}
                size="icon"
                className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, alignment: align }))
                }
              >
                <Icon className="w-3 h-3" />
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
