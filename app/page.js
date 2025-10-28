"use client";

import { EmailEditor } from "@/components/email-editor";

export default function Home() {
  return (
    <div className="flex flex-col bg-gray-200 relative overflow-hidden ">
      <div className="relative z-10">
        <EmailEditor headerVariant="default" storageKey="emailEditor_home" />
      </div>
    </div>
  );
}
