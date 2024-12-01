import http from "http";
import app from "./app";
import prisma from "./app/config/prisma";
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const appServer = server.listen(port);
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("database connnected", port);
  } catch (error) {
    console.log("database connnected", error);
    appServer.close(() => {
      process.exit(1);
    });
  }
};

startServer();
