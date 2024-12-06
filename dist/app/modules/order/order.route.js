"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWere_1 = __importDefault(require("../../middlewares/authMiddleWere"));
const validator_1 = require("../../middlewares/validator");
const order_controller_1 = __importDefault(require("./order.controller"));
const order_validation_1 = __importDefault(require("./order.validation"));
const router = (0, express_1.Router)();
router.post("/create", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("CUSTOMER"), (0, validator_1.validSchema)(order_validation_1.default.create), order_controller_1.default.createOrder);
router.get("/get-user", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("CUSTOMER"), order_controller_1.default.getUserOrders);
router.get("/get-vendor", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), order_controller_1.default.getVendorOrders);
router.put("/move-to-shipment/:orderId", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), order_controller_1.default.moveOrderForShipment);
const orderRoute = router;
exports.default = orderRoute;
