# متجري - قالب متجر إلكتروني احترافي

## نظرة عامة
منصة متكاملة لإنشاء متاجر إلكترونية احترافية للمحلات والمطاعم الصغيرة. تم تصميم القالب ليكون قابلاً لإعادة الاستخدام بسهولة لعملاء مختلفين مع إمكانية التخصيص الكامل.

## الميزات الرئيسية

### واجهة المتجر (للعملاء)
- ✅ سلايدر صور احترافي مع عرض تلقائي (Hero Slider)
- ✅ صفحة هبوط جذابة مع عناوين مخصصة لكل صورة
- ✅ عرض المنتجات مع الصور والأسعار والأوصاف
- ✅ تصنيف المنتجات حسب الأقسام
- ✅ سلة طلبات تفاعلية مع إضافة وحذف المنتجات
- ✅ نموذج إتمام الطلب مع حقول كاملة
- ✅ إرسال الطلبات مباشرة إلى WhatsApp برسالة منسقة
- ✅ تصميم عربي RTL متجاوب بالكامل
- ✅ وضع داكن/فاتح

### لوحة التحكم (للبائع)
- ✅ لوحة معلومات تفاعلية مع إحصائيات
- ✅ إدارة المنتجات (إضافة، تعديل، حذف)
- ✅ إدارة الأقسام (إضافة، تعديل، حذف)
- ✅ إدارة صور السلايدر (إضافة، تعديل، حذف، تفعيل/إيقاف)
- ✅ عرض وإدارة الطلبات
- ✅ رفع الصور من الجهاز للمنتجات والأقسام والشعار وسلايدر الصور
- ✅ إعدادات المتجر القابلة للتخصيص:
  - اسم المتجر
  - الشعار
  - الألوان الأساسية
  - رقم الواتساب
  - معلومات التواصل
  - ساعات العمل

## البنية التقنية

### Frontend
- **إطار العمل**: React + TypeScript
- **التصميم**: Tailwind CSS + Shadcn UI
- **Routing**: Wouter
- **إدارة الحالة**: TanStack Query
- **الخطوط**: Cairo & Tajawal (خطوط عربية احترافية)

### Backend
- **الخادم**: Express.js
- **قاعدة البيانات**: PostgreSQL (Neon Serverless) مع Drizzle ORM
- **التحقق من البيانات**: Zod
- **رفع الملفات**: Multer (صور بحد أقصى 5MB)
- **TypeScript** للأمان والموثوقية
- **حفظ البيانات**: دائم - جميع التغييرات تُحفظ تلقائياً في قاعدة البيانات

## الاستخدام

### للبائع
1. افتح لوحة التحكم: `/admin`
2. قم بتخصيص إعدادات المتجر من صفحة الإعدادات
3. أضف الأقسام والمنتجات
4. راجع الطلبات الواردة وحدث حالتها

### للعميل
1. افتح الصفحة الرئيسية: `/`
2. تصفح المنتجات وأضفها للسلة
3. أتمم الطلب بإدخال البيانات
4. سيتم إرسال الطلب مباشرة للواتساب

## التخصيص لعميل جديد

القالب قابل للتخصيص بالكامل من لوحة التحكم بدون الحاجة لتعديل الكود:

1. **الهوية البصرية**:
   - تغيير اسم المتجر (عربي وإنجليزي)
   - رفع شعار مخصص
   - اختيار اللون الأساسي

2. **المحتوى**:
   - إضافة/تعديل الأقسام
   - إضافة/تعديل المنتجات مع الصور
   - تحديث معلومات التواصل

3. **الإعدادات**:
   - رقم الواتساب الخاص بالمتجر
   - ساعات العمل
   - العنوان والوصف

## المسارات

- `/` - واجهة المتجر (الصفحة الرئيسية)
- `/admin` - لوحة التحكم الرئيسية
- `/admin/products` - إدارة المنتجات
- `/admin/categories` - إدارة الأقسام
- `/admin/hero-slider` - إدارة صور السلايدر
- `/admin/orders` - عرض وإدارة الطلبات
- `/admin/settings` - إعدادات المتجر

## API Endpoints

### File Upload
- `POST /api/upload` - رفع صورة (قبول: JPEG, PNG, GIF, WebP، حد أقصى: 5MB)

### Store Settings
- `GET /api/settings` - الحصول على إعدادات المتجر
- `PATCH /api/settings` - تحديث إعدادات المتجر

### Categories
- `GET /api/categories` - الحصول على جميع الأقسام
- `POST /api/categories` - إنشاء قسم جديد
- `PATCH /api/categories/:id` - تحديث قسم
- `DELETE /api/categories/:id` - حذف قسم

### Products
- `GET /api/products` - الحصول على جميع المنتجات
- `POST /api/products` - إنشاء منتج جديد
- `PATCH /api/products/:id` - تحديث منتج
- `DELETE /api/products/:id` - حذف منتج

