"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWere_1 = __importDefault(require("../../middlewares/authMiddleWere"));
const validator_1 = require("../../middlewares/validator");
const shop_controller_1 = __importDefault(require("./shop.controller"));
const shop_validation_1 = __importDefault(require("./shop.validation"));
const router = (0, express_1.Router)();
router.post("/create", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), (0, validator_1.validSchema)(shop_validation_1.default.create), shop_controller_1.default.createShop);
router.patch("/update", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), (0, validator_1.validSchema)(shop_validation_1.default.update), shop_controller_1.default.updateShop);
router.get("/myshop", authMiddleWere_1.default.isAuthenticateUser, shop_controller_1.default.getShopByUser);
const shopRoute = router;
exports.default = shopRoute;
