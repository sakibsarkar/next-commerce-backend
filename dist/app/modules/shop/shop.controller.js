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
const shop_service_1 = __importDefault(require("./shop.service"));
const createShop = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const user = req.user;
    const shop = yield shop_service_1.default.createShop(body, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Shop created successfully",
        data: shop,
    });
}));
const updateShop = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const user = req.user;
    const shop = yield shop_service_1.default.updateShop(user.id, body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop updated successfully",
        data: shop,
    });
}));
const getShopByUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const shop = yield shop_service_1.default.getShopByUser(user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop retrieved successfully",
        data: shop,
    });
}));
const toggleFollowAShop = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { shopId } = req.params;
    const shop = yield shop_service_1.default.toggleFollowAShop(shopId, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop followed successfully",
        data: shop,
    });
}));
const isShopFollowedByUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { shopId } = req.params;
    const shop = yield shop_service_1.default.isShopFollowedByUser(shopId, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop folow status updated successfully",
        data: {
            isFollowing: Boolean(shop),
        },
    });
}));
const getShopFollowerCount = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { shopId } = req.params;
    const followerCount = yield shop_service_1.default.getShopFollowerCount(shopId, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop follower count retrieved successfully",
        data: followerCount,
    });
}));
const getSopInformationByShopId = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = req.params;
    const user = req.user;
    const shop = yield shop_service_1.default.getSopInformationByShopId(shopId, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop information retrieved successfully",
        data: shop,
    });
}));
const getAllShopsController = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const { metaQuery, result, totalCount } = yield shop_service_1.default.getAllShops(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shops retrieved successfully",
        data: result,
        meta: Object.assign({ totalDoc: totalCount }, metaQuery),
    });
}));
const shopController = {
    createShop,
    getShopByUser,
    updateShop,
    toggleFollowAShop,
    isShopFollowedByUser,
    getShopFollowerCount,
    getSopInformationByShopId,
    getAllShopsController,
};
exports.default = shopController;
