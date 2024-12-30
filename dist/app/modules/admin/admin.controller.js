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
const admin_service_1 = __importDefault(require("./admin.service"));
const toggleUserSuspension = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield admin_service_1.default.toggleUserSuspension(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User suspension toggled successfully",
        data: result,
    });
}));
const deleteUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield admin_service_1.default.deleteUser(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User deleted successfully",
        data: result,
    });
}));
const toggleShopBlackListStatus = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = req.params;
    const result = yield admin_service_1.default.toggleShopBlackListStatus(shopId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop blacklisted successfully",
        data: result,
    });
}));
const getTransactionHistory = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const { metaQuery, result, totalCount } = yield admin_service_1.default.getTransactionHistory(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Transaction history retrieved successfully",
        data: result,
        meta: Object.assign({ totalDoc: totalCount }, metaQuery),
    });
}));
const getSystemOverview = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.default.getSystemOverview();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "System overview retrieved successfully",
        data: result,
    });
}));
const getVendorAndUserData = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.default.getVendorAndUserData();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Vendor and user data retrieved successfully",
        data: result,
    });
}));
const getMonthlyTransactionOfCurrentYear = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.default.getMonthlyTransactionOfCurrentYear();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Monthly transaction retrieved successfully",
        data: result,
    });
}));
const getAllUserList = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const { metaQuery, result, totalCount } = yield admin_service_1.default.getAllUserList(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User list retrieved successfully",
        data: result,
        meta: Object.assign({ totalDoc: totalCount }, metaQuery),
    });
}));
const getAllShopList = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const { metaQuery, result, totalCount } = yield admin_service_1.default.getAllShopList(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop list retrieved successfully",
        data: result,
        meta: Object.assign({ totalDoc: totalCount }, metaQuery),
    });
}));
const adminController = {
    toggleUserSuspension,
    deleteUser,
    toggleShopBlackListStatus,
    getTransactionHistory,
    getSystemOverview,
    getMonthlyTransactionOfCurrentYear,
    getAllUserList,
    getAllShopList,
    getVendorAndUserData,
};
exports.default = adminController;
