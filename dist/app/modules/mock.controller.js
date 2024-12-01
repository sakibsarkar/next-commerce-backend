"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const stripe_1 = __importDefault(require("../config/stripe"));
const express_1 = require("express");
const paymentIntent = (0, catchAsyncError_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentMethod = yield stripe_1.default.paymentIntents.create({
        amount: 1099,
        currency: "usd",
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        data: paymentMethod.id,
        message: "Payment intent created successfully",
    });
}));
const router = (0, express_1.Router)();
router.get("/payment-intent", paymentIntent);
const mockRoute = router;
exports.default = mockRoute;