### Orders
- `GET /api/orders` - الحصول على جميع الطلبات
- `POST /api/orders` - إنشاء طلب جديد
- `PATCH /api/orders/:id` - تحديث حالة طلب

### Hero Images
- `GET /api/hero-images` - الحصول على جميع صور السلايدر
- `POST /api/hero-images` - إنشاء صورة سلايدر جديدة
- `PATCH /api/hero-images/:id` - تحديث صورة سلايدر
- `DELETE /api/hero-images/:id` - حذف صورة سلايدر

## نموذج البيانات

### Store Settings
```typescript
{
  storeName: string
  storeNameAr: string
  logoUrl: string | null
  primaryColor: string
  whatsappNumber: string
  address: string | null
  addressAr: string | null
  workingHours: string | null
  workingHoursAr: string | null
  description: string | null
  descriptionAr: string | null
}
```

### Category
```typescript
{
  name: string
  nameAr: string
  imageUrl: string | null
  displayOrder: number
}
```

### Product
```typescript
{
  name: string
  nameAr: string
  description: string | null
  descriptionAr: string | null
  price: number // بالأغورة (ILS agorot)
  imageUrl: string | null
  categoryId: string
  isAvailable: boolean
  displayOrder: number
}
```

### Order
```typescript
{
  customerName: string
  customerPhone: string
  customerAddress: string
  items: string // JSON array of order items
  totalAmount: number // بالأغورة (ILS agorot)
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes: string | null
}
```

### Hero Image
```typescript
{
  imageUrl: string
  titleAr: string | null
  subtitleAr: string | null
  displayOrder: number
  isActive: boolean
}
```

## التطوير المستقبلي

يمكن إضافة هذه الميزات لاحقاً:
- [ ] نظام إدارة الطلبات المتقدم مع تتبع الحالات
- [ ] تكامل مع بوابات الدفع الإلكتروني
- [ ] نظام الإشعارات للطلبات الجديدة
- [ ] إمكانية إنشاء مواقع متعددة لعملاء مختلفين
- [ ] تقارير وإحصائيات المبيعات
- [ ] نظام التقييمات والمراجعات
- [ ] قسائم الخصم والعروض
- [ ] نظام تنظيف الصور المرفوعة تلقائياً
- [ ] حماية endpoint رفع الصور بنظام authentication

## ملاحظات مهمة

- جميع الأسعار يتم تخزينها بالأغورة (ILS agorot) للدقة - كل شيكل = 100 أغورة
- العملة المستخدمة: الشيكل الإسرائيلي (₪)
- رقم الواتساب يجب أن يكون بالصيغة الدولية بدون + (مثال: 972501234567)
- الصور يتم رفعها من الجهاز مباشرة وتُخزن في `/public/uploads`
- حد أقصى لحجم الصور: 5MB
- أنواع الصور المقبولة: JPEG, PNG, GIF, WebP
- التطبيق يدعم اللغة العربية بشكل كامل مع RTL
- **جميع التغييرات تُحفظ تلقائياً في PostgreSQL** - لا حاجة لإعادة النشر
- البيانات محمية من الضياع عند إعادة تشغيل السيرفر

## التحديثات الأخيرة

### 28 أكتوبر 2025
- ✅ **إضافة نظام سلايدر الصور الاحترافي**
  - إنشاء جدول hero_images في قاعدة البيانات
  - إضافة صفحة إدارة صور السلايدر في لوحة التحكم `/admin/hero-slider`
  - تكامل carousel مع autoplay باستخدام embla-carousel-react
  - إمكانية تحديد عنوان وعنوان فرعي مخصص لكل صورة
  - نظام تفعيل/إيقاف الصور وترتيبها
  - اختبار شامل end-to-end للسلايدر والإدارة
  
- ✅ **ترقية قاعدة البيانات إلى PostgreSQL**
  - إنشاء قاعدة بيانات PostgreSQL (Neon Serverless)
  - إضافة DbStorage class مع جميع عمليات CRUD
  - إنشاء جداول المتجر باستخدام Drizzle migrations
  - إضافة بيانات أولية (seeding) عبر server/seed.ts
  - **حل مشكلة فقدان البيانات** - جميع التغييرات الآن تُحفظ بشكل دائم
  - اختبار ناجح لحفظ البيانات بعد إعادة تشغيل السيرفر

### 27 أكتوبر 2025
- ✅ تغيير العملة من الريال السعودي إلى الشيكل الإسرائيلي
- ✅ إضافة نظام رفع الصور من الجهاز باستخدام Multer
- ✅ إنشاء مكون ImageUpload قابل لإعادة الاستخدام
- ✅ تحديث جميع النماذج لاستخدام رفع الصور بدلاً من روابط URL
- ✅ إصلاح مشكلة controlled components في النماذج
- ✅ إضافة DialogDescription لتحسين accessibility

## الدعم

للمساعدة أو الاستفسارات، يرجى التواصل مع فريق التطوير.
