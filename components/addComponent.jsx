import React from "react";
import { Move, Plus } from "lucide-react";
import { CirclePlus } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Heading,
  Link,
  MoveVertical,
  Type,
  Image,
  MousePointer,
  Minus,
  Share2,
  Square,
} from "lucide-react";
import { FaLink } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PopoverClose } from "@radix-ui/react-popover";

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
      columnsData: [],
    },
  },

  {
    type: "text-block",
    name: "Text Block",
    icon: Type,
    description: "Rich text content",
    defaultData: {
      content: "Text",
      font: "Arial",
      fontSize: "16px",
      color: "#000000",
      alignment: "left",
      bold: false,
      italic: false,
      underline: false,
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
      alignment: "left",
      font: "Arial",
      bold: false,
      italic: false,
      underline: false,
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
      backgroundColor: "#007bff",
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
      alignment: "left",
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

function AddComponent({ handleComponentClick, columnId, inbetween, index }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {inbetween ? (
          <CirclePlus className="w-4 h-4 text-slate-500" />
        ) : (
          <div className="w-full  border rounded-md pl-3 py-1 cursor-pointer border-slate-600 flex  items-center gap-2">
            <Plus size={18} />
            Add Component
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <ScrollArea className="flex-1 h-[300px]">
          <div className="p-4">
            <Accordion type="single" defaultValue="all" collapsible>
              <AccordionItem value="all">
                {/* No AccordionTrigger */}
                <AccordionContent className="pt-0">
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {components.map((component) => (
                      <PopoverClose key={component.type} asChild>
                        <div
                          onClick={() =>
                            handleComponentClick(component, columnId, index)
                          }
                          className="p-3 border border-border rounded-lg cursor-pointer hover:border-primary hover:bg-accent transition-colors"
                        >
                          <div className="flex flex-col items-center text-center">
                            <component.icon className="h-6 w-6 text-primary mb-2" />
                            <span className="text-xs font-medium text-foreground">
                              {component.name}
                            </span>
                          </div>
                        </div>
                      </PopoverClose>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export default AddComponent;
