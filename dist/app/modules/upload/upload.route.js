"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloudinaryMulter_config_1 = require("../../config/cloudinaryMulter.config");
const authMiddleWere_1 = __importDefault(require("../../middlewares/authMiddleWere"));
const upload_controller_1 = __importDefault(require("./upload.controller"));
const router = (0, express_1.Router)();
router.post("/single", authMiddleWere_1.default.isAuthenticateUser, cloudinaryMulter_config_1.multerUpload.single("file"), upload_controller_1.default.uploadSingleFile);
router.post("/multiple", authMiddleWere_1.default.isAuthenticateUser, cloudinaryMulter_config_1.multerUpload.array("images"), upload_controller_1.default.uploadMutilpleFile);
const uploadRoute = router;
exports.default = uploadRoute;
