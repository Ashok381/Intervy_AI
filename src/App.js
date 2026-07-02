import express from "express";
import CORS from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.routes.js";
import { interviewRouter } from "./router/interviewReport.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  CORS({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);

app.get("/", (req, res) => {
  res.json({ message: "listening on port 3000" });
});

app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: "Route not found.",
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err?.statusCode || 500;
  const message = err?.message || "Something went wrong.";

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors: err?.errors || null,
  });
});

export default app;