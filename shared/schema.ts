import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Store Settings - إعدادات المتجر
export const storeSettings = pgTable("store_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storeName: text("store_name").notNull(),
  storeNameAr: text("store_name_ar").notNull(),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").notNull().default("#10b981"),
  whatsappNumber: text("whatsapp_number").notNull(),
  address: text("address"),
  addressAr: text("address_ar"),
  workingHours: text("working_hours"),
  workingHoursAr: text("working_hours_ar"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStoreSettingsSchema = createInsertSchema(storeSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertStoreSettings = z.infer<typeof insertStoreSettingsSchema>;
export type StoreSettings = typeof storeSettings.$inferSelect;

// Hero Slider Images - صور السلايدر الرئيسي
export const heroImages = pgTable("hero_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  title: text("title"),
  titleAr: text("title_ar"),
  subtitle: text("subtitle"),
  subtitleAr: text("subtitle_ar"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHeroImageSchema = createInsertSchema(heroImages).omit({
  id: true,
  createdAt: true,
});

export type InsertHeroImage = z.infer<typeof insertHeroImageSchema>;
export type HeroImage = typeof heroImages.$inferSelect;

// Categories - الأقسام
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Towns - البلدات
export const towns = pgTable("towns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  deliveryFee: integer("delivery_fee").notNull().default(0), // أجرة التوصيل بالأغورة
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTownSchema = createInsertSchema(towns).omit({
  id: true,
  createdAt: true,
});

export type InsertTown = z.infer<typeof insertTownSchema>;
export type Town = typeof towns.$inferSelect;

// Products - المنتجات
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  price: integer("price").notNull(), // السعر بالفلس/سنت
  discountedPrice: integer("discounted_price"), // السعر بعد الخصم (nullable)
  discountStartDate: timestamp("discount_start_date"), // تاريخ بداية الخصم
  discountEndDate: timestamp("discount_end_date"), // تاريخ انتهاء الخصم
  imageUrl: text("image_url"),
  categoryId: varchar("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  isAvailable: boolean("is_available").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Orders - الطلبات
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  townId: varchar("town_id").references(() => towns.id, { onDelete: "set null" }),
  townName: text("town_name"), // نحفظ اسم البلدة للأرشفة
  deliveryFee: integer("delivery_fee").notNull().default(0), // أجرة التوصيل بالأغورة
  items: text("items").notNull(), // JSON string of order items
  totalAmount: integer("total_amount").notNull(), // المجموع الكلي شامل أجرة التوصيل
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Item Type (not a table, just for TypeScript)
export type OrderItem = {
  productId: string;
  productName: string;
  productNameAr: string;
  quantity: number;
  price: number;
};
