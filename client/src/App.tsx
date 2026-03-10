import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import Storefront from "@/pages/storefront";
import Dashboard from "@/pages/admin/dashboard";
import Products from "@/pages/admin/products";
import Categories from "@/pages/admin/categories";
import Orders from "@/pages/admin/orders";
import Settings from "@/pages/admin/settings";
import HeroSlider from "@/pages/admin/hero-slider";
import Towns from "@/pages/admin/towns";
import Discounts from "@/pages/admin/discounts";
import { isFeatureFrozen } from "@/lib/feature-flags";
import { FrozenFeature } from "@/components/frozen-feature";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Storefront} />
      <Route path="/admin">
        {() => (
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/products">
        {() => (
          <AdminLayout>
            <Products />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/categories">
        {() => (
          <AdminLayout>
            <Categories />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/orders">
        {() => (
          <AdminLayout>
            <Orders />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/settings">
        {() => (
          <AdminLayout>
            <Settings />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/hero-slider">
        {() => (
          <AdminLayout>
            {isFeatureFrozen("heroSlider") ? (
              <FrozenFeature featureName="صور السلايدر" />
            ) : (
              <HeroSlider />
            )}
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/towns">
        {() => (
          <AdminLayout>
            <Towns />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/discounts">
        {() => (
          <AdminLayout>
            {isFeatureFrozen("discounts") ? (
              <FrozenFeature featureName="الخصومات" />
            ) : (
              <Discounts />
            )}
          </AdminLayout>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
