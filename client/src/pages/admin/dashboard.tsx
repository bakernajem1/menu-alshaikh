import { useQuery } from "@tanstack/react-query";
import { Package, FolderTree, ShoppingBag, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product, Category, Order } from "@shared/schema";

export default function Dashboard() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">لوحة التحكم</h1>
        <p className="text-muted-foreground">مرحباً بك في لوحة التحكم</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المنتجات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-products-count">{products.length}</div>
            <p className="text-xs text-muted-foreground">إجمالي المنتجات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأقسام</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-categories-count">{categories.length}</div>
            <p className="text-xs text-muted-foreground">إجمالي الأقسام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات قيد الانتظار</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-orders">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">طلبات جديدة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-revenue">{(totalRevenue / 100).toFixed(2)} ر.س</div>
            <p className="text-xs text-muted-foreground">إجمالي الإيرادات</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/products">
              <Button className="w-full justify-start" variant="outline" data-testid="button-manage-products">
                <Package className="ml-2 h-4 w-4" />
                إدارة المنتجات
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button className="w-full justify-start" variant="outline" data-testid="button-manage-categories">
                <FolderTree className="ml-2 h-4 w-4" />
                إدارة الأقسام
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button className="w-full justify-start" variant="outline" data-testid="button-view-orders">
                <ShoppingBag className="ml-2 h-4 w-4" />
                عرض الطلبات
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخر الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                    data-testid={`order-preview-${order.id}`}
                  >
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{(order.totalAmount / 100).toFixed(2)} ر.س</p>
                    </div>
                  </div>
                ))}
                <Link href="/admin/orders">
                  <Button variant="outline" className="w-full" data-testid="button-view-all-orders">
                    عرض جميع الطلبات
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">لا توجد طلبات حتى الآن</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
