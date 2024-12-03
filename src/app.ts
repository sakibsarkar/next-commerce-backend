import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "../src/app/routes/index";
import Config from "./app/config";
import prisma from "./app/config/prisma";
import globalErrorHandler from "./app/middlewares/error";
import { notFound } from "./app/middlewares/not-found";
const app = express();

// Middlewares
app.use(
  cors({
    origin: [Config.FRONTEND_URL!],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1", router);
app.get("/create", async (_req, res) => {
  const category = await prisma.category.create({
    data: {
      label: "Example Category",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "example@example",
      password: "12345678",
      role: "VENDOR",
      first_name: "example",
      last_name: "example",
      image: "https://example.com/image.jpg",
    },
  });

  const shop = await prisma.shop.create({
    data: {
      name: "Example Shop",
      ownerId: user.id,
      logo: "https://example.com/logo.png",
    },
  });

  await prisma.product.create({
    data: {
      name: "Example Product",
      price: 100.0,
      categoryId: category.id,
      shopId: shop.id,
      description: "Example Description",
      colors: {
        create: [
          {
            color: "Red",
            sizes: {
              create: [
                { size: "S", quantity: 10 },
                { size: "M", quantity: 15 },
              ],
            },
          },
          {
            color: "Blue",
            sizes: {
              create: [{ size: "L", quantity: 20 }],
            },
          },
        ],
      },
    },
  });
  res.send({
    success: true,
    statusCode: 200,
    message: "Hello from server",
  });
});
// 404 Handler

app.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({
    include: {
      colors: {
        include: {
          sizes: true,
        },
      },
      shopInfo: true,
    },
  });
  res.send({
    success: true,
    statusCode: 200,
    data: products,
    message: "Hello from server",
  });
});
app.use(notFound);
app.use(globalErrorHandler);

export default app;
