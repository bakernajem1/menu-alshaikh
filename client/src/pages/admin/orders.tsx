import { useQuery, useMutation } from "@tanstack/react-query";
import { ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Order, OrderItem } from "@shared/schema";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "قيد الانتظار", variant: "default" },
  confirmed: { label: "مؤكد", variant: "secondary" },
  completed: { label: "مكتمل", variant: "outline" },
  cancelled: { label: "ملغي", variant: "destructive" },
};

export default function Orders() {
  const { toast } = useToast();

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/orders/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "تم تحديث حالة الطلب" });
    },
  });

  const parseOrderItems = (itemsStr: string): OrderItem[] => {
    try {
      return JSON.parse(itemsStr);
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-orders-title">الطلبات</h1>
        <p className="text-muted-foreground">إدارة ومتابعة الطلبات</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = parseOrderItems(order.items);
            return (
              <Card key={order.id} data-testid={`card-order-${order.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-lg" data-testid={`text-order-customer-${order.id}`}>
                          {order.customerName}
                        </h3>
                        <Badge variant={statusMap[order.status]?.variant || "default"}>
                          {statusMap[order.status]?.label || order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>📱 {order.customerPhone}</p>
                        <p>📍 {order.customerAddress}</p>
                        <p>🕐 {new Date(order.createdAt).toLocaleString("ar-SA")}</p>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {(order.totalAmount / 100).toFixed(2)} ر.س
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(status) => updateStatusMutation.mutate({ id: order.id, status })}
                      >
                        <SelectTrigger className="w-full sm:w-[150px]" data-testid={`select-order-status-${order.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="confirmed">مؤكد</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                          <SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" data-testid={`button-view-order-${order.id}`}>
                            <Eye className="h-4 w-4 ml-2" />
                            التفاصيل
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>تفاصيل الطلب</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">معلومات العميل</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>الاسم:</strong> {order.customerName}</p>
                                <p><strong>الهاتف:</strong> {order.customerPhone}</p>
                                <p><strong>العنوان:</strong> {order.customerAddress}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">المنتجات</h4>
                              <div className="space-y-2">
                                {items.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm border-b pb-2">
                                    <span>{item.productNameAr} × {item.quantity}</span>
                                    <span className="font-medium">
                                      {((item.price * item.quantity) / 100).toFixed(2)} ر.س
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {order.notes && (
                              <div>
                                <h4 className="font-semibold mb-2">ملاحظات</h4>
                                <p className="text-sm text-muted-foreground">{order.notes}</p>
                              </div>
                            )}

                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center text-lg font-bold">
                                <span>الإجمالي:</span>
                                <span>{(order.totalAmount / 100).toFixed(2)} ر.س</span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا توجد طلبات حتى الآن</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
