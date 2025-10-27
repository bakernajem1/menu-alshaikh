import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Category, InsertCategory } from "@shared/schema";

export default function Categories() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertCategory) => apiRequest("POST", "/api/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsDialogOpen(false);
      toast({ title: "تم إضافة القسم بنجاح" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      apiRequest("PATCH", `/api/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsDialogOpen(false);
      setEditingCategory(null);
      toast({ title: "تم تحديث القسم بنجاح" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "تم حذف القسم بنجاح" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: any = {
      name: formData.get("name") as string,
      nameAr: formData.get("nameAr") as string,
      imageUrl: formData.get("imageUrl") as string,
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openDialog = (category?: Category) => {
    setEditingCategory(category || null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-categories-title">الأقسام</h1>
          <p className="text-muted-foreground">إدارة أقسام المنتجات</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} data-testid="button-add-category">
              <Plus className="ml-2 h-4 w-4" />
              إضافة قسم
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "تعديل القسم" : "إضافة قسم جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameAr">الاسم بالعربية *</Label>
                  <Input
                    id="nameAr"
                    name="nameAr"
                    required
                    defaultValue={editingCategory?.nameAr}
                    data-testid="input-category-name-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم بالإنجليزية</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingCategory?.name}
                    data-testid="input-category-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">رابط الصورة</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  defaultValue={editingCategory?.imageUrl || ""}
                  data-testid="input-category-image"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">ترتيب العرض</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  defaultValue={editingCategory?.displayOrder || 0}
                  data-testid="input-category-order"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  إلغاء
                </Button>
                <Button type="submit" data-testid="button-save-category">
                  {editingCategory ? "حفظ التعديلات" : "إضافة القسم"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden hover-elevate" data-testid={`card-category-${category.id}`}>
            {category.imageUrl && (
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={category.imageUrl} alt={category.nameAr} className="w-full h-full object-cover" />
              </div>
            )}
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg" data-testid={`text-category-name-${category.id}`}>{category.nameAr}</h3>
                <p className="text-sm text-muted-foreground">ترتيب العرض: {category.displayOrder}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => openDialog(category)}
                  data-testid={`button-edit-${category.id}`}
                >
                  <Pencil className="h-4 w-4 ml-2" />
                  تعديل
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => deleteMutation.mutate(category.id)}
                  data-testid={`button-delete-${category.id}`}
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderTree className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">لا توجد أقسام حتى الآن</p>
            <Button onClick={() => openDialog()} data-testid="button-add-first-category">
              <Plus className="ml-2 h-4 w-4" />
              إضافة أول قسم
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
