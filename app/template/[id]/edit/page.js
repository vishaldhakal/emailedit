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
        <div className="flex items-center justify-center h-full w-full">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
