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
const order_service_1 = __importDefault(require("./order.service"));
const createOrder = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { paymentMethodId, orderItems, shippingAddressId } = req.body;
    const transactionId = yield order_service_1.default.createOrder(orderItems, user.id, paymentMethodId, shippingAddressId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Order created successfully",
        data: {
            transactionId,
        },
    });
}));
const getUserOrders = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { metaQuery, orders, totalCount } = yield order_service_1.default.getUserOrders(user.id, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        data: orders,
        message: "Orders retrieved successfully",
        meta: Object.assign(Object.assign({}, metaQuery), { totalDoc: totalCount }),
    });
}));
const getVendorOrders = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { metaQuery, orders, totalCount } = yield order_service_1.default.getVendorOders(user.id, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        data: orders,
        message: "Orders retrieved successfully",
        meta: Object.assign(Object.assign({}, metaQuery), { totalDoc: totalCount }),
    });
}));
const orderController = {
    createOrder,
    getUserOrders,
    getVendorOrders,
};
exports.default = orderController;
