"use client";

import React from "react";
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
  Square,
} from "lucide-react";

const components = [
  {
    type: "column",
    name: "Column",
    icon: Square,
    description: "Full-width column layout",
    defaultData: {
      width: "100%",
      backgroundColor: "#ffffff",
      padding: "0px",
      columns: "1",
      gap: "20px",
      columnWidths: [],
      columnsData: [],
    },
  },
  {
    type: "text-block",
    name: "Text Block",
    icon: Type,
    description: "Rich text content",
    defaultData: {
      content: "<p>Text</p>",
      font: "Arial",
      fontSize: "16px",
      alignment: "center",
      letterSpacing: 0,
      lineHeight: 1.5,
      backgroundColor: "#ffffff",
    },
  },
  {
    type: "list",
    name: "List",
    icon: listIcon,
    description: "list items",
    defaultData: {
      content: "<ul><li>Text</li></ul>",
      font: "Arial",
      fontSize: "16px",
      letterSpacing: 0,
      lineHeight: 1.5,
    },
  },
  {
    type: "heading",
    name: "Heading",
    icon: Heading,
    description: "Section headings",
    defaultData: {
      content: "Heading",
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
    defaultData: {
      text: "Click Here",
      url: "https://",
      backgroundColor: "#000000",
      color: "#ffffff",
      padding: "12px 24px",
      borderRadius: "4px",
    },
  },
  {
    type: "link",
    name: "Link",
    icon: Link,
    description: " link text",
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
    defaultData: {
      height: "20px",
    },
  },
  {
    type: "social-media",
    name: "Social Media",
    icon: Share2,
    description: "Social media icons",
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
];

export function ComponentSidebar() {
  const handleDragStart = (e, component) => {
    e.dataTransfer.setData("application/json", JSON.stringify(component));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="p-4">
      <div className="space-y-2">
        {components.map((component) => (
          <div
            key={component.type}
            draggable
            onDragStart={(e) => handleDragStart(e, component)}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-sm"
          >
            <component.icon className="h-4 w-4 text-gray-600 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-900">
              {component.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
