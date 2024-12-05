"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const _1 = __importDefault(require("."));
cloudinary_1.v2.config({
    cloud_name: _1.default.CN_CLOUD_NAME,
    api_key: _1.default.CN_API_KEY,
    api_secret: _1.default.CN_API_SECRET,
});
exports.default = cloudinary_1.v2;
