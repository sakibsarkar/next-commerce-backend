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
        const result = yield prisma_1.default.shop.create({
            data: {
                logo: payload.logo || "",
                name: payload.name || "",
                description: payload.description || "",
                ownerId: userId,
            },
        });
        return result;
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
    const followerCount = yield prisma_1.default.shopFollower.count({
        where: {
            shopId: (shop === null || shop === void 0 ? void 0 : shop.id) || "",
        },
    });
    return Object.assign(Object.assign({}, shop), { followerCount });
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
        const result = yield prisma_1.default.shopFollower.deleteMany({
            where: {
                userId: userId,
                shopId: shopId,
            },
        });
        return result;
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
const getSopInformationByShopId = (shopId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUnique({
        where: {
            id: shopId,
        },
    });
    if (!shop) {
        throw new AppError_1.default(404, "Shop not found");
    }
    const isFollowing = yield prisma_1.default.shopFollower.findFirst({
        where: {
            userId: userId,
            shopId: shopId,
        },
    });
    const followerCount = yield prisma_1.default.shopFollower.count({
        where: {
            shopId: shopId,
        },
    });
    const totalProduct = yield prisma_1.default.product.count({
        where: {
            shopId: shopId,
        },
    });
    return Object.assign(Object.assign({}, shop), { followerCount,
        totalProduct, isFollowing: Boolean(isFollowing) });
});
const getAllShops = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const Builder = new QueryBuilder_1.default(query)
        .search(["name"])
        .filter()
        .sort()
        .paginate();
    const queryResult = Builder.getPrismaQuery({ isBlackListed: false });
    const metaQuery = Builder.getMetaQuery();
    const result = yield prisma_1.default.shop.findMany(Object.assign({}, queryResult));
    const shops = [];
    for (const shop of result) {
        const followerCount = yield prisma_1.default.shopFollower.count({
            where: {
                shopId: shop.id,
            },
        });
        const totalProduct = yield prisma_1.default.product.count({
            where: {
                shopId: shop.id,
            },
        });
        const data = Object.assign(Object.assign({}, shop), { followerCount,
            totalProduct });
        shops.push(data);
    }
    const totalCount = yield prisma_1.default.shop.count({
        where: queryResult.where || {},
    });
    return { result: shops, totalCount, metaQuery };
});
const shopService = {
    createShop,
    getShopByUser,
    updateShop,
    toggleFollowAShop,
    isShopFollowedByUser,
    getShopFollowerCount,
    getSopInformationByShopId,
    getAllShops,
};
exports.default = shopService;
