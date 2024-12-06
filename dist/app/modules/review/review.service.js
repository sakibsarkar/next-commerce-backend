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
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createReview = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isOrderExist = yield prisma_1.default.order.findUnique({
        where: {
            id: payload.orderId,
        },
    });
    if (!isOrderExist) {
        throw new AppError_1.default(404, "Order not found");
    }
    const isReviewExist = yield prisma_1.default.review.findFirst({
        where: {
            orderId: payload.orderId,
            userId: userId,
        },
    });
    if (isReviewExist) {
        throw new AppError_1.default(400, "Review already exists for this order");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const review = yield tx.review.create({
            data: {
                image: payload.image,
                description: payload.description,
                rating: payload.rating,
                orderId: payload.orderId,
                userId: userId,
                productId: isOrderExist.productId,
            },
        });
        yield tx.order.update({
            where: {
                id: payload.orderId,
            },
            data: {
                hasReviewGiven: true,
            },
        });
        return review;
    }));
    const avgRating = yield prisma_1.default.review.aggregate({
        where: { productId: isOrderExist.productId },
        _avg: {
            rating: true,
        },
    });
    yield prisma_1.default.product.update({
        where: {
            id: isOrderExist.productId,
        },
        data: {
            avgRating: avgRating._avg.rating || 0,
        },
    });
    return result;
});
const getAllReviewByProductId = (productId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExist = yield prisma_1.default.product.findUnique({
        where: {
            id: productId,
        },
    });
    if (!isProductExist) {
        throw new AppError_1.default(404, "Product not found");
    }
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const reviews = yield prisma_1.default.review.findMany({
        where: {
            productId: productId,
        },
        skip,
        take: limit,
        include: {
            userInfo: true,
            reviewResponse: {
                include: {
                    shopInfo: true,
                },
            },
        },
    });
    const totalCount = yield prisma_1.default.review.count({
        where: {
            productId: productId,
        },
    });
    const metaQuery = {
        currentPage: page,
        limit: limit,
        totalCount: totalCount,
    };
    return {
        reviews,
        totalCount,
        metaQuery,
    };
});
const getReplyByReviewId = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const reply = yield prisma_1.default.reviewResponse.findMany({
        where: {
            reviewId: reviewId,
        },
        include: {
            shopInfo: true,
        },
    });
    return reply;
});
const createReply = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUnique({
        where: {
            ownerId: userId,
        },
    });
    if (!shop) {
        throw new AppError_1.default(404, "Shop not found");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const isReviewExist = yield tx.review.findUnique({
            where: {
                id: payload.reviewId,
            },
        });
        if (!isReviewExist) {
            throw new AppError_1.default(404, "Review not found");
        }
        const reply = yield tx.reviewResponse.create({
            data: {
                reviewId: payload.reviewId,
                description: payload.description,
                shopId: shop.id,
            },
        });
        yield tx.review.update({
            where: {
                id: payload.reviewId,
            },
            data: {
                hasReply: true,
            },
        });
        return reply;
    }));
    return result;
});
const getUsersShopReviews = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const shop = yield prisma_1.default.shop.findUnique({
        where: {
            ownerId: userId,
        },
        select: {
            id: true,
        },
    });
    if (!shop) {
        throw new AppError_1.default(404, "Shop not found");
    }
    const reviews = yield prisma_1.default.review.findMany({
        where: {
            productInfo: {
                shopId: shop === null || shop === void 0 ? void 0 : shop.id,
            },
        },
        include: {
            userInfo: true,
            reviewResponse: true,
            productInfo: {
                select: {
                    id: true,
                    name: true,
                    images: true,
                },
            },
        },
        skip,
        take,
        orderBy: {
            createdAt: "desc",
        },
    });
    const totalReviews = yield prisma_1.default.review.count({
        where: {
            productInfo: {
                shopId: shop.id,
            },
        },
    });
    return {
        reviews,
        meta: {
            currentPage: page,
            limit,
            totalDoc: totalReviews,
        },
    };
});
const reviewService = {
    createReview,
    getAllReviewByProductId,
    getReplyByReviewId,
    createReply,
    getUsersShopReviews,
};
exports.default = reviewService;
