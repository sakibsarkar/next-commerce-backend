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
exports.bookService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createBook = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.create({
        data: payload,
    });
    return result;
});
const getBooks = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findMany();
    return result;
});
const getBookByBookId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findUnique({
        where: {
            bookId: id,
        },
    });
    return result;
});
const updateBookById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.book.findUnique({
        where: {
            bookId: id,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(404, `Book with id '${id}' not found`);
    }
    const result = yield prisma_1.default.book.update({
        where: {
            bookId: id,
        },
        data: payload,
    });
    return result;
});
const deleteBookById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.book.findUnique({
        where: {
            bookId: id,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(404, `Book with id '${id}' not found`);
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.borrow.deleteMany({
            where: {
                bookId: id,
            },
        });
        const res = yield tx.book.delete({
            where: {
                bookId: id,
            },
        });
        return res;
    }));
    return result;
});
exports.bookService = {
    createBook,
    getBooks,
    getBookByBookId,
    updateBookById,
    deleteBookById,
};
