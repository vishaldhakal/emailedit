"use client";

import { useState, useEffect, useMemo, memo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { service_message, hookEvent } from "@/lib/serviceMessage";
import { campaignImagesService } from "@/services/campaignImages";

export const ImageComponent = memo(function ImageComponent({
  data,
  onUpdate,
  isSelected,
}) {
  const { src, alt, width, height } = data;

  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [showImagePicker, setShowImagePicker] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Normalize width and height - ensure they're valid CSS values
  const normalizedWidth = width || "100%";
  const normalizedHeight = height && height !== "auto" ? height : undefined;

  // Build style object for the image
  const imageStyle = {
    maxWidth: "100%",
    display: "block",
    ...(normalizedWidth && { width: normalizedWidth }),
    ...(normalizedHeight && { height: normalizedHeight }),
    objectFit: normalizedHeight ? "cover" : undefined,
  };

  // Convert pixels to CSS value (always use pixels after resizing)
  const formatDimension = (pixels) => {
    if (pixels === null || pixels === undefined) return "auto";
    return `${Math.round(pixels)}px`;
  };

  const handleMouseDown = (e) => {
    if (!isSelected || !imageRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const imageElement = imageRef.current;
    const rect = imageElement.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;

    // Get current dimensions in pixels from the rendered element
    const currentWidth = rect.width;
    const currentHeight = rect.height;

    // Calculate aspect ratio from current dimensions
    const aspectRatio = currentWidth / currentHeight;

    setIsResizing(true);
    setResizeStart({
      x: startX,
      y: startY,
      width: currentWidth,
      height: currentHeight,
      aspectRatio: aspectRatio,
    });

    // Prevent text selection during resize
    document.body.style.userSelect = "none";
    document.body.style.cursor = "nwse-resize";
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      // Calculate new dimensions
      // For corner resize, maintain aspect ratio
      const aspectRatio = resizeStart.aspectRatio;
      let newWidth = resizeStart.width + deltaX;
      let newHeight = resizeStart.height + deltaY;

      // Maintain aspect ratio
      const widthBasedHeight = newWidth / aspectRatio;
      const heightBasedWidth = newHeight * aspectRatio;

      // Use the dimension that changes less to maintain aspect ratio better
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newHeight = widthBasedHeight;
      } else {
        newWidth = heightBasedWidth;
      }

      // Ensure minimum size
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);

      // Update with new dimensions (convert to pixels)
      onUpdate({
        ...data,
        width: formatDimension(newWidth),
        height: formatDimension(newHeight),
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizing, resizeStart, data, onUpdate]);

  if (!src) {
    return (
      <>
        <div
          className={`relative ${""}`}
          style={{ padding: isSelected ? "2px" : "0" }}
        >
          <div
            onClick={() => setShowImagePicker(true)}
            className="border-2 border-dashed border-gray-300 rounded-md text-center text-gray-500 py-12 px-6 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-600 transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="text-3xl mb-2 opacity-70">🖼️</div>
          </div>
          {/* Individual editor disabled - using unified toolbar */}
          {false && isSelected && (
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
              <ImageComponent.Editor data={data} onUpdate={onUpdate} />
            </div>
          )}
        </div>

        {/* Image Picker Dialog */}
        {showImagePicker && (
          <Dialog open={showImagePicker} onOpenChange={setShowImagePicker}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Select or Upload Image</DialogTitle>
              </DialogHeader>
              <ImagePicker
                onSelectUrl={(url) => {
                  onUpdate({ ...data, src: url });
                  setShowImagePicker(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  return (
    <div
      className={`relative group image-wrapper ${""}`}
      style={{ padding: isSelected ? "2px" : "0" }}
    >
      <div
        className="flex justify-center items-center relative"
        ref={containerRef}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt || "Image"}
          style={imageStyle}
          className="rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 select-none"
          draggable={false}
        />
        {/* Resize Handle - Bottom Right Corner */}
        {isSelected && (
          <div
            onMouseDown={handleMouseDown}
            className="absolute w-5 h-5 bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white rounded cursor-nwse-resize shadow-lg z-10 opacity-90 hover:opacity-100 hover:from-purple-600 hover:to-purple-700 hover:scale-110 transition-all flex items-center justify-center group/resize"
            style={{
              bottom: "-10px",
              right: "-10px",
            }}
          >
            {/* Two-way diagonal resize arrows */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              {/* Diagonal line */}
              <line
                x1="3"
                y1="3"
                x2="11"
                y2="11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Top-left arrow (pointing northwest) */}
              <path
                d="M3 3L1.5 1.5M3 3L1.5 4.5M3 3L4.5 1.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Bottom-right arrow (pointing southeast) */}
              <path
                d="M11 11L12.5 12.5M11 11L12.5 9.5M11 11L9.5 12.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Tooltip hint */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/resize:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md">
              Drag to resize
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>
      {/* Individual editor disabled - using unified toolbar */}
      {false && isSelected && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-40">
          <ImageComponent.Editor data={data} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
});

ImageComponent.Editor = function ImageEditor({ data, onUpdate }) {
  // const { data: session } = useSession(); // Session removed
  const session = null; // Mock session or null since we use local storage fallback
  const [formData, setFormData] = useState(data);
  const [showPicker, setShowPicker] = useState(!data?.src);

  // Auto-save when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(formData);
    }, 500); // Auto-save after 500ms of no changes

    return () => clearTimeout(timeoutId);
  }, [formData]);

  return (
    <div className="bg-white px-3 py-2 max-w-2xl rounded-lg shadow-lg border border-gray-100 backdrop-blur-sm">
      {/* First Line */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="src" className="text-xs font-medium text-gray-600">
            URL
          </Label>
          <Input
            className="w-56 h-7 text-xs border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
            id="src"
            value={formData.src}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, src: e.target.value }))
            }
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors"
          onClick={() => setShowPicker(true)}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={showPicker}
        >
          Gallery
        </button>

        <div className="flex items-center gap-2">
          <Label htmlFor="alt" className="text-xs font-medium text-gray-600">
            Alt
          </Label>
          <Input
            className="w-36 h-7 text-xs border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
            id="alt"
            value={formData.alt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, alt: e.target.value }))
            }
            placeholder="Description"
          />
        </div>
      </div>

      {/* Second Line */}
      <div className="flex items-center gap-2">
        {/* Width */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-gray-600">Width</Label>
          <Select
            value={formData.width}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, width: value }))
            }
          >
            <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
              <SelectValue placeholder="W" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100%">100%</SelectItem>
              <SelectItem value="75%">75%</SelectItem>
              <SelectItem value="50%">50%</SelectItem>
              <SelectItem value="25%">25%</SelectItem>
              <SelectItem value="200px">200px</SelectItem>
              <SelectItem value="300px">300px</SelectItem>
              <SelectItem value="400px">400px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Height */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-gray-600">Height</Label>
          <Select
            value={formData.height}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, height: value }))
            }
          >
            <SelectTrigger className="w-[60px] h-7 text-xs border-gray-200">
              <SelectValue placeholder="H" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">auto</SelectItem>
              <SelectItem value="100px">100px</SelectItem>
              <SelectItem value="200px">200px</SelectItem>
              <SelectItem value="300px">300px</SelectItem>
              <SelectItem value="400px">400px</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Dialog open={showPicker} onOpenChange={setShowPicker}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select or Upload Image</DialogTitle>
          </DialogHeader>
          <ImagePicker
            onSelectUrl={(url) => {
              setFormData((prev) => ({ ...prev, src: url }));
              setShowPicker(false);
            }}
            session={session}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

