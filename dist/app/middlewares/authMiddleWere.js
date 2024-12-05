"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const jwtToken_1 = require("../../utils/jwtToken");
const config_1 = __importDefault(require("../config"));
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const auth_utils_1 = __importDefault(require("../modules/auth/auth.utils"));
const isAuthenticateUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.cookies = req.cookies || {};
    const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!accessToken) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    if (!accessToken || (0, jwtToken_1.isTokenExpired)(accessToken)) {
        const refreshToken = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.refreshToken;
        if (!refreshToken) {
            throw new AppError_1.default(401, "Refresh token is missing");
        }
        const decryptedJwt = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const result = yield prisma_1.default.user.findUnique({
            where: {
                id: decryptedJwt.id,
            },
        });
        const newAccessToken = auth_utils_1.default.generateAccessToken({
            id: (result === null || result === void 0 ? void 0 : result.id) || "",
            email: (result === null || result === void 0 ? void 0 : result.email) || "",
            role: (result === null || result === void 0 ? void 0 : result.role) || "",
        });
        const newRefreshToken = auth_utils_1.default.generateRefreshToken(((_c = decryptedJwt === null || decryptedJwt === void 0 ? void 0 : decryptedJwt.id) === null || _c === void 0 ? void 0 : _c.toString()) || "");
        res
            .cookie("accessToken", newAccessToken, {
            sameSite: "none",
            maxAge: 1000 * 24 * 60 * 60 * 30,
            httpOnly: true,
            secure: config_1.default.NODE_ENV === "production" ? true : false,
        })
            .cookie("refreshToken", newRefreshToken, {
            sameSite: "none",
            maxAge: 1000 * 24 * 60 * 60 * 30,
            httpOnly: true,
            secure: config_1.default.NODE_ENV === "production" ? true : false,
        });
        const isExistUsr = yield prisma_1.default.user.findUnique({
            where: {
                id: decryptedJwt.id,
            },
        });
        if (!isExistUsr) {
            throw new AppError_1.default(401, "Unauthorized");
        }
        const pay = {
            id: isExistUsr.id,
            email: isExistUsr.email,
            role: isExistUsr.role,
        };
        req.user = pay;
    }
    if (accessToken && !(0, jwtToken_1.isTokenExpired)(accessToken)) {
        const payload = auth_utils_1.default.verifyAccessToken(accessToken);
        if (!payload) {
            throw new AppError_1.default(401, "Unauthorized");
        }
        const { id } = payload;
        const isExistUsr = yield prisma_1.default.user.findUnique({
            where: {
                id,
            },
        });
        if (!isExistUsr) {
            throw new AppError_1.default(401, "Unauthorized");
        }
        const pay = {
            id: isExistUsr.id,
            email: isExistUsr.email,
            role: isExistUsr.role,
        };
        req.user = pay;
    }
    next();
}));
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
            return next(new AppError_1.default(403, `User type: ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} is not allowed to access this resouce `));
        }
        next();
    };
};
const authMiddleWere = {
    isAuthenticateUser,
    authorizeRoles,
};
exports.default = authMiddleWere;
