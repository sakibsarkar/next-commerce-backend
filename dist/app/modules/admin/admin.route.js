"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWere_1 = __importDefault(require("../../middlewares/authMiddleWere"));
const admin_controller_1 = __importDefault(require("./admin.controller"));
const router = (0, express_1.Router)();
router.patch("/toggle-suspension/:userId", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("ADMIN"), admin_controller_1.default.toggleUserSuspension);
router.delete("/delete-user/:userId", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("ADMIN"), admin_controller_1.default.deleteUser);
router.patch("/toggle-shop-blacklist/:shopId", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("ADMIN"), admin_controller_1.default.toggleShopBlackListStatus);
router.get("/transactions", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("ADMIN"), admin_controller_1.default.getTransactionHistory);
router.get("/system-overview", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("ADMIN"), admin_controller_1.default.getSystemOverview);
router.get("/transaction-data", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("ADMIN"), admin_controller_1.default.getMonthlyTransactionOfCurrentYear);
router.get("/user-list", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("ADMIN"), admin_controller_1.default.getAllUserList);
router.get("/shop-list", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("ADMIN"), admin_controller_1.default.getAllShopList);
const adminRoute = router;
exports.default = adminRoute;
