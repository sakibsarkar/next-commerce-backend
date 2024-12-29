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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const validCouponByCouponCodeByProductIds = (couponCode, productIds) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findFirst({
        where: {
            code: couponCode,
            productId: {
                in: productIds,
            },
        },
    });
    return coupon;
});
const getCouponList = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(query)
        .search(["code", "id"])
        .paginate()
        .sort();
    const queryResult = queryBuilder.getPrismaQuery();
    const metaQuery = queryBuilder.getMetaQuery();
    const result = yield prisma_1.default.coupon.findMany(Object.assign(Object.assign({}, queryResult), { include: {
            productInfo: {
                include: {
                    shopInfo: {
                        select: {
                            name: true,
                            logo: true,
                        },
                    },
                },
            },
        } }));
    const totalCount = yield prisma_1.default.coupon.count({
        where: queryResult.where || {},
    });
    return { result, totalCount, metaQuery };
});
const getVendorCouponList = (query, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUnique({
        where: { ownerId: vendorId },
    });
    if (!shop) {
        throw new AppError_1.default(404, "Shop not found");
    }
    const queryBuilder = new QueryBuilder_1.default(query)
        .search(["code", "id"])
        .paginate()
        .sort();
    const queryResult = queryBuilder.getPrismaQuery({
        shopId: shop.id,
    });
    const metaQuery = queryBuilder.getMetaQuery();
    const result = yield prisma_1.default.coupon.findMany(Object.assign(Object.assign({}, queryResult), { include: {
            productInfo: true,
        } }));
    const totalCount = yield prisma_1.default.coupon.count({
        where: queryResult.where || {},
    });
    return { result, totalCount, metaQuery };
});
const deleteCouponCouponById = (couponId, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findUnique({
        where: {
            id: couponId,
        },
        include: {
            productInfo: {
                include: {
                    shopInfo: {
                        select: {
                            ownerId: true,
                        },
                    },
                },
            },
        },
    });
    if (!coupon) {
        throw new AppError_1.default(404, "Coupon not found");
    }
    if (userRole !== "ADMIN" && userId !== coupon.productInfo.shopInfo.ownerId) {
        throw new AppError_1.default(403, "You are not authorized to delete this coupon");
    }
    const result = yield prisma_1.default.coupon.delete({
        where: {
            id: couponId,
        },
    });
    return result;
});
const createCoupon = (coupon, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUnique({
        where: { ownerId: userId },
    });
    if (!shop) {
        throw new AppError_1.default(404, "Shop not found");
    }
    const isProductExits = yield prisma_1.default.product.findUnique({
        where: {
            id: coupon.productId,
        },
    });
    if (!isProductExits) {
        throw new AppError_1.default(404, "Product not found");
    }
    const result = yield prisma_1.default.coupon.create({
        data: Object.assign(Object.assign({}, coupon), { shopId: shop.id }),
    });
    return result;
});
const couponService = {
    validCouponByCouponCodeByProductIds,
    getCouponList,
    getVendorCouponList,
    deleteCouponCouponById,
    createCoupon,
};
exports.default = couponService;
