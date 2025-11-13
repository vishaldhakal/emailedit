"use client";
import { Download, Save } from "lucide-react";
import AIEmailGenerator from "./ai-email-generator";
import { generateHtml } from "@/lib/export-html";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { TemplateContext } from "@/lib/template-provider";
export function Header() {
  const { latestComponents, setLatestComponents } = useContext(TemplateContext);
  const handleGenerateEmail = (aiComponents) => {
    setLatestComponents(aiComponents); // update state in context
  };

  const pathname = usePathname();
  const handleExport = () => {
    const html = generateHtml(latestComponents);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-gray-200 px-4 lg:px-28 ">
      <div className="flex h-14 items-center justify-between">
        <div className="flex flex-col justify-center">
          <Link href="/">
            <h1 className="m-0 text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Campaign Builder
            </h1>
          </Link>
        </div>
        {pathname.startsWith("/template/") && (
          <div className="flex items-center gap-2 sm:gap-3">
            <AIEmailGenerator onEmailGenerated={handleGenerateEmail} />
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
