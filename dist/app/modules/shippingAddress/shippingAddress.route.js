"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWere_1 = __importDefault(require("../../middlewares/authMiddleWere"));
const validator_1 = require("../../middlewares/validator");
const shippingAddress_controller_1 = __importDefault(require("./shippingAddress.controller"));
const shippingAddress_validation_1 = __importDefault(require("./shippingAddress.validation"));
const router = (0, express_1.Router)();
router.post("/create", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("CUSTOMER"), (0, validator_1.validSchema)(shippingAddress_validation_1.default.create), shippingAddress_controller_1.default.createShippingAddress);
router.get("/get", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("CUSTOMER"), shippingAddress_controller_1.default.getShippingAddressByUser);
const shippingAddressRoute = router;
exports.default = shippingAddressRoute;
