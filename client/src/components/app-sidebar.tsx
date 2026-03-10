import { Home, Package, FolderTree, Settings, ShoppingBag, Images, MapPin, Percent, Lock } from "lucide-react";
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
import { type FeatureKey, isFeatureFrozen } from "@/lib/feature-flags";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const items: { title: string; url: string; icon: any; featureKey?: FeatureKey }[] = [
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
    featureKey: "heroSlider",
  },
  {
    title: "البلدات",
    url: "/admin/towns",
    icon: MapPin,
  },
  {
    title: "الخصومات",
    url: "/admin/discounts",
    icon: Percent,
    featureKey: "discounts",
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
              {items.map((item) => {
                const frozen = item.featureKey ? isFeatureFrozen(item.featureKey) : false;

                if (frozen) {
                  return (
                    <SidebarMenuItem key={item.url}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md opacity-40 cursor-not-allowed text-sm text-sidebar-foreground"
                            data-testid={`link-${item.url}-frozen`}
                          >
                            <Lock className="ml-2 h-4 w-4 shrink-0" />
                            <span>{item.title}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>هذه الميزة مجمّدة حالياً</p>
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={location === item.url}>
                      <Link href={item.url} data-testid={`link-${item.url}`}>
                        <item.icon className="ml-2" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
