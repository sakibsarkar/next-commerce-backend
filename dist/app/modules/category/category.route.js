"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWere_1 = __importDefault(require("../../middlewares/authMiddleWere"));
const category_controller_1 = __importDefault(require("./category.controller"));
const router = (0, express_1.Router)();
router.post("/create", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("ADMIN"), category_controller_1.default.createCategory);
router.get("/get", category_controller_1.default.getAllCategories);
const categoryRoute = router;
exports.default = categoryRoute;
