"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const generateAccessToken = (payload) => {
    const { EXPIRY, SECRET = "" } = config_1.default.ACCESS_TOKEN;
    const token = jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: EXPIRY });
    return token;
};
const generateRefreshToken = (id) => {
    const { EXPIRY, SECRET = "" } = config_1.default.REFRESH_TOKEN;
    const token = jsonwebtoken_1.default.sign({ id: id }, SECRET, { expiresIn: EXPIRY });
    return token;
};
const verifyAccessToken = (token) => {
    const { SECRET = "" } = config_1.default.ACCESS_TOKEN;
    const payload = jsonwebtoken_1.default.verify(token, SECRET);
    return payload;
};
const hashPassword = (password) => {
    const hash = bcrypt_1.default.hash(password, 10);
    return hash;
};
const authUtils = {
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    verifyAccessToken,
};
exports.default = authUtils;
