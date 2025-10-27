# Design Guidelines: Small Business E-Commerce Platform

## Design Approach

**Selected Approach:** Reference-Based (Shopify + Modern E-Commerce Best Practices)

Drawing inspiration from successful e-commerce platforms while optimizing for small business simplicity. Focus on product showcase excellence with seamless WhatsApp checkout flow.

**Key Design Principles:**
- Product-first visual hierarchy
- Friction-free ordering experience
- Mobile-optimized (primary device for customers)
- Cultural relevance for Arabic markets
- Trust-building through clean professionalism

---

## Core Design Elements

### A. Typography

**Font Family:** 
- Primary: 'Cairo' or 'Tajawal' (Google Fonts - excellent Arabic support with modern aesthetics)
- Fallback: system-ui, sans-serif

**Hierarchy:**
- Hero Headlines: 3xl to 5xl (48-64px), font-bold
- Section Titles: 2xl to 3xl (32-48px), font-semibold
- Product Names: xl to 2xl (24-32px), font-semibold
- Body Text: base to lg (16-20px), font-normal
- Product Prices: lg to xl (20-24px), font-bold
- UI Labels/Buttons: sm to base (14-16px), font-medium
- Cart Badge/Notifications: xs to sm (12-14px), font-semibold

**RTL Consideration:** All text alignment and spacing must support right-to-left languages seamlessly.

---

### B. Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16, 20

**Container Strategy:**
- Page containers: max-w-7xl with px-4 md:px-8
- Product grids: gap-4 md:gap-6 lg:gap-8
- Section padding: py-12 md:py-16 lg:py-20
- Component spacing: space-y-6 md:space-y-8

**Grid System:**
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 3-4 columns (lg:grid-cols-3 xl:grid-cols-4)

---

## Page Structure & Components

### Landing Page (Customer-Facing)

**1. Hero Section (80vh on desktop, natural height on mobile):**
- Full-width background featuring appetizing product photography
- Overlay with business name in bold, oversized typography
- Tagline emphasizing freshness/quality
- Primary CTA button: "استعرض المنتجات" (Browse Products) with backdrop blur and prominent placement
- Business logo positioned top-left (or top-right for RTL)
- Quick info chips: Operating hours, delivery area, contact

**2. Categories Section:**
- Horizontal scrollable cards on mobile, grid on desktop
- Each category card: Image background with text overlay, rounded corners (rounded-2xl)
- Hover effect: Subtle scale and shadow enhancement
- Category count indicator

**3. Products Grid:**
- Masonry-style or equal-height cards with rounded-xl borders
- Each card contains:
  - High-quality product image (aspect-ratio-square or 4:3)
  - Product name (bold, prominent)
  - Short description (2 lines max, text-sm)
  - Price (large, bold, visually distinct)
  - "أضف للسلة" button (full-width within card)
- Filter chips at top: All, Categories, Price range
- Sticky category navigation on scroll

**4. Features Section:**
- 3-column grid on desktop, stacked on mobile
- Icons (Heroicons): Fast delivery, Fresh products, Easy ordering
- Title + brief description for each
- Balanced whitespace

**5. How It Works:**
- 4-step visual flow with connecting lines
- Step numbers in large circles
- Icons + titles + descriptions
- Emphasize WhatsApp completion step with WhatsApp icon

**6. Social Proof (if applicable):**
- Customer testimonials in 2-column grid
- Star ratings, customer names, brief reviews
- Or: Instagram feed integration showing product photos

**7. Footer:**
- Business info: Address, phone, email, social links
- Operating hours clearly displayed
- WhatsApp quick contact button (sticky on mobile)
- Copyright and links

**Shopping Cart (Slide-over Panel):**
- Slides from left (RTL) or right side
- Cart items list with thumbnail, name, quantity controls, price
- Subtotal prominently displayed
- "إتمام الطلب" button leading to checkout
- Empty state: Friendly illustration + "ابدأ التسوق" CTA

**Checkout Form (Modal or Dedicated Page):**
- Clean, single-column form
- Clear section headers: "معلومات الاتصال", "عنوان التوصيل", "ملخص الطلب"
- Large, touch-friendly input fields
- Order summary sidebar (desktop) or above form (mobile)
- Prominent WhatsApp submit button with icon
- Trust indicators: "طلبك محمي", delivery time estimate

