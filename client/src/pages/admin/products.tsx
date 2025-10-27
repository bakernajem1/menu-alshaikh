import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Image as ImageIcon, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, Category, InsertProduct } from "@shared/schema";

export default function Products() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState(true);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertProduct) => apiRequest("POST", "/api/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      toast({ title: "تم إضافة المنتج بنجاح" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      apiRequest("PATCH", `/api/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast({ title: "تم تحديث المنتج بنجاح" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "تم حذف المنتج بنجاح" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: any = {
      name: formData.get("name") as string,
      nameAr: formData.get("nameAr") as string,
      description: formData.get("description") as string,
      descriptionAr: formData.get("descriptionAr") as string,
      price: Math.round(parseFloat(formData.get("price") as string) * 100),
      imageUrl: formData.get("imageUrl") as string,
      categoryId: selectedCategory,
      isAvailable: isAvailable,
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openDialog = (product?: Product) => {
    setEditingProduct(product || null);
    setSelectedCategory(product?.categoryId || (categories[0]?.id || ""));
    setIsAvailable(product?.isAvailable ?? true);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-products-title">المنتجات</h1>
          <p className="text-muted-foreground">إدارة منتجات المتجر</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} data-testid="button-add-product">
              <Plus className="ml-2 h-4 w-4" />
              إضافة منتج
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameAr">الاسم بالعربية *</Label>
                  <Input
                    id="nameAr"
                    name="nameAr"
                    required
                    defaultValue={editingProduct?.nameAr}
                    data-testid="input-product-name-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم بالإنجليزية</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingProduct?.name}
                    data-testid="input-product-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">الوصف بالعربية</Label>
                  <Textarea
                    id="descriptionAr"
                    name="descriptionAr"
                    rows={3}
                    defaultValue={editingProduct?.descriptionAr || ""}
                    data-testid="textarea-product-description-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف بالإنجليزية</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={editingProduct?.description || ""}
                    data-testid="textarea-product-description"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (ر.س) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    defaultValue={editingProduct ? (editingProduct.price / 100).toFixed(2) : ""}
                    data-testid="input-product-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">القسم *</Label>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                    required
                  >
                    <SelectTrigger data-testid="select-product-category">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">رابط الصورة</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  defaultValue={editingProduct?.imageUrl || ""}
                  data-testid="input-product-image"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">ترتيب العرض</Label>
                  <Input
                    id="displayOrder"
                    name="displayOrder"
                    type="number"
                    defaultValue={editingProduct?.displayOrder || 0}
                    data-testid="input-product-order"
                  />
                </div>
                <div className="flex items-center space-x-2 space-x-reverse pt-8">
                  <Switch
                    id="isAvailable"
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                    data-testid="switch-product-available"
                  />
                  <Label htmlFor="isAvailable">متوفر</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  إلغاء
                </Button>
                <Button type="submit" data-testid="button-save-product">
                  {editingProduct ? "حفظ التعديلات" : "إضافة المنتج"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden" data-testid={`card-product-${product.id}`}>
            {product.imageUrl ? (
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={product.imageUrl} alt={product.nameAr} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-square bg-muted flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg" data-testid={`text-product-name-${product.id}`}>{product.nameAr}</h3>
                {product.descriptionAr && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.descriptionAr}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">{(product.price / 100).toFixed(2)} ر.س</span>
                <span className={`text-sm ${product.isAvailable ? "text-green-600" : "text-red-600"}`}>
                  {product.isAvailable ? "متوفر" : "غير متوفر"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => openDialog(product)}
                  data-testid={`button-edit-${product.id}`}
                >
                  <Pencil className="h-4 w-4 ml-2" />
                  تعديل
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => deleteMutation.mutate(product.id)}
                  data-testid={`button-delete-${product.id}`}
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">لا توجد منتجات حتى الآن</p>
            <Button onClick={() => openDialog()} data-testid="button-add-first-product">
              <Plus className="ml-2 h-4 w-4" />
              إضافة أول منتج
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
