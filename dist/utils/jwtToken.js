"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenExpired = exports.createRefreshToken = exports.createAcessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createAcessToken = (user, expires) => {
    console.log(process.env.JWT_REFRESH_SECRET);
    return jsonwebtoken_1.default.sign({ user }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: expires,
    });
};
exports.createAcessToken = createAcessToken;
const createRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ user }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30 days",
    });
};
exports.createRefreshToken = createRefreshToken;
const isTokenExpired = (token) => {
    if (!token) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodedToken = jsonwebtoken_1.default.decode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
};
exports.isTokenExpired = isTokenExpired;
