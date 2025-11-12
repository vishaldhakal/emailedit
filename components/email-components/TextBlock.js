"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import UnderlineExtension from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Label } from "@/components/ui/label";
import { FaPaintbrush } from "react-icons/fa6";
import { Extension } from "@tiptap/core";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
  Strikethrough,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Custom FontSize Extension
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ commands }) => {
          return commands.setMark("textStyle", { fontSize });
        },
      unsetFontSize:
        () =>
        ({ commands }) => {
          return commands.setMark("textStyle", { fontSize: null });
        },
    };
  },
});

// Custom FontFamily Extension
const FontFamily = Extension.create({
  name: "fontFamily",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) =>
              element.style.fontFamily?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) {
                return {};
              }
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontFamily:
        (fontFamily) =>
        ({ commands }) => {
          return commands.setMark("textStyle", { fontFamily });
        },
      unsetFontFamily:
        () =>
        ({ commands }) => {
          return commands.setMark("textStyle", { fontFamily: null });
        },
    };
  },
});
export function TextBlock({ data, onUpdate, isSelected }) {
  // Add CSS to override TipTap default styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .tiptap {
        margin: 0 !important;
        padding: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        outline: none !important;
      }
      .tiptap p {
        margin: 0 !important;
        padding: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .tiptap mark {
        padding: 2px 0;
        opacity: 1 !important;
        mix-blend-mode: normal !important;
        isolation: isolate;
      }
      .tiptap a {
        text-decoration: underline !important;
        color: inherit;
        cursor: pointer;
      }
      .tiptap a:hover {
        opacity: 0.8;
      }
      .tiptap p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: #9ca3af;
        pointer-events: none;
        height: 0;
      }
      .tiptap.is-editor-empty::before {
        content: attr(data-placeholder);
        float: left;
        color: #9ca3af;
        pointer-events: none;
        height: 0;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      TextStyle,
      Color,
      FontSize,
      FontFamily,
      UnderlineExtension,
      Link.configure({
        openOnClick: false, // Prevent navigation during editing
        HTMLAttributes: {
          style: "text-decoration: underline;",
        },
      }),
      TextAlign.configure({ types: ["paragraph"] }),
      Placeholder.configure({
        placeholder: "Write your text here",
        emptyEditorClass: "is-editor-empty",
      }),
      // Add Highlight extension
      Extension.create({
        name: "highlight",
        addOptions() {
          return {
            types: ["textStyle"],
          };
        },
        addGlobalAttributes() {
          return [
            {
              types: ["textStyle"],
              attributes: {
                backgroundColor: {
                  default: null,
                  parseHTML: (element) =>
                    element.style.backgroundColor?.replace(/['"]+/g, ""),
                  renderHTML: (attributes) => {
                    if (!attributes.backgroundColor) {
                      return {};
                    }
                    return {
                      style: `background-color: ${attributes.backgroundColor}`,
                    };
                  },
                },
              },
            },
          ];
        },
        addCommands() {
          return {
            setHighlight:
              (color) =>
              ({ commands }) => {
                return commands.setMark("textStyle", { backgroundColor: color });
              },
            unsetHighlight:
              () =>
              ({ commands }) => {
                return commands.setMark("textStyle", { backgroundColor: null });
              },
          };
        },
      }),
    ],
    content: data.content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdate({ ...data, content: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none",
        style: "margin: 0; padding: 0; padding-left: 0; padding-right: 0;",
      },
    },
  });

  // Expose editor methods to parent via window for toolbar access
  useEffect(() => {
    if (editor && isSelected) {
      window.textBlockEditor = editor;
      return () => {
        if (window.textBlockEditor === editor) {
          delete window.textBlockEditor;
        }
      };
    }
  }, [editor, isSelected]);
  return (
    <div className={`relative group`}>
      <div className="min-h-[1.5rem] hover:bg-gray-50/30 transition-colors duration-200 rounded-sm">
        <EditorContent
          editor={editor}
          style={{
            fontFamily: data.font,
            fontSize: data.fontSize,
            backgroundColor: data.backgroundColor || "transparent",
            textAlign: data.alignment,
            letterSpacing: data.letterSpacing,
            lineHeight: data.lineHeight,
            color: data.color || "#000000",
            minHeight: "1.5rem",
            padding: "0.25rem 0",
            margin: "0",
            marginLeft: "0",
            marginRight: "0",
            paddingLeft: "0",
            paddingRight: "0",
          }}
          className="focus-within:bg-blue-50/20 transition-colors duration-200"
        />
      </div>
      {/* Individual editor disabled - using unified toolbar */}
      {false && isSelected && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
          <TextBlock.Editor editor={editor} data={data} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

TextBlock.Editor = function TextBlockEditor({ data, onUpdate, editor }) {
  if (!editor) return null;

  const [formData, setFormData] = useState({
    font: data.font,
    fontSize: data.fontSize,
    backgroundColor: data.backgroundColor,
    alignment: data.alignment,
    letterSpacing: data.letterSpacing,
    lineHeight: data.lineHeight,
  });

  const [selectedFontFamily, setSelectedFontFamily] = useState("");
  const [selectedFontSize, setSelectedFontSize] = useState("");

  // Update selected font family and size based on cursor position
  useEffect(() => {
    if (!editor) return;

    const updateSelectionState = () => {
      const attrs = editor.getAttributes("textStyle");
      setSelectedFontFamily(attrs.fontFamily || formData.font || "Arial");
      setSelectedFontSize(
        attrs.fontSize?.replace("px", "") ||
          formData.fontSize?.replace("px", "") ||
          "16"
      );
    };

    editor.on("selectionUpdate", updateSelectionState);
    editor.on("update", updateSelectionState);
    updateSelectionState();

    return () => {
      editor.off("selectionUpdate", updateSelectionState);
      editor.off("update", updateSelectionState);
    };
  }, [editor, formData.font, formData.fontSize]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate({ ...data, content: editor.getHTML(), ...formData });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, editor?.getHTML()]);

  return (
    <div className="bg-white px-3 py-2 max-w-2xl rounded-lg shadow-lg border border-gray-100 backdrop-blur-sm">
      {/* First Line */}
      <div className="flex items-center gap-2 mb-2">
        {/* Font Family - Applies to selection or sets default */}
        <Select
          value={selectedFontFamily}
          onValueChange={(value) => {
            const { from, to } = editor.state.selection;
            if (from === to) {
              // No selection - set default for entire block
              setFormData((prev) => ({ ...prev, font: value }));
            } else {
              // Apply to selected text
              editor
                .chain()
                .focus()
                .setMark("textStyle", { fontFamily: value })
                .run();
            }
            setSelectedFontFamily(value);
          }}
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

        {/* Font Size - Applies to selection or sets default */}
        <Select
          value={selectedFontSize}
          onValueChange={(value) => {
            const { from, to } = editor.state.selection;
            if (from === to) {
              // No selection - set default for entire block
              setFormData((prev) => ({ ...prev, fontSize: value + "px" }));
            } else {
              // Apply to selected text
              editor
                .chain()
                .focus()
                .setMark("textStyle", { fontSize: value + "px" })
                .run();
            }
            setSelectedFontSize(value);
          }}
        >
          <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10px</SelectItem>
            <SelectItem value="11">11px</SelectItem>
            <SelectItem value="12">12px</SelectItem>
            <SelectItem value="13">13px</SelectItem>
            <SelectItem value="14">14px</SelectItem>
            <SelectItem value="15">15px</SelectItem>
            <SelectItem value="16">16px</SelectItem>
            <SelectItem value="17">17px</SelectItem>
            <SelectItem value="18">18px</SelectItem>
            <SelectItem value="19">19px</SelectItem>
            <SelectItem value="20">20px</SelectItem>
            <SelectItem value="22">22px</SelectItem>
            <SelectItem value="24">24px</SelectItem>
            <SelectItem value="26">26px</SelectItem>
            <SelectItem value="28">28px</SelectItem>
            <SelectItem value="30">30px</SelectItem>
            <SelectItem value="32">32px</SelectItem>
            <SelectItem value="36">36px</SelectItem>
            <SelectItem value="40">40px</SelectItem>
            <SelectItem value="48">48px</SelectItem>
          </SelectContent>
        </Select>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200" />

        {/* Formatting Buttons */}
        <div className="flex items-center gap-0.5">
          <Button
            variant={editor.isActive("bold") ? "default" : "ghost"}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent focus change
              editor.chain().toggleBold().run();
            }}
            size="icon"
            className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Bold className="w-3 h-3" />
          </Button>
          <Button
            variant={editor.isActive("italic") ? "default" : "ghost"}
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent focus change
              editor.chain().toggleItalic().run();
            }}
            className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Italic className="w-3 h-3" />
          </Button>
          <Button
            variant={editor.isActive("underline") ? "default" : "ghost"}
            size="icon"
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent focus change
              editor.chain().toggleUnderline().run();
            }}
            className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Underline className="w-3 h-3" />
          </Button>
        </div>

        {/* Insert Tags */}
        <Select
          value={""}
          onValueChange={(value) => {
            if (!value) return;
            const tagValue = `{${value}}`;
            editor.chain().focus().insertContent(tagValue).run();
          }}
        >
          <SelectTrigger className="w-[140px] h-7 text-xs border-gray-200">
            <SelectValue placeholder="Insert tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="first_name">First Name</SelectItem>
            <SelectItem value="last_name">Last Name</SelectItem>
            <SelectItem value="full_name">Full Name</SelectItem>
            <SelectItem value="email">Email Address</SelectItem>
            <SelectItem value="company_name">Company Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Second Line */}
      <div className="flex items-center gap-2">
        {/* Text Color */}
        <div className="relative group">
          <input
            type="color"
            value={editor.getAttributes("textStyle")?.color || "#000000"}
            onChange={(e) => {
              e.preventDefault();
              editor.chain().setColor(e.target.value).run();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-lg"
          />
          <div className="flex flex-col items-center justify-center cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors">
            <span className="text-xs font-bold text-gray-700">A</span>
            <span
              className="w-3 h-0.5 rounded-sm -mt-0.5 border border-gray-300"
              style={{
                backgroundColor:
                  editor.getAttributes("textStyle")?.color || "#000000",
              }}
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
                variant={
                  editor.isActive({ textAlign: align }) ? "default" : "ghost"
                }
                size="icon"
                className="h-6 w-6 rounded-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().setTextAlign(align).run();
                }}
              >
                <Icon className="w-3 h-3" />
              </Button>
            );
          })}
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
    </div>
  );
};
