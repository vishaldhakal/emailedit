"use client";

import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";

export function InlineEditableTitle({
  value,
  onSave,
  placeholder = "Untitled Campaign",
  className = "",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(value || "");
  };

  const handleSave = async () => {
    if (editValue.trim() === (value || "").trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving campaign name:", error);
      // Revert to original value on error
      setEditValue(value || "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={`text-base font-semibold text-gray-900 tracking-tight bg-transparent border-b-2 border-gray-300 focus:border-black focus:outline-none ${className}`}
          placeholder={placeholder}
          disabled={isSaving}
        />
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Check className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <h1
      onClick={handleStartEdit}
      className={`text-base font-semibold text-gray-900 tracking-tight cursor-pointer hover:text-gray-700 transition-colors ${className}`}
    >
      {value || placeholder}
    </h1>
  );
}
