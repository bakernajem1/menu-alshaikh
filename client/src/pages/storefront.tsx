import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Product, Category, StoreSettings, OrderItem, HeroImage, Town } from "@shared/schema";

export default function Storefront() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedTownId, setSelectedTownId] = useState<string>("");

  // Fetch store settings
  const { data: settings } = useQuery<StoreSettings>({
    queryKey: ["/api/settings"],
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch hero images
  const { data: heroImages = [] } = useQuery<HeroImage[]>({
    queryKey: ["/api/hero-images"],
  });

  // Fetch towns
  const { data: towns = [] } = useQuery<Town[]>({
    queryKey: ["/api/towns"],
  });

  // Filter only active hero images
  const activeHeroImages = heroImages.filter((img) => img.isActive);

  const filteredProducts = selectedCategory === "all"
    ? products.filter((p) => p.isAvailable)
    : products.filter((p) => p.isAvailable && p.categoryId === selectedCategory);

  // Check if product has active discount
  const isDiscountActive = (product: Product) => {
    if (!product.discountedPrice || !product.discountStartDate || !product.discountEndDate) {
      return false;
    }
    const now = new Date();
    const start = new Date(product.discountStartDate);
    const end = new Date(product.discountEndDate);
    return now >= start && now <= end;
  };

  // Get effective price (discounted or regular)
  const getEffectivePrice = (product: Product) => {
    return isDiscountActive(product) && product.discountedPrice
      ? product.discountedPrice
      : product.price;
  };

  const addToCart = (product: Product) => {
    const effectivePrice = getEffectivePrice(product);
    const existingItem = cart.find((item) => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          productNameAr: product.nameAr,
          quantity: 1,
          price: effectivePrice,
        },
      ]);
    }
    toast({
      title: "تمت الإضافة للسلة",
      description: `تم إضافة ${product.nameAr} إلى سلة الطلبات`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  // Filter only active towns
  const activeTowns = towns.filter((town) => town.isActive);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedTown = activeTowns.find((town) => town.id === selectedTownId);
  const deliveryFee = selectedTown ? selectedTown.deliveryFee : 0;
  const totalAmount = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedTownId) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار البلدة للتوصيل",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerAddress = formData.get("customerAddress") as string;

    // Format WhatsApp message
    let message = `🛍️ *طلب جديد*\n\n`;
    message += `👤 *الاسم:* ${customerName}\n`;
    message += `📱 *الهاتف:* ${customerPhone}\n`;
    message += `🏙️ *البلدة:* ${selectedTown?.nameAr}\n`;
    message += `📍 *العنوان:* ${customerAddress}\n\n`;
    message += `🛒 *الطلبات:*\n`;
    cart.forEach((item) => {
      message += `▪️ ${item.productNameAr} × ${item.quantity} = ${(item.price * item.quantity / 100).toFixed(2)} ₪\n`;
    });
    message += `\n💵 *المجموع الفرعي:* ${(subtotal / 100).toFixed(2)} ₪\n`;
    message += `🚚 *أجرة التوصيل:* ${(deliveryFee / 100).toFixed(2)} ₪\n`;
    message += `💰 *الإجمالي:* ${(totalAmount / 100).toFixed(2)} ₪`;

    const whatsappUrl = `https://wa.me/${settings?.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Clear cart and close dialogs
    setCart([]);
    setSelectedTownId("");
    setIsCheckoutOpen(false);
    setIsCartOpen(false);

    toast({
      title: "تم إرسال الطلب",
      description: "سيتم التواصل معك قريباً",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings?.logoUrl && (
              <img src={settings.logoUrl} alt={settings.storeNameAr} className="h-10 w-10 object-contain" />
            )}
            <h1 className="text-xl font-bold" data-testid="text-store-name">{settings?.storeNameAr || "متجري"}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative" data-testid="button-open-cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs" data-testid="badge-cart-count">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>سلة الطلبات</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">السلة فارغة</p>
                      <Button className="mt-4" onClick={() => setIsCartOpen(false)} data-testid="button-start-shopping">
                        ابدأ التسوق
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-[60vh] overflow-auto">
                        {cart.map((item) => (
                          <Card key={item.productId} data-testid={`cart-item-${item.productId}`}>
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold" data-testid={`text-cart-item-name-${item.productId}`}>{item.productNameAr}</h4>
                                <p className="text-sm text-muted-foreground" data-testid={`text-cart-item-price-${item.productId}`}>
                                  {(item.price / 100).toFixed(2)} ₪
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  data-testid={`button-decrease-${item.productId}`}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-medium" data-testid={`text-quantity-${item.productId}`}>{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  data-testid={`button-increase-${item.productId}`}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => removeFromCart(item.productId)}
                                  data-testid={`button-remove-${item.productId}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>الإجمالي:</span>
                          <span data-testid="text-cart-total">{(totalAmount / 100).toFixed(2)} ₪</span>
                        </div>
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={() => {
                            setIsCartOpen(false);
                            setIsCheckoutOpen(true);
                          }}
                          data-testid="button-proceed-checkout"
                        >
                          إتمام الطلب
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Slider Section */}
      <HeroSliderSection
        images={activeHeroImages}
        storeNameAr={settings?.storeNameAr}
        descriptionAr={settings?.descriptionAr || undefined}
      />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                data-testid="button-category-all"
              >
                الكل
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  data-testid={`button-category-${category.id}`}
                >
                  {category.nameAr}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section id="products" className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">منتجاتنا</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const hasActiveDiscount = isDiscountActive(product);
              const effectivePrice = getEffectivePrice(product);
              const discountPercentage = hasActiveDiscount && product.discountedPrice
                ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
                : 0;

              return (
                <Card key={product.id} className="overflow-hidden hover-elevate relative" data-testid={`card-product-${product.id}`}>
                  {hasActiveDiscount && (
                    <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white" data-testid={`badge-discount-${product.id}`}>
                      خصم {discountPercentage}%
                    </Badge>
                  )}
                  {product.imageUrl && (
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.imageUrl}
                        alt={product.nameAr}
                        className="w-full h-full object-cover"
                        data-testid={`img-product-${product.id}`}
                      />
                    </div>
                  )}
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-bold text-lg" data-testid={`text-product-name-${product.id}`}>{product.nameAr}</h4>
                    {product.descriptionAr && (
                      <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-product-description-${product.id}`}>
                        {product.descriptionAr}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex flex-col gap-1">
                        {hasActiveDiscount ? (
                          <>
                            <span className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${product.id}`}>
                              {(product.price / 100).toFixed(2)} ₪
                            </span>
                            <span className="text-xl font-bold text-green-600" data-testid={`text-product-price-${product.id}`}>
                              {(effectivePrice / 100).toFixed(2)} ₪
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                            {(product.price / 100).toFixed(2)} ₪
                          </span>
                        )}
                      </div>
                      <Button onClick={() => addToCart(product)} data-testid={`button-add-to-cart-${product.id}`}>
                        <Plus className="h-4 w-4 ml-2" />
                        أضف للسلة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">لا توجد منتجات متاحة حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إتمام الطلب</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">الاسم الكامل *</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  required
                  placeholder="أدخل اسمك الكامل"
                  data-testid="input-customer-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">رقم الهاتف *</Label>
                <Input
                  id="customerPhone"
                  name="customerPhone"
                  required
                  type="tel"
                  placeholder="05xxxxxxxx"
                  data-testid="input-customer-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="town">البلدة *</Label>
                <Select value={selectedTownId} onValueChange={setSelectedTownId} required>
                  <SelectTrigger data-testid="select-town">
                    <SelectValue placeholder="اختر البلدة" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTowns.map((town) => (
                      <SelectItem key={town.id} value={town.id} data-testid={`option-town-${town.id}`}>
                        {town.nameAr} - {(town.deliveryFee / 100).toFixed(2)} ₪
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress">العنوان المفصل *</Label>
                <Textarea
                  id="customerAddress"
                  name="customerAddress"
                  required
                  placeholder="الحي، الشارع، رقم المنزل..."
                  rows={3}
                  data-testid="textarea-customer-address"
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
              <h4 className="font-semibold">ملخص الطلب</h4>
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.productNameAr} × {item.quantity}</span>
                  <span>{((item.price * item.quantity) / 100).toFixed(2)} ₪</span>
                </div>
              ))}
              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>المجموع الفرعي:</span>
                  <span data-testid="text-checkout-subtotal">{(subtotal / 100).toFixed(2)} ₪</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>أجرة التوصيل:</span>
                  <span data-testid="text-checkout-delivery">
                    {selectedTownId ? `${(deliveryFee / 100).toFixed(2)} ₪` : "اختر البلدة"}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>الإجمالي:</span>
                  <span data-testid="text-checkout-total">{(totalAmount / 100).toFixed(2)} ₪</span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" data-testid="button-submit-order">
              <SiWhatsapp className="ml-2 h-5 w-5" />
              إرسال الطلب عبر واتساب
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">عن المتجر</h4>
              <p className="text-muted-foreground">{settings?.descriptionAr}</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">معلومات التواصل</h4>
              <div className="space-y-2 text-muted-foreground">
                {settings?.addressAr && <p>📍 {settings.addressAr}</p>}
                {settings?.whatsappNumber && <p>📱 {settings.whatsappNumber}</p>}
                {settings?.workingHoursAr && <p>🕐 {settings.workingHoursAr}</p>}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
              {settings?.whatsappNumber && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`https://wa.me/${settings.whatsappNumber}`, "_blank")}
                  data-testid="button-contact-whatsapp"
                >
                  <SiWhatsapp className="ml-2 h-5 w-5" />
                  واتساب
                </Button>
              )}
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 {settings?.storeNameAr || "شاورما الشيخ"}. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Hero Slider Component
function HeroSliderSection({
  images,
  storeNameAr,
  descriptionAr,
}: {
  images: HeroImage[];
  storeNameAr?: string;
  descriptionAr?: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  // If no images, show a fallback
  if (images.length === 0) {
    return (
      <section className="relative h-[70vh] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4" data-testid="text-hero-title">
            {storeNameAr || "شاورما الشيخ"}
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-muted-foreground" data-testid="text-hero-description">
            {descriptionAr || "طعم الشاورما الاصيل"}
          </p>
          <Button
            size="lg"
            variant="default"
            onClick={() => {
              document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
            }}
            data-testid="button-browse-products"
          >
            استعرض المنتجات
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[70vh] overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container h-[70vh] flex">
          {images.map((image, index) => (
            <div key={image.id} className="embla__slide flex-[0_0_100%] relative">
              <div className="absolute inset-0">
                <img
                  src={image.imageUrl}
                  alt={image.titleAr || `Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  data-testid={`img-hero-slide-${index}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
              </div>
              <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center text-white">
                <h2
                  className="text-4xl md:text-6xl font-bold mb-4"
                  data-testid={`text-hero-title-${index}`}
                >
                  {image.titleAr || storeNameAr || "شاورما الشيخ"}
                </h2>
                <p
                  className="text-xl md:text-2xl mb-8 max-w-2xl"
                  data-testid={`text-hero-subtitle-${index}`}
                >
                  {image.subtitleAr || descriptionAr || "طعم الشاورما الاصيل"}
                </p>
                <Button
                  size="lg"
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  data-testid="button-browse-products"
                >
                  استعرض المنتجات
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
