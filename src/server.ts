import http from "http";
import cron from "node-cron";
import app from "./app";
import prisma from "./app/config/prisma";
import adminUtils from "./app/modules/auth/admin.utils";
import { deleteSuspendedUsers } from "./utils/userSuspension";
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const appServer = server.listen(port);

const startServer = async () => {
  try {
    await prisma.$connect();
    const categories = [
      { id: "550e8400-e29b-41d4-a716-446655440010", label: "Men's Clothing" },
      { id: "550e8400-e29b-41d4-a716-446655440011", label: "Women's Clothing" },
      {
        id: "550e8400-e29b-41d4-a716-446655440012",
        label: "Children's Clothing",
      },
      { id: "550e8400-e29b-41d4-a716-446655440013", label: "Footwear" },
      { id: "550e8400-e29b-41d4-a716-446655440014", label: "Accessories" },
      { id: "550e8400-e29b-41d4-a716-446655440015", label: "Sportswear" },
      { id: "550e8400-e29b-41d4-a716-446655440016", label: "Formal Wear" },
      { id: "550e8400-e29b-41d4-a716-446655440017", label: "Outerwear" },
      { id: "550e8400-e29b-41d4-a716-446655440018", label: "Sleepwear" },
      { id: "550e8400-e29b-41d4-a716-446655440019", label: "Swimwear" },
    ];

    async function insertCategories() {
      try {
        for (const category of categories) {
          await prisma.category.create({
            data: {
              id: category.id,
              label: category.label,
            },
          });
          console.log(`Inserted category: ${category.label}`);
        }
        console.log("All categories inserted successfully!");
      } catch (error) {
        console.error("Error inserting categories:", error);
      } finally {
        await prisma.$disconnect();
      }
    }

    // insertCategories();
    await adminUtils.adminSeed();
    cron.schedule("0 0 * * *", () => {
      console.log("Running cron job to delete suspended users...");
      deleteSuspendedUsers();
    });
    console.log("database connnected", port);
  } catch (error) {
    console.log("database connnected", error);
    appServer.close(() => {
      process.exit(1);
    });
  }
};

startServer();
