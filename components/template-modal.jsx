"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LayoutTemplate, Search, Edit, Trash2, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function TemplateModal({ onSelect }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [templates, setTemplates] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (!open) return;
    const getTemplates = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://api.salesmonk.ca/api/templates/");
        const data = await res.json();
        setTemplates(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };
    getTemplates();
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((t) => `${t.name ?? ""}`.toLowerCase().includes(q));
  }, [templates, query]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://api.salesmonk.ca/api/templates/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete template");
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success("Template deleted");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Templates</DialogTitle>
          <DialogDescription className="sr-only">
            Browse and pick a template
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates..."
                className="pl-9"
              />
            </div>
            <Link href="/template/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Create Template
              </Button>
            </Link>
          </div>
        </div>

        <ScrollArea className="h-[480px] px-6 pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-56">
              <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-56">
              <p className="text-muted-foreground">No templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t) => (
                <Card
                  key={t.id}
                  className="group relative flex flex-col h-full"
                >
                  <CardHeader className="p-0 flex-1">
                    <div
                      className="relative w-full bg-muted/40 cursor-pointer"
                      onClick={() => {
                        onSelect?.(t.id);
                        setOpen(false);
                      }}
                    >
                      {t.thumbnail_url ? (
                        <img
                          fill
                          src={t.thumbnail_url}
                          alt={t.name ?? "Template"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center text-sm text-muted-foreground">
                          No preview
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-2 px-3 ">
                    <CardTitle className="text-sm font-medium truncate">
                      {t.name}
                    </CardTitle>
                  </CardContent>
                  <CardFooter className="px-3 pb-3 pt-0 flex justify-between">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        onSelect?.(t.id);
                        setOpen(false);
                      }}
                    >
                      Use
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/template/${t.id}/edit`)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog
                        open={confirmDeleteId === t.id}
                        onOpenChange={(v) => !v && setConfirmDeleteId(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setConfirmDeleteId(t.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[420px]">
                          <DialogHeader>
                            <DialogTitle>Delete template?</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            This action cannot be undone.
                          </DialogDescription>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(t.id)}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