function ImagePicker({ onSelectUrl, session }) {
  const [tab, setTab] = useState("gallery"); // gallery | upload | link
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const userId = useMemo(() => {
    // Try session first, then fallback to localStorage
    if (session?.user?.id || session?.user?.userId) {
      return session.user.id || session.user.userId;
    }
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        return u?.id || u?.userId || "";
      }
    } catch {}
    return "";
  }, [session]);

  useEffect(() => {
    setLoading(true);
    campaignImagesService
      .list(userId)
      .then((data) => {
        setImages(data);
        // If no images yet, default to Upload tab for better UX
        if (!data || data.length === 0) setTab("upload");
      })
      .catch((e) => setError(e?.message || "Failed to load images"))
      .finally(() => setLoading(false));
  }, [userId]);

  const onUpload = async (file) => {
    hookEvent("campaign_image_upload_click", { hasFile: !!file });
    if (!file) {
      service_message("Please choose a file", "error");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const created = await campaignImagesService.uploadFile(
        file,
        file.name,
        userId
      );
      service_message("Image uploaded", "success");
      hookEvent("campaign_image_uploaded", {
        id: created.id,
        url: created.url,
      });
      setImages((prev) => [created, ...prev]);
      onSelectUrl(created.url);
    } catch (e) {
      setError(e?.message || "Upload failed");
      service_message("Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSaveLink = async () => {
    hookEvent("campaign_image_link_click", { hasLink: !!link });
    if (!link) {
      service_message("Please enter an image URL", "error");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const created = await campaignImagesService.saveLink(link, "", userId);
      service_message("Image link saved", "success");
      hookEvent("campaign_image_link_saved", {
        id: created.id,
        url: created.url,
      });
      setImages((prev) => [created, ...prev]);
      onSelectUrl(created.url);
    } catch (e) {
      setError(e?.message || "Save link failed");
      service_message("Save link failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          className={`px-3 py-1 rounded border ${
            tab === "gallery" ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => setTab("gallery")}
        >
          Gallery
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded border ${
            tab === "upload" ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => setTab("upload")}
        >
          Upload
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded border ${
            tab === "link" ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => setTab("link")}
        >
          Link
        </button>
      </div>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {loading && <div className="text-sm text-gray-500">Loading...</div>}

      {tab === "gallery" && (
        <div className="grid grid-cols-6 gap-3 max-h-72 overflow-auto">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => onSelectUrl(img.url)}
              className="border rounded overflow-hidden hover:ring-2 hover:ring-blue-500"
            >
              <img
                src={img.url}
                alt={img.name || "image"}
                className="w-full h-24 object-cover"
              />
            </button>
          ))}
          {!images.length && !loading && (
            <div className="text-sm text-gray-500 col-span-6">
              No images yet
            </div>
          )}
        </div>
      )}

      {tab === "upload" && (
        <UploadSection onUpload={onUpload} loading={loading} />
      )}

      {tab === "link" && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="https://..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button
            type="button"
            className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={onSaveLink}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

function UploadSection({ onUpload, loading }) {
  const [file, setFile] = useState(null);
  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFile(
            e.target.files && e.target.files[0] ? e.target.files[0] : null
          )
        }
      />
      <button
        type="button"
        disabled={!file || loading}
        className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
        onClick={() => file && onUpload(file)}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
