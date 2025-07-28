"use client";

import { useState } from "react";
import {
  Layout,
  Type,
  Image,
  MousePointer,
  Minus,
  Share2,
  Menu,
  Columns,
  Square,
  Grid,
  Rows,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const componentCategories = {
  layouts: {
    title: "Layouts",
    icon: Layout,
    components: [
      {
        type: "single-column",
        name: "Single Column",
        icon: Square,
        description: "Full-width single column layout",
        defaultData: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "20px",
        },
      },
      {
        type: "two-columns-50",
        name: "Two Columns (50/50)",
        icon: Columns,
        description: "Two equal-width columns",
        defaultData: {
          leftWidth: "50%",
          rightWidth: "50%",
          backgroundColor: "#ffffff",
          padding: "20px",
          gap: "20px",
        },
      },
      {
        type: "two-columns-33-67",
        name: "Two Columns (33/67)",
        icon: Columns,
        description: "Narrow left, wide right",
        defaultData: {
          leftWidth: "33%",
          rightWidth: "67%",
          backgroundColor: "#ffffff",
          padding: "20px",
          gap: "20px",
        },
      },
      {
        type: "two-columns-67-33",
        name: "Two Columns (67/33)",
        icon: Columns,
        description: "Wide left, narrow right",
        defaultData: {
          leftWidth: "67%",
          rightWidth: "33%",
          backgroundColor: "#ffffff",
          padding: "20px",
          gap: "20px",
        },
      },
      {
        type: "three-columns",
        name: "Three Columns",
        icon: Grid,
        description: "Three equal-width columns",
        defaultData: {
          columnWidth: "33.33%",
          backgroundColor: "#ffffff",
          padding: "20px",
          gap: "20px",
        },
      },
      {
        type: "four-columns",
        name: "Four Columns",
        icon: Rows,
        description: "Four equal-width columns",
        defaultData: {
          columnWidth: "25%",
          backgroundColor: "#ffffff",
          padding: "20px",
          gap: "20px",
        },
      },
    ],
  },
  content: {
    title: "Content",
    icon: Type,
    components: [
      {
        type: "text-block",
        name: "Text Block",
        icon: Type,
        description: "Rich text content",
        defaultData: {
          content: "Text",
          fontSize: "16px",
          color: "#000000",
          alignment: "left",
        },
      },
      {
        type: "heading",
        name: "Heading",
        icon: Type,
        description: "Section headings",
        defaultData: {
          content: "Heading",
          level: "h3",
          color: "#000000",
          alignment: "left",
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
          url: "#",
          backgroundColor: "#007bff",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "4px",
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
        icon: Minus,
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
      {
        type: "navigation",
        name: "Navigation",
        icon: Menu,
        description: "Menu navigation",
        defaultData: {
          items: [
            { text: "Home", url: "#" },
            { text: "About", url: "#" },
            { text: "Contact", url: "#" },
          ],
          alignment: "center",
          fontSize: "16px",
          color: "#000000",
        },
      },
    ],
  },
};

export function ComponentsPanel({ onAddComponent }) {
  const [draggedComponent, setDraggedComponent] = useState(null);

  const handleDragStart = (e, component) => {
    setDraggedComponent(component);
    e.dataTransfer.setData("application/json", JSON.stringify(component));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setDraggedComponent(null);
  };

  const handleComponentClick = (component) => {
    onAddComponent(component.type, component.defaultData);
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Components</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Drag components to the canvas or click to add
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={["layouts", "content"]}>
            {Object.entries(componentCategories).map(([key, category]) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-sm font-medium">
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {category.components.map((component) => (
                      <div
                        key={component.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, component)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleComponentClick(component)}
                        className={`
                          p-3 border border-border rounded-lg cursor-pointer
                          hover:border-primary hover:bg-accent transition-colors
                          ${
                            draggedComponent?.type === component.type
                              ? "opacity-50"
                              : ""
                          }
                        `}
                      >
                        <div className="flex flex-col items-center text-center">
                          <component.icon className="h-6 w-6 text-primary mb-2" />
                          <span className="text-xs font-medium text-foreground">
                            {component.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
