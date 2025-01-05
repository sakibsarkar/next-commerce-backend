import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { google } from "googleapis";
import morgan from "morgan";
import router from "../src/app/routes/index";
import Config from "./app/config";
import globalErrorHandler from "./app/middlewares/error";
import { notFound } from "./app/middlewares/not-found";
import { appendDataInSheet } from "./utils/googleSheet.utils";
const app = express();
export const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

// Middlewares
app.use(
  cors({
    origin: [Config.FRONTEND_URL!, "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1", router);

// 404 Handler

app.get("/", async (_req, res) => {
  await appendDataInSheet({
    tnxId: "sakib test korteche",
    orderId: "123",
    userId: "123",
    date: "123",
    amount: 123,
  });
  res.send({
    success: true,
    statusCode: 200,
    data: null,
    message: "Hello from server",
  });
});
app.use(notFound);
app.use(globalErrorHandler);

export default app;
