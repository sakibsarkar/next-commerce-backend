"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET, PASSWORD_RECOVERY_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_SECRET, NODE_ENV, SALT_ROUND, FRONTEND_URL, STRIPE_SK, CN_CLOUD_NAME, CN_API_KEY, CN_API_SECRET, ADMIN_DEFAUL_PASS, } = process.env;
const Config = {
    bcrypt_salt_rounds: SALT_ROUND,
    NODE_ENV: NODE_ENV,
    jwt_access_secret: JWT_ACCESS_SECRET,
    jwt_refresh_secret: JWT_REFRESH_SECRET,
    FRONTEND_URL,
    REFRESH_TOKEN: {
        SECRET: REFRESH_TOKEN_SECRET,
        EXPIRY: "7d",
    },
    ACCESS_TOKEN: {
        SECRET: ACCESS_TOKEN_SECRET,
        EXPIRY: "1h",
    },
    RECOVERY_TOKEN: {
        SECRET: PASSWORD_RECOVERY_SECRET,
        EXPIRY: "5m",
    },
    STRIPE_SECRET_KEY: STRIPE_SK,
    CN_CLOUD_NAME: CN_CLOUD_NAME,
    CN_API_KEY: CN_API_KEY,
    CN_API_SECRET: CN_API_SECRET,
    ADMIN_DEFAUL_PASS,
};
exports.default = Config;
