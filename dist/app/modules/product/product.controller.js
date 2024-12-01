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
exports.productController = void 0;
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_service_1 = __importDefault(require("./product.service"));
const createProduct = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body || {};
    const product = yield product_service_1.default.createProduct(body, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Product created successfully",
        data: product,
    });
}));
const updateProduct = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body || {};
    const { productId } = req.params;
    const product = yield product_service_1.default.updateProduct(body, productId, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Product updated successfully",
        data: product,
    });
}));
const removeSize = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const sizeId = req.params.sizeId;
    const product = yield product_service_1.default.removeSize(sizeId, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Size deleted successfully",
        data: product,
    });
}));
const removeColor = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const colorId = req.params.colorId;
    const product = yield product_service_1.default.removeColor(colorId, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Color deleted successfully",
        data: product,
    });
}));
const deleteProductById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { productId } = req.params;
    const product = yield product_service_1.default.deleteProductById(productId, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Product deleted successfully",
        data: product,
    });
}));
const getProducts = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { metaQuery, products, totalCount } = yield product_service_1.default.getAllProducts(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Products retrieved successfully",
        data: products,
        meta: Object.assign(Object.assign({}, metaQuery), { totalDoc: totalCount }),
    });
}));
const getProductDetailsById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_service_1.default.getProductDetailsById(id);
    if (!product) {
        throw new AppError_1.default(404, "Product not found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Product retrieved successfully",
        data: product,
    });
}));
exports.productController = {
    createProduct,
    updateProduct,
    getProducts,
    getProductDetailsById,
    removeColor,
    removeSize, deleteProductById
};
