import { 
  type StoreSettings, type InsertStoreSettings,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type HeroImage, type InsertHeroImage,
  type Town, type InsertTown,
  storeSettings,
  categories,
  products,
  orders,
  heroImages,
  towns,
} from "../shared/schema";
import { randomUUID } from "crypto";
import { getDbOrThrow } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Store Settings
  getSettings(): Promise<StoreSettings | undefined>;
  updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings>;

  // Hero Images
  getHeroImages(): Promise<HeroImage[]>;
  getHeroImage(id: string): Promise<HeroImage | undefined>;
  createHeroImage(image: InsertHeroImage): Promise<HeroImage>;
  updateHeroImage(id: string, data: Partial<HeroImage>): Promise<HeroImage>;
  deleteHeroImage(id: string): Promise<void>;

  // Towns
  getTowns(): Promise<Town[]>;
  getTown(id: string): Promise<Town | undefined>;
  createTown(town: InsertTown): Promise<Town>;
  updateTown(id: string, data: Partial<Town>): Promise<Town>;
  deleteTown(id: string): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, data: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, data: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, data: Partial<Order>): Promise<Order>;
}

export class MemStorage implements IStorage {
  private settings: StoreSettings | null;
  private heroImages: Map<string, HeroImage>;
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private townsMap: Map<string, Town>;

  constructor() {
    this.settings = null;
    this.heroImages = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.townsMap = new Map();
    this.seedData();
  }

  private async seedData() {
    // Create default categories
    const mainDishes = await this.createCategory({
      name: "Main Dishes",
      nameAr: "الأطباق الرئيسية",
      imageUrl: null,
      displayOrder: 1,
    });

    const appetizers = await this.createCategory({
      name: "Appetizers",
      nameAr: "المقبلات",
      imageUrl: null,
      displayOrder: 2,
    });

    const desserts = await this.createCategory({
      name: "Desserts",
      nameAr: "الحلويات",
      imageUrl: null,
      displayOrder: 3,
    });

    // Create sample products
    await this.createProduct({
      name: "Chicken Shawarma",
      nameAr: "شاورما دجاج",
      description: "Delicious chicken shawarma with fresh vegetables",
      descriptionAr: "شاورما دجاج شهية مع خضار طازجة",
      price: 2500, // 25.00 SAR
      imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800",
      categoryId: mainDishes.id,
      isAvailable: true,
      displayOrder: 1,
    });

    await this.createProduct({
      name: "Falafel Plate",
      nameAr: "صحن فلافل",
      description: "Fresh falafel with tahini sauce and salad",
      descriptionAr: "فلافل طازجة مع صلصة الطحينة والسلطة",
      price: 1800, // 18.00 SAR
      imageUrl: "https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=800",
      categoryId: mainDishes.id,
      isAvailable: true,
      displayOrder: 2,
    });

    await this.createProduct({
      name: "Hummus",
      nameAr: "حمص",
      description: "Creamy hummus with olive oil",
      descriptionAr: "حمص كريمي مع زيت الزيتون",
      price: 1200, // 12.00 SAR
      imageUrl: "https://images.unsplash.com/photo-1595951525025-3785e80e5560?w=800",
      categoryId: appetizers.id,
      isAvailable: true,
      displayOrder: 1,
    });

    await this.createProduct({
      name: "Baklava",
      nameAr: "بقلاوة",
      description: "Sweet pastry with nuts and honey",
      descriptionAr: "معجنات حلوة مع المكسرات والعسل",
      price: 1500, // 15.00 SAR
      imageUrl: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=800",
      categoryId: desserts.id,
      isAvailable: true,
      displayOrder: 1,
    });
  }

  // Store Settings
  async getSettings(): Promise<StoreSettings | undefined> {
    if (!this.settings) {
      // Create default settings
      const id = randomUUID();
      this.settings = {
        id,
        storeName: "My Store",
        storeNameAr: "متجري",
        logoUrl: null,
        primaryColor: "#10b981",
        whatsappNumber: "966500000000",
        address: null,
        addressAr: null,
        workingHours: null,
        workingHoursAr: null,
        description: null,
        descriptionAr: "متجر إلكتروني متكامل",
        updatedAt: new Date(),
      };
    }
    return this.settings;
  }

