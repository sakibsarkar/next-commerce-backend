import http from "http";
import app from "./app";
import prisma from "./app/config/prisma";
import { deleteSuspendedUsers } from "./utils/userSuspension";
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const appServer = server.listen(port);
import cron from "node-cron";

const startServer = async () => {
  try {
    await prisma.$connect();
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
