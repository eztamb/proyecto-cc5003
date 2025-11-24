import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

import Store from "./models/store";
import Item from "./models/item";
import Review from "./models/review";
import User from "./models/user";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env file");
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    const dbJsonPath = path.join(__dirname, "../db.json");
    const dbData = JSON.parse(fs.readFileSync(dbJsonPath, "utf-8"));

    console.log("Clearing existing data...");
    await Store.deleteMany({});
    await Item.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    console.log("Existing data cleared (including users)");

    // crear test admin para reviews
    console.log("Creating test user...");
    const passwordHash = await bcrypt.hash("password123", 10);
    const testUser = new User({
      username: "testuser",
      passwordHash,
      role: "admin",
    });
    const savedUser = await testUser.save();
    console.log(`  ✓ Created test user: ${testUser.username}`);

    console.log("Inserting stores...");
    const storeIdMap = new Map<string, string>(); 
    
    for (const store of dbData.stores) {
      const newStore = new Store({
        storeCategory: store.storeCategory,
        name: store.name,
        description: store.description,
        location: store.location,
        images: store.images,
        junaeb: store.junaeb,
      });
      const savedStore = await newStore.save();
      storeIdMap.set(store.id.toString(), savedStore._id.toString());
      console.log(`  ✓ Created store: ${store.name}`);
    }

    console.log("Inserting items...");
    for (const item of dbData.storeItems) {
      const newStoreId = storeIdMap.get(item.storeId.toString());
      if (!newStoreId) {
        console.log(`  ⚠ Warning: Store ID ${item.storeId} not found for item ${item.name}`);
        continue;
      }
      
      const newItem = new Item({
        name: item.name,
        store: newStoreId,
        description: item.description,
        picture: item.picture,
        price: item.price,
      });
      await newItem.save();
      console.log(`  ✓ Created item: ${item.name}`);
    }

    console.log("Inserting reviews...");
    for (const review of dbData.storeReviews) {
      const newStoreId = storeIdMap.get(review.storeId.toString());
      if (!newStoreId) {
        console.log(`  ⚠ Warning: Store ID ${review.storeId} not found for review`);
        continue;
      }
      
      const newReview = new Review({
        store: newStoreId,
        user: savedUser._id,
        rating: review.rating,
        comment: review.comment,
        userName: review.userName || "Anonymous",
        picture: review.picture,
      });
      await newReview.save();
      console.log(`  ✓ Created review for store ID: ${newStoreId}`);
    }

    console.log("\n✅ Database seeded successfully!");
    console.log(`   Stores: ${dbData.stores.length}`);
    console.log(`   Items: ${dbData.storeItems.length}`);
    console.log(`   Reviews: ${dbData.storeReviews.length}`);
    console.log(`   Users: 1 (testuser / password123)`);

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

seedDatabase();