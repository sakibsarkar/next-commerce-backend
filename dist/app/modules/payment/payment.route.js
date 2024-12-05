"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWere_1 = __importDefault(require("../../middlewares/authMiddleWere"));
const payment_controller_1 = __importDefault(require("./payment.controller"));
const router = (0, express_1.Router)();
router.post("/create-payment-intent", authMiddleWere_1.default.isAuthenticateUser, payment_controller_1.default.createPaymentIntent);
const paymentRoute = router;
exports.default = paymentRoute;
