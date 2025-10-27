import { useQuery, useMutation } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { StoreSettings } from "@shared/schema";

export default function Settings() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<StoreSettings>({
    queryKey: ["/api/settings"],
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<StoreSettings>) => apiRequest("PATCH", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "تم حفظ الإعدادات بنجاح" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: any = {
      storeName: formData.get("storeName") as string,
      storeNameAr: formData.get("storeNameAr") as string,
      logoUrl: formData.get("logoUrl") as string,
      primaryColor: formData.get("primaryColor") as string,
      whatsappNumber: formData.get("whatsappNumber") as string,
      address: formData.get("address") as string,
      addressAr: formData.get("addressAr") as string,
      workingHours: formData.get("workingHours") as string,
      workingHoursAr: formData.get("workingHoursAr") as string,
      description: formData.get("description") as string,
      descriptionAr: formData.get("descriptionAr") as string,
    };

    updateMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-settings-title">إعدادات المتجر</h1>
        <p className="text-muted-foreground">تخصيص معلومات وإعدادات المتجر</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeNameAr">اسم المتجر (عربي) *</Label>
                <Input
                  id="storeNameAr"
                  name="storeNameAr"
                  required
                  defaultValue={settings?.storeNameAr}
                  data-testid="input-store-name-ar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeName">اسم المتجر (إنجليزي)</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  defaultValue={settings?.storeName}
                  data-testid="input-store-name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="descriptionAr">الوصف (عربي)</Label>
                <Textarea
                  id="descriptionAr"
                  name="descriptionAr"
                  rows={3}
                  defaultValue={settings?.descriptionAr || ""}
                  data-testid="textarea-description-ar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف (إنجليزي)</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={settings?.description || ""}
                  data-testid="textarea-description"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التصميم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">رابط الشعار</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  defaultValue={settings?.logoUrl || ""}
                  data-testid="input-logo-url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryColor">اللون الأساسي</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    defaultValue={settings?.primaryColor || "#10b981"}
                    className="w-20"
                    data-testid="input-primary-color"
                  />
                  <Input
                    type="text"
                    value={settings?.primaryColor || "#10b981"}
                    readOnly
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معلومات التواصل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">رقم الواتساب *</Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                required
                type="tel"
                placeholder="966xxxxxxxxx"
                defaultValue={settings?.whatsappNumber}
                data-testid="input-whatsapp-number"
              />
              <p className="text-xs text-muted-foreground">
                أدخل الرقم بصيغة دولية بدون + (مثال: 966512345678)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressAr">العنوان (عربي)</Label>
                <Input
                  id="addressAr"
                  name="addressAr"
                  defaultValue={settings?.addressAr || ""}
                  data-testid="input-address-ar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">العنوان (إنجليزي)</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={settings?.address || ""}
                  data-testid="input-address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workingHoursAr">ساعات العمل (عربي)</Label>
                <Input
                  id="workingHoursAr"
                  name="workingHoursAr"
                  placeholder="السبت - الخميس: 9 ص - 10 م"
                  defaultValue={settings?.workingHoursAr || ""}
                  data-testid="input-working-hours-ar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workingHours">ساعات العمل (إنجليزي)</Label>
                <Input
                  id="workingHours"
                  name="workingHours"
                  placeholder="Sat - Thu: 9 AM - 10 PM"
                  defaultValue={settings?.workingHours || ""}
                  data-testid="input-working-hours"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={updateMutation.isPending} data-testid="button-save-settings">
            <Save className="ml-2 h-4 w-4" />
            حفظ الإعدادات
          </Button>
        </div>
      </form>
    </div>
  );
}
