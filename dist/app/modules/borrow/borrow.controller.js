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
exports.borrowController = void 0;
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const borrow_service_1 = require("./borrow.service");
const createBorrow = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const result = yield borrow_service_1.borrowService.createBorrow(body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Book borrowed successfully",
        data: Object.assign(Object.assign({}, result), { returnDate: undefined }),
    });
}));
const borrowOverDueList = (0, catchAsyncError_1.catchAsyncError)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield borrow_service_1.borrowService.borrowOverDueList();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: result ? "Overdue borrow list fetched" : "No overdue books",
        data: result || [],
    });
}));
exports.borrowController = { createBorrow, borrowOverDueList };
