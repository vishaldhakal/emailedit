"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Heading,
  Link,
  MoveVertical,
  Type,
  List as listIcon,
  Image,
  MousePointer,
  Minus,
  Share2,
  Columns2,
  Columns3,
  Undo2,
  Redo2,
  ChevronRight,
  FileText,
  Rocket,
  Save,
} from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Pastel color palette for icon backgrounds only
const componentColors = {
  "two-column": {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  "three-column": {
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  "text-block": {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  list: {
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  heading: {
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  image: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  button: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  link: {
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  divider: {
    iconBg: "bg-slate-50",
    iconColor: "text-slate-600",
  },
  spacer: {
    iconBg: "bg-gray-50",
    iconColor: "text-gray-600",
  },
  "social-media": {
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  footer: {
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
};

const components = [
  {
    type: "two-column",
    name: "Two Column",
    icon: Columns2,
    description: "Two column layout",
    category: "Layout",
    defaultData: {
      width: "100%",
      backgroundColor: "transparent",
      padding: "0px",
      gap: "20px",
      columnWidths: [],
      columnsData: [[], []],
    },
  },
  {
    type: "three-column",
    name: "Three Column",
    icon: Columns3,
    description: "Three column layout",
    category: "Layout",
    defaultData: {
      width: "100%",
      backgroundColor: "transparent",
      padding: "0px",
      gap: "20px",
      columnWidths: [],
      columnsData: [[], [], []],
    },
  },
  {
    type: "text-block",
    name: "Text Block",
    icon: Type,
    description: "Rich text content",
    category: "Text",
    defaultData: {
      content: "<p>Write your text here</p>",
      font: "Arial",
      fontSize: "16px",
      alignment: "center",
      color: "#000000",
      letterSpacing: 0,
      lineHeight: 1.5,
      backgroundColor: "#ffffff",
    },
  },
  {
    type: "list",
    name: "List",
    icon: listIcon,
    description: "List items",
    category: "Text",
    defaultData: {
      content: "<ul><li>Text</li></ul>",
      font: "Arial",
      fontSize: "16px",
      color: "#000000",
      letterSpacing: 0,
      lineHeight: 1.5,
    },
  },
  {
    type: "heading",
    name: "Heading",
    icon: Heading,
    description: "Section headings",
    category: "Text",
    defaultData: {
      content: "This is a Heading",
      level: "h3",
      color: "#000000",
      alignment: "center",
      font: "Arial",
      fontSize: "24px",
      bold: false,
      italic: false,
      underline: false,
      letterSpacing: 0,
      lineHeight: 1.5,
      backgroundColor: "#ffffff",
    },
  },
  {
    type: "image",
    name: "Image",
    icon: Image,
    description: "Add images to your email",
    category: "Media",
    defaultData: {
      src: "",
      alt: "Image",
      width: "100%",
      height: "auto",
    },
  },
  {
    type: "button",
    name: "Button",
    icon: MousePointer,
    description: "Call-to-action button",
    category: "Interactive",
    defaultData: {
      text: "Click Here",
      url: "https://",
      backgroundColor: "#000000",
      color: "#ffffff",
      padding: "12px 24px",
      borderRadius: "4px",
      borderWidth: "0px",
      borderColor: "#000000",
      borderStyle: "solid",
    },
  },
  {
    type: "link",
    name: "Link",
    icon: Link,
    description: "Link text",
    category: "Interactive",
    defaultData: {
      text: "click here",
      url: "",
      color: "#000000",
      underline: true,
      alignment: "center",
    },
  },
  {
    type: "divider",
    name: "Divider",
    icon: Minus,
    description: "Horizontal line separator",
    category: "Layout",
    defaultData: {
      style: "solid",
      color: "#e5e7eb",
      height: "1px",
    },
  },
  {
    type: "spacer",
    name: "Spacer",
    icon: MoveVertical,
    description: "Vertical spacing",
    category: "Layout",
    defaultData: {
      height: "20px",
    },
  },
  {
    type: "social-media",
    name: "Social Media",
    icon: Share2,
    description: "Social media icons",
    category: "Interactive",
    defaultData: {
      platforms: [
        { name: "facebook", url: "https://facebook.com" },
        { name: "twitter", url: "https://twitter.com" },
        { name: "instagram", url: "https://instagram.com" },
      ],
      iconSize: "24px",
      color: "#666666",
      alignment: "center",
    },
  },
  {
    type: "footer",
    name: "Footer",
    icon: FileText,
    description: "Email footer with company info",
    category: "Layout",
    defaultData: {
      // Footer data comes from user settings
      _isFooter: true,
    },
  },
];

export function ComponentSidebar({}) {
  const handleDragStart = (e, component) => {
    e.dataTransfer.setData("application/json", JSON.stringify(component));
    e.dataTransfer.effectAllowed = "copy";
  };

  const getComponentColors = (type) => {
    return componentColors[type] || componentColors["two-column"];
  };

  return (
    <div className="h-[85vh] flex flex-col bg-white">
      {/* Simple Undo/Redo Header */}
      {/* <div className="flex-shrink-0 px-2.5 py-2 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className={`h-7 w-7 p-0 rounded-md transition-colors ${
              canUndo
                ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                : "text-gray-300 cursor-not-allowed"
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className={`h-7 w-7 p-0 rounded-md transition-colors ${
              canRedo
                ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                : "text-gray-300 cursor-not-allowed"
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div> */}

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="grid grid-cols-3 gap-3">
          {components.map((component) => {
            const colors = getComponentColors(component.type);
            return (
              <div
                key={component.type}
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
                className="drag-hover-effect group flex flex-col items-center gap-0.5 py-1.5 rounded-md cursor-grab active:cursor-grabbing"
              >
                <div
                  className={`
                      flex-shrink-0 w-16 h-14 flex items-center justify-center
                      ${colors.iconBg} rounded
                      transition-all duration-200 ease-out
                      `}
                >
                  <component.icon
                    className={`h-5 w-5 ${colors.iconColor} transition-transform duration-200 group-hover:scale-110`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900 truncate">
                    {component.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
