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
exports.boockController = void 0;
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const book_service_1 = require("./book.service");
const createBook = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const result = yield book_service_1.bookService.createBook(body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Book created successfully",
        data: result,
    });
}));
const getBooks = (0, catchAsyncError_1.catchAsyncError)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.bookService.getBooks();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Books retrieved successfully",
        data: result,
    });
}));
const getBookByBookId = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const result = yield book_service_1.bookService.getBookByBookId(bookId);
    (0, sendResponse_1.default)(res, {
        success: Boolean(result),
        statusCode: result ? 200 : 404,
        message: result
            ? "Book retrieved successfully"
            : `Book with id '${bookId}' not found`,
        data: result || undefined,
    });
}));
const updateBookById = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const { body } = req;
    const result = yield book_service_1.bookService.updateBookById(bookId, body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Book updated successfully",
        data: result,
    });
}));
const deleteBookById = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    yield book_service_1.bookService.deleteBookById(bookId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Book successfully deleted",
        data: undefined,
    });
}));
exports.boockController = {
    createBook,
    getBooks,
    getBookByBookId,
    updateBookById,
    deleteBookById,
};
