"use client";
import { EmailEditor } from "@/components/email-editor";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
export default function Home() {
  const params = useParams();
  const { id } = params;
  const [template, setTemplate] = useState(null);
  useEffect(() => {
    const fetchTemplate = async () => {
      const res = await fetch(`https://api.salesmonk.ca/api/templates/${id}/`);
      const data = await res.json();
      setTemplate(data);
    };
    fetchTemplate();
  }, [id]);
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {template ? (
        <EmailEditor
          headerVariant="template"
          storageKey="emailEditor_edit"
          template={template} // pass template here
        />
      ) : (
        <div className="flex flex-col items-center gap-2 mt-52">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm mt-2">Loading template...</p>
        </div>
      )}
    </div>
  );
}
