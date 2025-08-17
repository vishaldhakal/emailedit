import React, { useMemo, useState } from "react";
import { Plus, CirclePlus } from "lucide-react";
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
  Square,
} from "lucide-react";
import { FaLink } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
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
    type: "list",
    name: "List",
    icon: listIcon,
    description: "list items",
    defaultData: {
      listType: "unordered",
      listStyle: "disc",
      fontSize: "16px",
      color: "#333333",
      items: ["item1", "item2", "item3"],
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
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return components;
    return components.filter((c) =>
      [c.name, c.type, c.description]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {inbetween ? (
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 text-slate-700 shadow-md border border-border flex items-center justify-center hover:text-foreground hover:shadow-lg transition"
            aria-label="Add component"
          >
            <CirclePlus className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-full rounded-xl px-4 py-3 cursor-pointer bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 text-foreground shadow-md hover:shadow-lg transition flex items-center gap-3">
            <Plus size={18} />
            <span className="text-sm font-medium">Add New Component</span>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-2xl shadow-xl border border-border">
        <div className="p-3 border-b">
          <Input
            placeholder="Search components"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <ScrollArea className="h-[360px]">
          <ul className="divide-y divide-border">
            {filtered.map((component) => (
              <PopoverClose key={component.type} asChild>
                <li
                  className="px-4 py-3 cursor-pointer hover:bg-accent/50 transition flex items-center gap-3"
                  onClick={() =>
                    handleComponentClick(component, columnId, index)
                  }
                >
                  <div className="h-9 w-9 rounded-lg bg-accent text-foreground flex items-center justify-center shadow-sm border border-border">
                    <component.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium leading-none truncate">
                      {component.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {component.description}
                    </div>
                  </div>
                </li>
              </PopoverClose>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                No components found
              </li>
            )}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export default AddComponent;
