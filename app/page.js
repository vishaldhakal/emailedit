"use client";

import { useState } from "react";
import { EmailEditor } from "@/components/email-editor";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <EmailEditor />
    </div>
  );
}
