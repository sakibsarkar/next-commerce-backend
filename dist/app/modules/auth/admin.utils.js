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
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const auth_utils_1 = __importDefault(require("./auth.utils"));
const adminSeed = () => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma_1.default.user.findFirst({
        where: {
            role: "ADMIN",
        },
    });
    if (admin) {
        return;
    }
    const password = yield auth_utils_1.default.hashPassword(config_1.default.ADMIN_DEFAUL_PASS);
    yield prisma_1.default.user.create({
        data: {
            email: "admin@gmail.com",
            first_name: "admin",
            last_name: "admin",
            role: "ADMIN",
            password: password,
            isSuspended: false,
        },
    });
});
const adminUtils = {
    adminSeed,
};
exports.default = adminUtils;
