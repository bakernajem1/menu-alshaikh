import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Town, InsertTown } from "@shared/schema";

export default function Towns() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTown, setEditingTown] = useState<Town | null>(null);

  const { data: towns = [] } = useQuery<Town[]>({
    queryKey: ["/api/towns"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertTown) => apiRequest("POST", "/api/towns", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/towns"] });
      setIsDialogOpen(false);
      toast({ title: "تم إضافة البلدة بنجاح" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Town> }) =>
      apiRequest("PATCH", `/api/towns/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/towns"] });
      setIsDialogOpen(false);
      setEditingTown(null);
      toast({ title: "تم تحديث البلدة بنجاح" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/towns/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/towns"] });
      toast({ title: "تم حذف البلدة بنجاح" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: any = {
      name: formData.get("name") as string,
      nameAr: formData.get("nameAr") as string,
      deliveryFee: parseInt(formData.get("deliveryFee") as string) || 0,
      isActive: formData.get("isActive") === "on",
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
    };

    if (editingTown) {
      updateMutation.mutate({ id: editingTown.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openDialog = (town?: Town) => {
    setEditingTown(town || null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-towns-title">البلدات</h1>
          <p className="text-muted-foreground">إدارة البلدات وأجرة التوصيل</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} data-testid="button-add-town">
              <Plus className="ml-2 h-4 w-4" />
              إضافة بلدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingTown ? "تعديل البلدة" : "إضافة بلدة جديدة"}</DialogTitle>
              <DialogDescription>
                {editingTown ? "قم بتعديل بيانات البلدة وأجرة التوصيل" : "أضف بلدة جديدة مع تحديد أجرة التوصيل"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameAr">اسم البلدة بالعربية *</Label>
                  <Input
                    id="nameAr"
                    name="nameAr"
                    required
                    defaultValue={editingTown?.nameAr}
                    data-testid="input-town-name-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم بالإنجليزية</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingTown?.name}
                    data-testid="input-town-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryFee">أجرة التوصيل (₪)</Label>
                <Input
                  id="deliveryFee"
                  name="deliveryFee"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={editingTown ? (editingTown.deliveryFee / 100).toFixed(2) : "0.00"}
                  data-testid="input-delivery-fee"
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">أدخل أجرة التوصيل بالشيكل</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">ترتيب العرض</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  defaultValue={editingTown?.displayOrder || 0}
                  data-testid="input-town-order"
                />
              </div>

              <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
                <Label htmlFor="isActive" className="flex flex-col gap-1">
                  <span>تفعيل البلدة</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    البلدات غير المفعلة لن تظهر في قائمة الطلبات
                  </span>
                </Label>
                <Switch
                  id="isActive"
                  name="isActive"
                  defaultChecked={editingTown?.isActive ?? true}
                  data-testid="switch-town-active"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  إلغاء
                </Button>
                <Button type="submit" data-testid="button-save-town">
                  {editingTown ? "حفظ التعديلات" : "إضافة البلدة"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {towns.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-3">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">لا توجد بلدات</h3>
            <p className="text-muted-foreground">ابدأ بإضافة البلدات وتحديد أجرة التوصيل لكل منها</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {towns.map((town) => (
            <Card key={town.id} className="overflow-hidden hover-elevate" data-testid={`card-town-${town.id}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg flex items-center gap-2" data-testid={`text-town-name-${town.id}`}>
                      <MapPin className="h-5 w-5 text-primary" />
                      {town.nameAr}
                    </h3>
                    {town.name && (
                      <p className="text-sm text-muted-foreground">{town.name}</p>
                    )}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${town.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {town.isActive ? 'مفعّلة' : 'غير مفعّلة'}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">أجرة التوصيل:</span>
                    <span className="font-bold text-lg" data-testid={`text-delivery-fee-${town.id}`}>
                      {(town.deliveryFee / 100).toFixed(2)} ₪
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ترتيب العرض:</span>
                    <span className="text-sm">{town.displayOrder}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => openDialog(town)}
                    data-testid={`button-edit-${town.id}`}
                  >
                    <Pencil className="h-4 w-4 ml-2" />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف "${town.nameAr}"؟`)) {
                        deleteMutation.mutate(town.id);
                      }
                    }}
                    data-testid={`button-delete-${town.id}`}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
