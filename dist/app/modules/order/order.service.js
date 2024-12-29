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
const prisma_1 = __importDefault(require("../../config/prisma"));
const stripe_1 = __importDefault(require("../../config/stripe"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const order_utils_1 = require("./order.utils");
const createOrder = (orderItems, userId, paymentIntentId, shippingAddressId, couponCode) => __awaiter(void 0, void 0, void 0, function* () {
    if (!paymentIntentId) {
        throw new AppError_1.default(400, "Payment method id is required");
    }
    let totalAmount = 0;
    const tnxId = order_utils_1.OrderUtils.generateTransactionId();
    const productPriceHash = {}; // { productId: {discout:number, price:number} }
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        for (const item of orderItems) {
            const product = yield tx.product.findUnique({
                where: { id: item.productId },
                include: { colors: { include: { sizes: true } } },
            });
            if (!product)
                throw new AppError_1.default(404, "Product not found");
            productPriceHash[product.id] = {
                discount: product.discount,
                price: product.price,
            };
            const color = product.colors.find((color) => color.id === item.colorId);
            if (!color)
                throw new AppError_1.default(404, "Color not found");
            const size = color.sizes.find((size) => size.id === item.sizeId);
            if (!size)
                throw new AppError_1.default(404, "Size not found");
            if (size.quantity < item.quantity) {
                throw new AppError_1.default(400, `Insufficient quantity for size:${size.size} of color:${color.color} of product ${product.name}. Only ${size.quantity} available but requested ${item.quantity}`);
            }
            const grandPrice = product.discount
                ? order_utils_1.OrderUtils.getDiscountPrice(product.price, product.discount)
                : product.price;
            yield tx.order.create({
                data: {
                    userId,
                    shopId: product.shopId,
                    productId: product.id,
                    color: color.color,
                    size: size.size,
                    shippingId: shippingAddressId,
                    quantity: item.quantity,
                    total: Math.round(grandPrice),
                },
            });
            yield tx.size.update({
                where: { id: size.id },
                data: { quantity: size.quantity - item.quantity },
            });
            totalAmount += grandPrice * item.quantity;
        }
        const paymentIntent = yield stripe_1.default.paymentIntents.retrieve(paymentIntentId);
        const paymentStatus = paymentIntent.status === "succeeded" ? "SUCCESS" : "FAILED";
        const paymentAmount = paymentIntent.amount / 100;
        yield tx.payment.create({
            data: {
                userId,
                transactionId: tnxId,
                status: paymentStatus,
                amount: Math.round(totalAmount * 100),
            },
        });
        if (couponCode) {
            const productIds = orderItems.map((item) => item.productId);
            const coupon = yield tx.coupon.findFirst({
                where: { code: couponCode, productId: { in: productIds } },
            });
            if (coupon) {
                const couponAppliedProduct = productPriceHash[coupon.productId];
                const product = orderItems.find((item) => item.productId === coupon.productId);
                if (couponAppliedProduct && product) {
                    const productDiscountPrice = order_utils_1.OrderUtils.getDiscountPrice(couponAppliedProduct.price, couponAppliedProduct.discount || 0);
                    // calculate te discount price for the product with quantity
                    const discountPrice = productDiscountPrice * product.quantity * (coupon.discount / 100);
                    totalAmount -= discountPrice;
                }
            }
        }
        if (paymentStatus !== "SUCCESS") {
            throw new AppError_1.default(400, "Payment failed");
        }
        if (Math.abs(paymentAmount - totalAmount) > 10) {
            // 10 is the tolerance
            throw new AppError_1.default(400, `Payment amount does not match total amount totalAmount:${totalAmount} paymentAmount:${paymentAmount}`);
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
            shippingInfo: true,
            shopInfo: {
                select: {
                    name: true,
                    logo: true,
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
            shippingInfo: true,
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
const moveOrderForShipment = (orderId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma_1.default.order.findUnique({
        where: { id: orderId },
        include: { shopInfo: true },
    });
    if (!order) {
        throw new AppError_1.default(404, "Order not found");
    }
    if (order.shopInfo.ownerId !== userId) {
        throw new AppError_1.default(403, "You are not authorized to move this Order");
    }
    const result = yield prisma_1.default.order.update({
        where: { id: orderId },
        data: { status: "ON_SHIPMENT" },
    });
    return result;
});
const orderService = {
    createOrder,
    getUserOrders,
    getVendorOders,
    moveOrderForShipment,
};
exports.default = orderService;
