"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWere_1 = __importDefault(require("../../middlewares/authMiddleWere"));
const newsLatter_controller_1 = __importDefault(require("./newsLatter.controller"));
const router = (0, express_1.Router)();
router.post("/create", newsLatter_controller_1.default.createNewsLatter);
router.get("/get", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("ADMIN"), newsLatter_controller_1.default.getNewsLatters);
const newsLatterRoute = router;
exports.default = newsLatterRoute;
