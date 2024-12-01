"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../errors/AppError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const globalErrorHandler = (error, req, res, next) => {
    let message = (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong!";
    let statusCode = (error === null || error === void 0 ? void 0 : error.statusCode) || 500;
    let errorMessages = [];
    if (error instanceof AppError_1.default) {
        statusCode = (error === null || error === void 0 ? void 0 : error.statusCode) || 400;
        message = error.message;
        errorMessages = [];
    }
    else if (error instanceof zod_1.ZodError) {
        const simpleErr = (0, handleZodError_1.default)(error);
        statusCode = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.statusCode;
        message = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.message;
        errorMessages = simpleErr === null || simpleErr === void 0 ? void 0 : simpleErr.errorSources;
    }
    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        errorMessages: errorMessages.length > 0 ? errorMessages : undefined,
        stack: process.env.NODE_ENV === "development" ? error === null || error === void 0 ? void 0 : error.stack : undefined,
    });
};
exports.default = globalErrorHandler;
