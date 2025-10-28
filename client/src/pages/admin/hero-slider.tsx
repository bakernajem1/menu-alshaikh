import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import type { HeroImage } from "@shared/schema";

export default function HeroSlider() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);

  // Fetch hero images
  const { data: images = [], isLoading } = useQuery<HeroImage[]>({
    queryKey: ["/api/hero-images"],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/hero-images/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-images"] });
      toast({
        title: "تم حذف الصورة بنجاح",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل حذف الصورة",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الصورة؟")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة صور السلايدر</h1>
          <p className="text-muted-foreground mt-2">
            إدارة الصور التي تظهر في الصفحة الرئيسية
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          data-testid="button-add-hero-image"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة صورة
        </Button>
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">لا توجد صور في السلايدر</p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-4"
              variant="outline"
              data-testid="button-add-first-image"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة أول صورة
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden" data-testid={`card-hero-image-${image.id}`}>
              <div className="aspect-video relative bg-muted">
                <img
                  src={image.imageUrl}
                  alt={image.titleAr || "Hero image"}
                  className="w-full h-full object-cover"
                  data-testid={`img-hero-${image.id}`}
                />
                {!image.isActive && (
                  <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs">
                    غير مفعل
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">
                  {image.titleAr || "بدون عنوان"}
                </CardTitle>
                {image.subtitleAr && (
                  <p className="text-sm text-muted-foreground">{image.subtitleAr}</p>
                )}
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingImage(image)}
                  data-testid={`button-edit-hero-${image.id}`}
                >
                  تعديل
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(image.id)}
                  data-testid={`button-delete-hero-${image.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <HeroImageDialog
        open={isAddDialogOpen || editingImage !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingImage(null);
          }
        }}
        image={editingImage}
      />
    </div>
  );
}

// Separate dialog component for add/edit
function HeroImageDialog({
  open,
  onOpenChange,
  image,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: HeroImage | null;
}) {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState(image?.imageUrl || "");
  const [titleAr, setTitleAr] = useState(image?.titleAr || "");
  const [subtitleAr, setSubtitleAr] = useState(image?.subtitleAr || "");
  const [displayOrder, setDisplayOrder] = useState(image?.displayOrder || 0);
  const [isActive, setIsActive] = useState(image?.isActive ?? true);

  // Reset form when dialog opens/closes
  useState(() => {
    if (open && image) {
      setImageUrl(image.imageUrl);
      setTitleAr(image.titleAr || "");
      setSubtitleAr(image.subtitleAr || "");
      setDisplayOrder(image.displayOrder);
      setIsActive(image.isActive);
    } else if (!open) {
      setImageUrl("");
      setTitleAr("");
      setSubtitleAr("");
      setDisplayOrder(0);
      setIsActive(true);
    }
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = image ? `/api/hero-images/${image.id}` : "/api/hero-images";
      const method = image ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) throw new Error("Save failed");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-images"] });
      toast({
        title: image ? "تم تحديث الصورة بنجاح" : "تم إضافة الصورة بنجاح",
        variant: "default",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: image ? "فشل تحديث الصورة" : "فشل إضافة الصورة",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى رفع صورة",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate({
      imageUrl,
      titleAr: titleAr.trim() || null,
      subtitleAr: subtitleAr.trim() || null,
      displayOrder,
      isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{image ? "تعديل صورة السلايدر" : "إضافة صورة للسلايدر"}</DialogTitle>
          <DialogDescription>
            {image ? "تحديث تفاصيل الصورة" : "إضافة صورة جديدة للسلايدر"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>صورة السلايدر *</Label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url || "")}
              data-testid="upload-hero-image"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="titleAr">العنوان بالعربية</Label>
            <Input
              id="titleAr"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="مثال: شاورما الشيخ"
              data-testid="input-title-ar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitleAr">العنوان الفرعي بالعربية</Label>
            <Input
              id="subtitleAr"
              value={subtitleAr}
              onChange={(e) => setSubtitleAr(e.target.value)}
              placeholder="مثال: طعم الشاورما الأصيل"
              data-testid="input-subtitle-ar"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayOrder">ترتيب العرض</Label>
              <Input
                id="displayOrder"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                data-testid="input-display-order"
              />
            </div>

            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4"
                  data-testid="checkbox-is-active"
                />
                <span>مفعل</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={saveMutation.isPending}
              data-testid="button-save-hero-image"
            >
              {saveMutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saveMutation.isPending}
              data-testid="button-cancel"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
