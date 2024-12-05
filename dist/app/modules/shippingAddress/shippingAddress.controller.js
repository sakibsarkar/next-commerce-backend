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
const shippingAddress_service_1 = __importDefault(require("./shippingAddress.service"));
const createShippingAddress = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { body } = req;
    const shippingAddress = yield shippingAddress_service_1.default.createShippingAddress(body, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Shipping address created successfully",
        data: shippingAddress,
    });
}));
const getShippingAddressByUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const shippingAddress = yield shippingAddress_service_1.default.getShippingAddressByUser(user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shipping address fetched successfully",
        data: shippingAddress,
    });
}));
const shippingAddressController = {
    createShippingAddress,
    getShippingAddressByUser,
};
exports.default = shippingAddressController;
