import mongoose from "mongoose";
import dotenv from "dotenv";
import Store from "../models/store";
import Item from "../models/item";
import Review from "../models/review";
import User from "../models/user";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

dotenv.config();

// Lógica para seleccionar la DB correcta
const isTestEnv = process.env.NODE_ENV === "test";
const MONGODB_URI = isTestEnv
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI || "mongodb://localhost:27017/beauchefoods";

if (!MONGODB_URI) {
  console.error("Error: No Mongo URI defined");
  process.exit(1);
}

// Cargar datos del db.json
const dbData = JSON.parse(fs.readFileSync(path.join(__dirname, "../../db.json"), "utf-8"));

const seed = async () => {
  console.log(`🌱 Iniciando seeding en entorno: ${isTestEnv ? "TEST" : "DEV"}...`);
  console.log(`   DB: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI);

    // 1. Limpiar la base de datos
    await User.deleteMany({});
    await Store.deleteMany({});
    await Item.deleteMany({});
    await Review.deleteMany({});

    // 2. Crear Usuario Admin
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash("admin123", saltRounds);

    const adminUser = await new User({
      username: "admin",
      passwordHash,
      role: "admin",
    }).save();

    // 3. Crear Tiendas y mapear IDs antiguos a nuevos ObjectIds
    const storeIdMap: Record<string, any> = {};

    for (const storeData of dbData.stores) {
      const { id, ...rest } = storeData;
      // Asignamos al admin como dueño de las tiendas del seed
      const newStore = await new Store({ ...rest, owner: adminUser._id }).save();
      storeIdMap[id] = newStore._id;
    }

    // 4. Crear Items
    for (const itemData of dbData.storeItems) {
      const { id, storeId, ...rest } = itemData;
      const storeObjectId = storeIdMap[storeId];
      if (storeObjectId) {
        await new Item({ ...rest, store: storeObjectId }).save();
      }
    }

    // 5. Crear Reviews
    for (const reviewData of dbData.storeReviews) {
      const { id, storeId, ...rest } = reviewData;
      const storeObjectId = storeIdMap[storeId];
      if (storeObjectId) {
        await new Review({
          ...rest,
          store: storeObjectId,
          user: adminUser._id,
        }).save();
      }
    }

    console.log("✅ Seeding completado con éxito.");

    // Cerrar la conexión al terminar para que el script finalice
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante el seeding:", error);
    process.exit(1);
  }
};

seed();
