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
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const category_service_1 = __importDefault(require("./category.service"));
const createCategory = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    if (!body.label) {
        throw new Error("Category label is required");
    }
    const category = yield category_service_1.default.createCategory(body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Category created successfully",
        data: category,
    });
}));
const getAllCategories = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const { result, totalCount, metaQuery } = yield category_service_1.default.getAllCategories(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Category fetched successfully",
        meta: Object.assign({ totalDoc: totalCount }, metaQuery),
        data: result,
    });
}));
const updateCategory = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const { categoryId } = req.params;
    const result = yield category_service_1.default.updateCategory(payload, categoryId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Category updated successfully",
        data: result,
    });
}));
const categoryController = { createCategory, getAllCategories, updateCategory };
exports.default = categoryController;
