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
const createShop = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistShop = yield prisma_1.default.shop.findUnique({
        where: {
            ownerId: userId,
        },
    });
    if (isExistShop) {
        throw new AppError_1.default(400, "Shop already exists");
    }
    const shop = yield prisma_1.default.shop.create({
        data: Object.assign(Object.assign({}, payload), { ownerId: userId }),
    });
    return shop;
});
const updateShop = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUnique({
        where: {
            ownerId: userId,
        },
    });
    if (!shop) {
        throw new AppError_1.default(404, "Shop not found");
    }
    const updatedShop = yield prisma_1.default.shop.update({
        where: {
            id: shop.id,
        },
        data: Object.assign({}, payload),
    });
    return updatedShop;
});
const getShopByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUnique({
        where: {
            ownerId: userId,
        },
    });
    return shop;
});
const toggleFollowAShop = (shopId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistShop = yield prisma_1.default.shop.findUnique({
        where: {
            id: shopId,
        },
    });
    if (!isExistShop) {
        const result = yield prisma_1.default.shopFollower.deleteMany({
            where: {
                userId: userId,
                shopId: shopId,
            },
        });
        return result;
    }
    const isAlreadyFollowing = yield prisma_1.default.shopFollower.findFirst({
        where: {
            userId: userId,
            shopId: shopId,
        },
    });
    if (isAlreadyFollowing) {
        throw new AppError_1.default(400, "You are already following this shop");
    }
    const follower = yield prisma_1.default.shopFollower.create({
        data: {
            userId: userId,
            shopId: shopId,
        },
    });
    return follower;
});
const isShopFollowedByUser = (shopId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const follower = yield prisma_1.default.shopFollower.findFirst({
        where: {
            userId: userId,
            shopId: shopId,
        },
    });
    return follower;
});
const getShopFollowerCount = (shopId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const followerCount = yield prisma_1.default.shopFollower.count({
        where: {
            shopId: shopId,
        },
    });
    const isFollowing = yield prisma_1.default.shopFollower.findFirst({
        where: {
            userId: userId,
            shopId: shopId,
        },
    });
    return {
        count: followerCount,
        isFollowing: Boolean(isFollowing),
    };
});
const shopService = {
    createShop,
    getShopByUser,
    updateShop,
    toggleFollowAShop,
    isShopFollowedByUser,
    getShopFollowerCount,
};
exports.default = shopService;
