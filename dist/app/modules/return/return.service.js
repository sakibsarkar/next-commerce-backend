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
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const returnBook = (borrowId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.borrow.findUnique({
        where: {
            borrowId,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(404, `No borrow record found with borrow id '${borrowId}'`);
    }
    const result = yield prisma_1.default.borrow.update({
        where: {
            borrowId: borrowId,
        },
        data: {
            returnDate: new Date(),
        },
    });
    return result;
});
const returnService = {
    returnBook,
};
exports.default = returnService;
