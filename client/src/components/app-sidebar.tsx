import { Home, Package, FolderTree, Settings, ShoppingBag, Images } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "لوحة التحكم",
    url: "/admin",
    icon: Home,
  },
  {
    title: "المنتجات",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "الأقسام",
    url: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "صور السلايدر",
    url: "/admin/hero-slider",
    icon: Images,
  },
  {
    title: "الطلبات",
    url: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "الإعدادات",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="text-lg font-bold">لوحة التحكم</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.url}`}>
                      <item.icon className="ml-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
