import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "../src/app/routes/index";
import Config from "./app/config";
import globalErrorHandler from "./app/middlewares/error";
import { notFound } from "./app/middlewares/not-found";
const app = express();

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
  res.send({
    success: true,
    statusCode: 200,
    data: [],
    message: "Hello from server",
  });
});
app.use(notFound);
app.use(globalErrorHandler);

export default app;
