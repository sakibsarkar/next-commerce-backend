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
exports.couponController = void 0;
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const coupon_service_1 = __importDefault(require("./coupon.service"));
const createCoupon = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const user = req.user;
    const result = yield coupon_service_1.default.createCoupon(body, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Coupon created successfully",
        data: result,
    });
}));
const validCouponByCouponCodeByProductIds = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { couponCode, productIds } = req.body;
    const result = yield coupon_service_1.default.validCouponByCouponCodeByProductIds(couponCode, productIds);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Coupon fetched successfully",
        data: result,
    });
}));
const getCouponList = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, metaQuery, totalCount } = yield coupon_service_1.default.getCouponList(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Coupon fetched successfully",
        data: result,
        meta: Object.assign({ totalDoc: totalCount }, metaQuery),
    });
}));
const getVendorCouponList = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = req.query;
    const { metaQuery, result, totalCount } = yield coupon_service_1.default.getVendorCouponList(query, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Coupon fetched successfully",
        data: result,
        meta: Object.assign({ totalDoc: totalCount }, metaQuery),
    });
}));
const deleteCouponCouponById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { couponId } = req.params;
    const result = yield coupon_service_1.default.deleteCouponCouponById(couponId, user.id, user.role);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Coupon deleted successfully",
        data: result,
    });
}));
exports.couponController = {
    validCouponByCouponCodeByProductIds,
    getCouponList,
    getVendorCouponList,
    deleteCouponCouponById,
    createCoupon,
};