  async updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getSettings();
    this.settings = { 
      ...current!, 
      ...data, 
      updatedAt: new Date() 
    };
    return this.settings;
  }

  // Hero Images (stub for compatibility)
  async getHeroImages(): Promise<HeroImage[]> {
    return Array.from(this.heroImages.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getHeroImage(id: string): Promise<HeroImage | undefined> {
    return this.heroImages.get(id);
  }

  async createHeroImage(insertImage: InsertHeroImage): Promise<HeroImage> {
    const id = randomUUID();
    const image: HeroImage = { 
      id,
      imageUrl: insertImage.imageUrl,
      title: insertImage.title ?? null,
      titleAr: insertImage.titleAr ?? null,
      subtitle: insertImage.subtitle ?? null,
      subtitleAr: insertImage.subtitleAr ?? null,
      displayOrder: insertImage.displayOrder ?? 0,
      isActive: insertImage.isActive ?? true,
      createdAt: new Date() 
    };
    this.heroImages.set(id, image);
    return image;
  }

  async updateHeroImage(id: string, data: Partial<HeroImage>): Promise<HeroImage> {
    const existing = this.heroImages.get(id);
    if (!existing) throw new Error("Hero image not found");
    const updated = { ...existing, ...data };
    this.heroImages.set(id, updated);
    return updated;
  }

  async deleteHeroImage(id: string): Promise<void> {
    this.heroImages.delete(id);
  }

  // Towns
  async getTowns(): Promise<Town[]> {
    return Array.from(this.townsMap.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getTown(id: string): Promise<Town | undefined> {
    return this.townsMap.get(id);
  }

  async createTown(insertTown: InsertTown): Promise<Town> {
    const id = randomUUID();
    const town: Town = {
      id,
      name: insertTown.name,
      nameAr: insertTown.nameAr,
      deliveryFee: insertTown.deliveryFee ?? 0,
      isActive: insertTown.isActive ?? true,
      displayOrder: insertTown.displayOrder ?? 0,
      createdAt: new Date(),
    };
    this.townsMap.set(id, town);
    return town;
  }

  async updateTown(id: string, data: Partial<Town>): Promise<Town> {
    const existing = this.townsMap.get(id);
    if (!existing) throw new Error("Town not found");
    const updated = { ...existing, ...data };
    this.townsMap.set(id, updated);
    return updated;
  }

  async deleteTown(id: string): Promise<void> {
    this.townsMap.delete(id);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { 
      name: insertCategory.name,
      nameAr: insertCategory.nameAr,
      imageUrl: insertCategory.imageUrl ?? null,
      displayOrder: insertCategory.displayOrder ?? 0,
      id, 
      createdAt: new Date() 
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const existing = this.categories.get(id);
    if (!existing) throw new Error("Category not found");
    const updated = { ...existing, ...data };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories.delete(id);
    // Also delete products in this category
    const productsToDelete: string[] = [];
    this.products.forEach((product, productId) => {
      if (product.categoryId === id) {
        productsToDelete.push(productId);
      }
    });
    productsToDelete.forEach(productId => this.products.delete(productId));
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      name: insertProduct.name,
      nameAr: insertProduct.nameAr,
      description: insertProduct.description ?? null,
      descriptionAr: insertProduct.descriptionAr ?? null,
      price: insertProduct.price,
      imageUrl: insertProduct.imageUrl ?? null,
      categoryId: insertProduct.categoryId,
      isAvailable: insertProduct.isAvailable ?? true,
      displayOrder: insertProduct.displayOrder ?? 0,
      id, 
      createdAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) throw new Error("Product not found");
    const updated = { ...existing, ...data };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    this.products.delete(id);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const nextOrderNumber = this.orders.size > 0
      ? Math.max(...Array.from(this.orders.values()).map(o => o.orderNumber)) + 1
      : 1;
    const order: Order = { 
      customerName: insertOrder.customerName,
      customerPhone: insertOrder.customerPhone,
      customerAddress: insertOrder.customerAddress,
      townId: insertOrder.townId ?? null,
      townName: insertOrder.townName ?? null,
      deliveryFee: insertOrder.deliveryFee ?? 0,
      items: insertOrder.items,
      totalAmount: insertOrder.totalAmount,
      notes: insertOrder.notes ?? null,
      id,
      orderNumber: nextOrderNumber,
      status: "pending",
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    const existing = this.orders.get(id);
    if (!existing) throw new Error("Order not found");
    const updated = { ...existing, ...data };
    this.orders.set(id, updated);
    return updated;
  }
}

// PostgreSQL Database Storage
export class DbStorage implements IStorage {
  private get db() {
    return getDbOrThrow();
  }

  // Store Settings
  async getSettings(): Promise<StoreSettings | undefined> {
    const result = await this.db.select().from(storeSettings).limit(1);
    if (result[0]) return result[0];

    const [newSettings] = await this.db.insert(storeSettings).values({
      storeName: "My Store",
      storeNameAr: "متجري",
      logoUrl: null,
      primaryColor: "#10b981",
      whatsappNumber: "972500000000",
      address: null,
      addressAr: null,
      workingHours: null,
      workingHoursAr: null,
      description: null,
      descriptionAr: null,
    }).returning();
    return newSettings;
  }

  async updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    const existing = await this.getSettings();
    
    if (!existing) {
      const [newSettings] = await this.db.insert(storeSettings).values({
        storeName: data.storeName || "My Store",
        storeNameAr: data.storeNameAr || "متجري",
        logoUrl: data.logoUrl || null,
        primaryColor: data.primaryColor || "#10b981",
        whatsappNumber: data.whatsappNumber || "972500000000",
        address: data.address || null,
        addressAr: data.addressAr || null,
        workingHours: data.workingHours || null,
        workingHoursAr: data.workingHoursAr || null,
        description: data.description || null,
        descriptionAr: data.descriptionAr || null,
      }).returning();
      return newSettings;
    }

    const [updated] = await this.db
      .update(storeSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(storeSettings.id, existing.id))
      .returning();
    return updated;
  }

  // Hero Images
  async getHeroImages(): Promise<HeroImage[]> {
    return await this.db.select().from(heroImages).orderBy(heroImages.displayOrder);
  }

  async getHeroImage(id: string): Promise<HeroImage | undefined> {
    const result = await this.db.select().from(heroImages).where(eq(heroImages.id, id)).limit(1);
    return result[0];
  }

  async createHeroImage(insertImage: InsertHeroImage): Promise<HeroImage> {
    const [image] = await this.db.insert(heroImages).values(insertImage).returning();
    return image;
  }

  async updateHeroImage(id: string, data: Partial<HeroImage>): Promise<HeroImage> {
    const [updated] = await this.db
      .update(heroImages)
      .set(data)
      .where(eq(heroImages.id, id))
      .returning();
    if (!updated) throw new Error("Hero image not found");
    return updated;
  }

  async deleteHeroImage(id: string): Promise<void> {
    await this.db.delete(heroImages).where(eq(heroImages.id, id));
  }

  // Towns
  async getTowns(): Promise<Town[]> {
    return await this.db.select().from(towns).orderBy(towns.displayOrder);
  }

  async getTown(id: string): Promise<Town | undefined> {
    const result = await this.db.select().from(towns).where(eq(towns.id, id)).limit(1);
    return result[0];
  }

  async createTown(insertTown: InsertTown): Promise<Town> {
    const [town] = await this.db.insert(towns).values(insertTown).returning();
    return town;
  }

  async updateTown(id: string, data: Partial<Town>): Promise<Town> {
    const [updated] = await this.db
      .update(towns)
      .set(data)
      .where(eq(towns.id, id))
      .returning();
    if (!updated) throw new Error("Town not found");
    return updated;
  }

  async deleteTown(id: string): Promise<void> {
    await this.db.delete(towns).where(eq(towns.id, id));
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await this.db.select().from(categories).orderBy(categories.displayOrder);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await this.db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await this.db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const [updated] = await this.db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    if (!updated) throw new Error("Category not found");
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.db.delete(categories).where(eq(categories.id, id));
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await this.db.select().from(products).orderBy(products.displayOrder);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await this.db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await this.db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const [updated] = await this.db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    if (!updated) throw new Error("Product not found");
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.db.delete(products).where(eq(products.id, id));
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await this.db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await this.db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const maxResult = await this.db.select({ maxNum: sql<number>`COALESCE(MAX(${orders.orderNumber}), 0)` }).from(orders);
    const nextOrderNumber = (maxResult[0]?.maxNum ?? 0) + 1;
    const [order] = await this.db.insert(orders).values({ ...insertOrder, orderNumber: nextOrderNumber }).returning();
    return order;
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    const [updated] = await this.db
      .update(orders)
      .set(data)
      .where(eq(orders.id, id))
      .returning();
    if (!updated) throw new Error("Order not found");
    return updated;
  }
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new DbStorage()
  : new MemStorage();
