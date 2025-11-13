"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Edit, Trash2, Plus } from "lucide-react";

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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [templates, setTemplates] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
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
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((t) => `${t.name ?? ""}`.toLowerCase().includes(q));
  }, [templates, query]);

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
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
      setIsDeleting(false);
    }
  };
  return (
    <div className="flex flex-col py-10 gap-8  min-h-screen max-w-4xl w-full mx-auto  ">
      <div className=" max-w-4xl w-full mx-auto pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates..."
              className="pl-9 border border-gray-300"
            />
          </div>
          <Link href="/template/create">
            <Button className="w-52">
              <Plus className="h-4 w-4 mr-2" /> Create Template
            </Button>
          </Link>
        </div>
      </div>

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
            <Card key={t.id} className="group relative flex flex-col h-full">
              <CardHeader className="p-0 flex-1">
                <div className="relative w-full bg-muted/40 cursor-pointer">
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
                {/* <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onSelect?.(t.id);
                    setOpen(false);
                  }}
                >
                  Use
                </Button> */}
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
                          {isDeleting ? "Deleting..." : "Delete"}
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
    </div>
  );
}
