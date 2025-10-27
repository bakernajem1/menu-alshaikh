# متجري - قالب متجر إلكتروني احترافي

## نظرة عامة
منصة متكاملة لإنشاء متاجر إلكترونية احترافية للمحلات والمطاعم الصغيرة. تم تصميم القالب ليكون قابلاً لإعادة الاستخدام بسهولة لعملاء مختلفين مع إمكانية التخصيص الكامل.

## الميزات الرئيسية

### واجهة المتجر (للعملاء)
- ✅ صفحة هبوط جذابة مع Hero Section احترافي
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
- ✅ عرض وإدارة الطلبات
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
- **قاعدة البيانات**: In-Memory Storage (قابل للتحويل إلى PostgreSQL)
- **التحقق من البيانات**: Zod
- **TypeScript** للأمان والموثوقية

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
- `/admin/orders` - عرض وإدارة الطلبات
- `/admin/settings` - إعدادات المتجر

## API Endpoints

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
  price: number // بالفلس (SAR cents)
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
  totalAmount: number // بالفلس (SAR cents)
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes: string | null
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

## ملاحظات مهمة

- جميع الأسعار يتم تخزينها بالفلس (SAR cents) للدقة
- رقم الواتساب يجب أن يكون بالصيغة الدولية بدون + (مثال: 966512345678)
- الصور يمكن استخدام روابط خارجية (Unsplash, Cloudinary, etc.)
- التطبيق يدعم اللغة العربية بشكل كامل مع RTL

## الدعم

للمساعدة أو الاستفسارات، يرجى التواصل مع فريق التطوير.