---

### Dashboard (Business Owner)

**Layout:**
- Minimal sidebar navigation (collapsed on mobile)
- Clean header with business name + logout
- Main content area with comfortable padding

**Dashboard Home:**
- Stats cards in 2x2 grid: Today's orders, Total revenue, Pending orders, Active products
- Recent orders table (simplified, mobile-friendly)
- Quick actions: Add product, View all orders

**Products Management:**
- Table view with: Image thumbnail, Name, Category, Price, Status toggle, Actions
- Add/Edit product form: Clean vertical layout, image upload with preview, category dropdown
- Drag-and-drop for product ordering/featured placement

**Orders View:**
- Order cards or table rows showing: Order number, customer name, items count, total, status
- Click to expand: Full order details, customer info, items list
- Status badges with distinct visual treatments
- WhatsApp resend button

**Navigation:**
- Dashboard, Products, Orders, Settings icons (Material Icons or Heroicons)
- Active state clearly indicated

---

## Component Library

### Buttons
- Primary: Filled, rounded-lg, py-3 px-6, bold text
- Secondary: Outline style, same padding
- Icon buttons: Square, p-2, centered icon
- WhatsApp CTA: Green accent with WhatsApp icon

### Cards
- Product cards: rounded-xl, shadow-md, overflow-hidden
- Stat cards: p-6, rounded-lg, shadow-sm
- Elevated on hover: transition-shadow duration-200

### Forms
- Input fields: rounded-lg, border-2, py-3 px-4, focus:ring treatment
- Labels: font-medium, mb-2
- Error states: border-red treatment, error text below
- RTL-aware placeholder alignment

### Badges/Tags
- Pill-shaped (rounded-full), px-3 py-1, text-sm
- Category tags, status indicators, cart count

### Navigation
- Top navbar: Sticky, backdrop-blur, shadow on scroll
- Bottom tab bar (mobile): Fixed, 4-5 icons max
- Breadcrumbs for navigation context

### Modals/Dialogs
- Centered overlay with backdrop
- Max-width constraints (max-w-2xl)
- Clear close button (top-right/left)
- Slide-in animation

---

## Images

**Hero Section:**
- Large, high-quality hero image showcasing signature products or restaurant/shop ambiance
- Aspect ratio: 16:9 on desktop, 4:3 on mobile
- Image should evoke appetite/desire and align with business type
- Ensure good contrast for text overlay

**Product Images:**
- Square or 4:3 ratio for consistency
- High resolution, well-lit, clean backgrounds preferred
- Consistent styling across all products

**Category Visuals:**
- Representative imagery for each category
- Can be photo collages or single hero product

**Optional Imagery:**
- About section: Business location, team, or food preparation photos
- Trust badges/certifications if applicable
- Payment/delivery method icons

---

## Animations & Interactions

**Subtle, Purposeful Only:**
- Page transitions: Fade in on mount
- Add to cart: Brief scale animation on button
- Cart count: Bounce animation when incremented
- Hover states: Smooth color/shadow transitions (duration-200)
- Scroll reveals: Subtle fade-up for sections (optional, use sparingly)

**NO complex scroll-triggered animations or parallax effects**

---

## Mobile-First Considerations

- Touch-friendly targets: Minimum 44px height for buttons
- Thumb-zone optimization: Critical actions within easy reach
- Sticky cart button on bottom for quick access
- Collapsible category filters
- Swipeable product image galleries
- Bottom sheet for cart on mobile

---

## Cultural & Market Adaptation

- Full RTL support throughout
- WhatsApp as primary contact method (culturally familiar)
- Cash on delivery emphasis if applicable
- Local currency formatting
- Prayer times consideration for restaurant hours display
- Family sharing options for larger orders

---

**Design Quality Standards:**
- Every component should feel polished and production-ready
- Consistent spacing rhythm throughout
- Thoughtful color contrast (to be defined in theme)
- Accessible form labels and error messaging
- Professional photography standards for product images
- Cohesive visual language across customer and business interfaces