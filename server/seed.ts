import { db } from "./db";
import { storeSettings, categories, products, heroImages, towns } from "@shared/schema";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // Check if settings already exist
    const existingSettings = await db.select().from(storeSettings).limit(1);
    
    if (existingSettings.length === 0) {
      console.log("📝 Creating default store settings...");
      await db.insert(storeSettings).values({
        storeName: "Sheikh Shawarma",
        storeNameAr: "شاورما الشيخ",
        logoUrl: null,
        primaryColor: "#10b981",
        whatsappNumber: "972500000000",
        address: null,
        addressAr: null,
        workingHours: null,
        workingHoursAr: null,
        description: "Authentic Shawarma Taste",
        descriptionAr: "طعم الشاورما الاصيل",
      });
      console.log("✅ Store settings created");
    } else {
      console.log("ℹ️  Store settings already exist, skipping...");
    }

    // Check if categories already exist
    const existingCategories = await db.select().from(categories).limit(1);
    
    if (existingCategories.length === 0) {
      console.log("📝 Creating default categories...");
      
      const [mainDishes] = await db.insert(categories).values({
        name: "Main Dishes",
        nameAr: "الأطباق الرئيسية",
        imageUrl: null,
        displayOrder: 1,
      }).returning();

      const [appetizers] = await db.insert(categories).values({
        name: "Appetizers",
        nameAr: "المقبلات",
        imageUrl: null,
        displayOrder: 2,
      }).returning();

      const [desserts] = await db.insert(categories).values({
        name: "Desserts",
        nameAr: "الحلويات",
        imageUrl: null,
        displayOrder: 3,
      }).returning();

      console.log("✅ Categories created");

      // Check if products already exist
      const existingProducts = await db.select().from(products).limit(1);
      
      if (existingProducts.length === 0) {
        console.log("📝 Creating sample products...");
        
        await db.insert(products).values([
          {
            name: "Chicken Shawarma",
            nameAr: "شاورما دجاج",
            description: "Delicious chicken shawarma with fresh vegetables",
            descriptionAr: "شاورما دجاج شهية مع خضار طازجة",
            price: 2500, // 25.00 ILS
            imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800",
            categoryId: mainDishes.id,
            isAvailable: true,
            displayOrder: 1,
          },
          {
            name: "Falafel Plate",
            nameAr: "صحن فلافل",
            description: "Fresh falafel with tahini sauce and salad",
            descriptionAr: "فلافل طازجة مع صلصة الطحينة والسلطة",
            price: 1800, // 18.00 ILS
            imageUrl: "https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=800",
            categoryId: mainDishes.id,
            isAvailable: true,
            displayOrder: 2,
          },
          {
            name: "Hummus",
            nameAr: "حمص",
            description: "Creamy hummus with olive oil",
            descriptionAr: "حمص كريمي مع زيت الزيتون",
            price: 1200, // 12.00 ILS
            imageUrl: "https://images.unsplash.com/photo-1595951525025-3785e80e5560?w=800",
            categoryId: appetizers.id,
            isAvailable: true,
            displayOrder: 1,
          },
          {
            name: "Baklava",
            nameAr: "بقلاوة",
            description: "Sweet pastry with nuts and honey",
            descriptionAr: "معجنات حلوة مع المكسرات والعسل",
            price: 1500, // 15.00 ILS
            imageUrl: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=800",
            categoryId: desserts.id,
            isAvailable: true,
            displayOrder: 1,
          },
        ]);

        console.log("✅ Sample products created");
      } else {
        console.log("ℹ️  Products already exist, skipping...");
      }
    } else {
      console.log("ℹ️  Categories already exist, skipping...");
    }

    // Check if hero images already exist
    const existingHeroImages = await db.select().from(heroImages).limit(1);
    
    if (existingHeroImages.length === 0) {
      console.log("📝 Creating default hero slider images...");
      
      await db.insert(heroImages).values([
        {
          imageUrl: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=1200",
          titleAr: "شاورما الشيخ",
          subtitleAr: "طعم الشاورما الأصيل",
          displayOrder: 1,
          isActive: true,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1200",
          titleAr: "أطباق شهية",
          subtitleAr: "من أجود المكونات",
          displayOrder: 2,
          isActive: true,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200",
          titleAr: "مذاق استثنائي",
          subtitleAr: "تجربة لا تُنسى",
          displayOrder: 3,
          isActive: true,
        },
      ]);

      console.log("✅ Hero slider images created");
    } else {
      console.log("ℹ️  Hero images already exist, skipping...");
    }

    // Check if towns already exist
    const existingTowns = await db.select().from(towns).limit(1);
    
    if (existingTowns.length === 0) {
      console.log("📝 Creating default towns...");
      
      await db.insert(towns).values([
        {
          name: "Nazareth",
          nameAr: "الناصرة",
          deliveryFee: 1500, // 15.00 ILS
          isActive: true,
          displayOrder: 1,
        },
        {
          name: "Haifa",
          nameAr: "حيفا",
          deliveryFee: 2000, // 20.00 ILS
          isActive: true,
          displayOrder: 2,
        },
        {
          name: "Acre",
          nameAr: "عكا",
          deliveryFee: 1800, // 18.00 ILS
          isActive: true,
          displayOrder: 3,
        },
        {
          name: "Shefa-Amr",
          nameAr: "شفاعمرو",
          deliveryFee: 1200, // 12.00 ILS
          isActive: true,
          displayOrder: 4,
        },
        {
          name: "Sakhnin",
          nameAr: "سخنين",
          deliveryFee: 1000, // 10.00 ILS
          isActive: true,
          displayOrder: 5,
        },
      ]);

      console.log("✅ Default towns created");
    } else {
      console.log("ℹ️  Towns already exist, skipping...");
    }

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
