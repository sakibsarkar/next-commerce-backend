"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWere_1 = __importDefault(require("../../middlewares/authMiddleWere"));
const validator_1 = require("../../middlewares/validator");
const coupon_controller_1 = require("./coupon.controller");
const coupon_validation_1 = __importDefault(require("./coupon.validation"));
const router = (0, express_1.Router)();
router.post("/get-coupon-by-code", authMiddleWere_1.default.isAuthenticateUser, (0, validator_1.validSchema)(coupon_validation_1.default.couponCodeStatus), coupon_controller_1.couponController.validCouponByCouponCodeByProductIds);
const couponRoute = router;
exports.default = couponRoute;
