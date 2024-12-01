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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const stripe_1 = __importDefault(require("../../config/stripe"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const order_utils_1 = require("./order.utils");
const createOrder = (payload, userId, paymentMethodId, shippingAddressId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!paymentMethodId) {
        throw new AppError_1.default(400, "Payment method id is required");
    }
    let totalAmount = 0;
    const tnxId = order_utils_1.OrderUtils.generateTransactionId();
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        for (const item of payload) {
            const product = yield tx.product.findUnique({
                where: { id: item.productId },
                include: { colors: { include: { sizes: true } } },
            });
            if (!product)
                throw new AppError_1.default(404, "Product not found");
            const color = product.colors.find((color) => color.id === item.colorId);
            if (!color)
                throw new AppError_1.default(404, "Color not found");
            const size = color.sizes.find((size) => size.id === item.sizeId);
            if (!size)
                throw new AppError_1.default(404, "Size not found");
            if (size.quantity < item.quantity) {
                throw new AppError_1.default(400, `Insufficient quantity for size:${size.size} of color:${color.color} of product ${product.name}`);
            }
            yield tx.order.create({
                data: {
                    userId,
                    shopId: product.shopId,
                    productId: product.id,
                    color: color.color,
                    size: size.size,
                    shippindId: shippingAddressId,
                    quantity: item.quantity,
                },
            });
            yield tx.size.update({
                where: { id: size.id },
                data: { quantity: size.quantity - item.quantity },
            });
            totalAmount += product.price * item.quantity;
        }
        const paymentIntent = yield stripe_1.default.paymentIntents.create({
            amount: Math.round(totalAmount * 100),
            currency: "usd",
            // payment_method: paymentMethodId,
            return_url: config_1.default.FRONTEND_URL || "http://localhost:3000",
            confirm: true,
        });
        const paymentStatus = paymentIntent.status === "succeeded" ? "SUCCESS" : "FAILED";
        yield tx.payment.create({
            data: {
                userId,
                transactionId: tnxId,
                status: paymentStatus,
                amount: Math.round(totalAmount * 100),
            },
        });
        if (paymentStatus !== "SUCCESS") {
            throw new AppError_1.default(400, "Payment failed");
        }
    }));
    return tnxId;
});
const getUserOrders = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(query).paginate().sort();
    const queryResult = queryBuilder.getPrismaQuery();
    const metaQuery = queryBuilder.getMetaQuery();
    const totalCount = yield prisma_1.default.order.count({
        where: { userId },
    });
    const orders = yield prisma_1.default.order.findMany(Object.assign(Object.assign({}, queryResult), { include: {
            productInfo: {
                select: {
                    id: true,
                    price: true,
                    name: true,
                    images: true,
                },
            },
        } }));
    return {
        orders,
        totalCount,
        metaQuery,
    };
});
const getVendorOders = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUnique({
        where: { ownerId: userId },
    });
    if (!shop) {
        throw new AppError_1.default(404, "Shop not found");
    }
    const queryBuilder = new QueryBuilder_1.default(query).paginate().sort().filter();
    const queryResult = queryBuilder.getPrismaQuery({
        shopId: shop.id,
    });
    const metaQuery = queryBuilder.getMetaQuery();
    const totalCount = yield prisma_1.default.order.count({
        where: queryResult.where || {},
    });
    const orders = yield prisma_1.default.order.findMany(Object.assign(Object.assign({}, queryResult), { include: {
            userInfo: true,
            shopInfo: true,
            productInfo: {
                select: {
                    id: true,
                    price: true,
                    name: true,
                    images: true,
                },
            },
        } }));
    return {
        orders,
        totalCount,
        metaQuery,
    };
});
const orderService = {
    createOrder,
    getUserOrders,
    getVendorOders,
};
exports.default = orderService;
