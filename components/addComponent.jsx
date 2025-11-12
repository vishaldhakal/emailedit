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
  List as listIcon,
  Image,
  MousePointer,
  Minus,
  Share2,
  Columns2,
  Columns3,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { PopoverClose } from "@radix-ui/react-popover";

const components = [
  {
    type: "two-column",
    name: "Two Column",
    icon: Columns2,
    description: "Two column layout",
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

function AddComponent({ handleComponentClick, columnId, inbetween, index }) {
  // Priority ordering: column layouts first, then commonly used
  const priorityOrder = {
    "two-column": 0,
    "three-column": 1,
    "text-block": 2,
    heading: 3,
    image: 4,
    button: 5,
    divider: 6,
    spacer: 7,
    list: 8,
    link: 9,
    "social-media": 10,
  };

  const sortedComponents = [...components].sort((a, b) => {
    const aRank = priorityOrder[a.type] ?? 999;
    const bRank = priorityOrder[b.type] ?? 999;
    return aRank - bRank;
  });

  // Display sorted components directly
  const displayComponents = sortedComponents;

  return (
    <Popover>
      <PopoverTrigger asChild>
        {inbetween ? (
          <CirclePlus className="w-6 h-6 text-black" strokeWidth={1.5} />
        ) : (
          <div className="w-fit border border-gray-200  text-gray-600  hover:text-black rounded-full px-3 py-2 cursor-pointer flex justify-center items-center gap-2 hover:bg-slate-50">
            <Plus size={18} />
            <span className="text-sm">Add component</span>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="center"
        sideOffset={8}
        className="w-[420px] p-0 bg-white rounded-xl shadow-2xl"
      >
        <ScrollArea className="flex-1 h-fit hide-scrollbar">
          <div className="p-3">
            <div className="grid grid-cols-2 ">
              {displayComponents.map((component) => (
                <PopoverClose key={component.type} asChild>
                  <div
                    onClick={() =>
                      handleComponentClick(component, columnId, index)
                    }
                    className="w-full p-3 border-b border-gray-100 cursor-pointer bg-white flex items-center gap-2 transition-all hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-sm"
                  >
                    <component.icon className="h-5 w-5 text-slate-800" />
                    <span className="text-[11px] font-medium text-slate-900 text-center leading-tight">
                      Add a {component.name}
                    </span>
                  </div>
                </PopoverClose>
              ))}
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export default AddComponent;
