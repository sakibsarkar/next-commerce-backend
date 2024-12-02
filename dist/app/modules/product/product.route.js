"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWere_1 = __importDefault(require("../../middlewares/authMiddleWere"));
const validator_1 = require("../../middlewares/validator");
const product_controller_1 = require("./product.controller");
const product_validation_1 = __importDefault(require("./product.validation"));
const router = (0, express_1.Router)();
router.post("/create", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), (0, validator_1.validSchema)(product_validation_1.default.create), product_controller_1.productController.createProduct);
router.patch("/update/:productId", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), (0, validator_1.validSchema)(product_validation_1.default.update), product_controller_1.productController.updateProduct);
router.delete("/remove/color/:colorId", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), product_controller_1.productController.removeColor);
router.delete("/remove/size/:sizeId", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), product_controller_1.productController.removeSize);
router.delete("/delete/:productId", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), product_controller_1.productController.deleteProductById);
router.get("/get", product_controller_1.productController.getProducts);
router.get("/get/:id", product_controller_1.productController.getProductDetailsById);
router.get("/get-related/:categoryId", product_controller_1.productController.getRelatedProductsByCategoryId);
router.get("/shop-follow", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("CUSTOMER"), product_controller_1.productController.getFollowedShopProducts);
const productRoute = router;
exports.default = productRoute;
