/* eslint-disable @typescript-eslint/no-unused-vars */

import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import AppError from "../errors/AppError";
import handleZodError from "../errors/handleZodError";
import { IErrorSources } from "../interface/error";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let message = error?.message || "Something went wrong!";
  let statusCode = error?.statusCode || 500;
  let errorMessages: IErrorSources = [];

  if (error instanceof AppError) {
    statusCode = error?.statusCode || 400;
    message = error.message;
    errorMessages = [];
  } else if (error instanceof ZodError) {
    const simpleErr = handleZodError(error);
    statusCode = simpleErr?.statusCode;
    message = simpleErr?.message;
    errorMessages = simpleErr?.errorSources;
  }

  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    errorMessages: errorMessages.length > 0 ? errorMessages : undefined,
    stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
