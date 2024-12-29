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
router.post("/create", authMiddleWere_1.default.isAuthenticateUser, coupon_controller_1.couponController.createCoupon);
router.post("/get-coupon-by-code", authMiddleWere_1.default.isAuthenticateUser, (0, validator_1.validSchema)(coupon_validation_1.default.couponCodeStatus), coupon_controller_1.couponController.validCouponByCouponCodeByProductIds);
router.get("/get-coupon-list", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("ADMIN"), coupon_controller_1.couponController.getCouponList);
router.get("/get-vendor-coupon", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), coupon_controller_1.couponController.getVendorCouponList);
router.delete("/delete/:couponId", authMiddleWere_1.default.isAuthenticateUser, coupon_controller_1.couponController.deleteCouponCouponById);
const couponRoute = router;
exports.default = couponRoute;
