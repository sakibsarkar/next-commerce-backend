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
exports.borrowService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createBorrow = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookExist = yield prisma_1.default.book.findUnique({
        where: {
            bookId: payload.bookId,
        },
    });
    if (!isBookExist) {
        throw new AppError_1.default(404, `Book with id '${payload.bookId}' not found`);
    }
    const isMemberExist = yield prisma_1.default.member.findUnique({
        where: {
            memberId: payload.memberId,
        },
    });
    if (!isMemberExist) {
        throw new AppError_1.default(404, `Member with id '${payload.memberId}' not found`);
    }
    const isAlreadyBorrowed = yield prisma_1.default.borrow.findFirst({
        where: {
            bookId: payload.bookId,
            memberId: payload.memberId,
            returnDate: null,
        },
    });
    if (isAlreadyBorrowed) {
        throw new AppError_1.default(400, `Book with id '${payload.bookId}' is already borrowed by member with id '${payload.memberId}' and not returned yet`);
    }
    const result = yield prisma_1.default.borrow.create({
        data: {
            borrowDate: new Date(),
            bookId: payload.bookId,
            memberId: payload.memberId,
        },
    });
    return result;
});
const borrowOverDueList = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const overdueBorrowDate = today.setDate(today.getDate() - 14);
    const overdueBorrows = yield prisma_1.default.borrow.findMany({
        where: {
            AND: [
                { returnDate: null },
                {
                    borrowDate: {
                        lt: new Date(overdueBorrowDate),
                    },
                },
            ],
        },
        include: {
            book: {
                select: { title: true },
            },
            member: {
                select: { name: true },
            },
        },
    });
    if (overdueBorrows.length === 0) {
        return null;
    }
    const result = overdueBorrows.map((borrow) => {
        const dueDate = new Date(borrow.borrowDate);
        dueDate.setDate(dueDate.getDate() + 14);
        const today = new Date();
        const overdueDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        return {
            borrowId: borrow.borrowId,
            bookTitle: borrow.book.title,
            borrowerName: borrow.member.name,
            overdueDays,
        };
    });
    return result;
});
exports.borrowService = { createBorrow, borrowOverDueList };
