import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export default function Discounts() {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: { id: string; product: Partial<Product> }) => {
      return apiRequest("PATCH", `/api/products/${data.id}`, data.product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث معلومات الخصم بنجاح",
      });
      setIsDialogOpen(false);
      setEditingProduct(null);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الخصم",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.currentTarget);
    const discountPriceStr = formData.get("discountPrice") as string;
    const discountStartDate = formData.get("discountStartDate") as string;
    const discountEndDate = formData.get("discountEndDate") as string;

    // Validate dates
    if (discountStartDate && discountEndDate) {
      const start = new Date(discountStartDate);
      const end = new Date(discountEndDate);
      if (end < start) {
        toast({
          title: "خطأ في التواريخ",
          description: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء",
          variant: "destructive",
        });
        return;
      }
    }

    const updateData: Partial<Product> = {
      discountedPrice: discountPriceStr ? Math.round(parseFloat(discountPriceStr) * 100) : null,
      discountStartDate: discountStartDate ? new Date(discountStartDate) : null,
      discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
    };

    updateProductMutation.mutate({
      id: editingProduct.id,
      product: updateData,
    });
  };

  const removeDiscount = (product: Product) => {
    updateProductMutation.mutate({
      id: product.id,
      product: {
        discountedPrice: null,
        discountStartDate: null,
        discountEndDate: null,
      },
    });
  };

  const isDiscountActive = (product: Product) => {
    if (!product.discountedPrice || !product.discountStartDate || !product.discountEndDate) {
      return false;
    }
    const now = new Date();
    const start = new Date(product.discountStartDate);
    const end = new Date(product.discountEndDate);
    return now >= start && now <= end;
  };

  const isDiscountExpired = (product: Product) => {
    if (!product.discountEndDate) return false;
    return new Date() > new Date(product.discountEndDate);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الخصومات</h1>
          <p className="text-muted-foreground mt-2">
            إضافة وتعديل الخصومات على المنتجات مع تحديد فترة الخصم
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const hasDiscount = !!product.discountedPrice;
          const active = isDiscountActive(product);
          const expired = isDiscountExpired(product);

          return (
            <Card key={product.id} data-testid={`card-product-${product.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg" data-testid={`text-product-name-${product.id}`}>
                      {product.nameAr}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      السعر الأصلي: {(product.price / 100).toFixed(2)} ₪
                    </p>
                  </div>
                  {hasDiscount && (
                    <div className="flex gap-1">
                      {active && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                          نشط
                        </span>
                      )}
                      {expired && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                          منتهي
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {hasDiscount && (
                  <div className="bg-muted p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">سعر الخصم:</span>
                      <span className="font-semibold text-green-600" data-testid={`text-discount-price-${product.id}`}>
                        {((product.discountedPrice || 0) / 100).toFixed(2)} ₪
                      </span>
                    </div>
                    {product.discountStartDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">من:</span>
                        <span data-testid={`text-discount-start-${product.id}`}>
                          {new Date(product.discountStartDate).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    )}
                    {product.discountEndDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">إلى:</span>
                        <span data-testid={`text-discount-end-${product.id}`}>
                          {new Date(product.discountEndDate).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsDialogOpen(true);
                    }}
                    data-testid={`button-edit-discount-${product.id}`}
                  >
                    {hasDiscount ? (
                      <>
                        <Pencil className="h-4 w-4 ml-2" />
                        تعديل الخصم
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة خصم
                      </>
                    )}
                  </Button>
                  {hasDiscount && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDiscount(product)}
                      data-testid={`button-remove-discount-${product.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">لا توجد منتجات. أضف منتجات أولاً من صفحة المنتجات.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct?.discountedPrice ? "تعديل الخصم" : "إضافة خصم"}
            </DialogTitle>
            <DialogDescription>
              قم بتحديد سعر الخصم وفترة صلاحيته للمنتج: {editingProduct?.nameAr}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discountPrice">سعر الخصم (₪) *</Label>
              <Input
                id="discountPrice"
                name="discountPrice"
                type="number"
                step="0.01"
                min="0"
                max={editingProduct ? (editingProduct.price / 100) : undefined}
                defaultValue={editingProduct?.discountedPrice ? (editingProduct.discountedPrice / 100) : ""}
                placeholder="مثال: 15.50"
                required
                data-testid="input-discount-price"
              />
              <p className="text-xs text-muted-foreground">
                السعر الأصلي: {editingProduct ? (editingProduct.price / 100).toFixed(2) : "0.00"} ₪
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountStartDate">تاريخ البدء *</Label>
              <Input
                id="discountStartDate"
                name="discountStartDate"
                type="date"
                defaultValue={editingProduct?.discountStartDate ? new Date(editingProduct.discountStartDate).toISOString().split("T")[0] : ""}
                required
                data-testid="input-discount-start-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountEndDate">تاريخ الانتهاء *</Label>
              <Input
                id="discountEndDate"
                name="discountEndDate"
                type="date"
                defaultValue={editingProduct?.discountEndDate ? new Date(editingProduct.discountEndDate).toISOString().split("T")[0] : ""}
                required
                data-testid="input-discount-end-date"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingProduct(null);
                }}
                data-testid="button-cancel"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={updateProductMutation.isPending}
                data-testid="button-save-discount"
              >
                {updateProductMutation.isPending ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
