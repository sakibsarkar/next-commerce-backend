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
/* eslint-disable @typescript-eslint/no-explicit-any */
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createProduct = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the shop associated with the user
    const shop = yield prisma_1.default.shop.findUnique({
        where: {
            ownerId: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    if (!shop) {
        throw new AppError_1.default(404, "Shop not found");
    }
    // Create the product
    const product = yield prisma_1.default.product.create({
        data: {
            name: payload.name,
            price: payload.price,
            stock: payload.stock,
            discount: payload.discount,
            tag: payload.tag,
            description: payload.description,
            images: payload.images,
            categoryId: payload.categoryId,
            shopId: shop.id,
            colors: {
                create: payload.colors.map((color) => ({
                    color: color.color,
                    sizes: {
                        create: color.sizes.map((size) => ({
                            size: size.size,
                            quantity: size.quantity,
                        })),
                    },
                })),
            },
        },
    });
    return product;
});
const duplicateProduct = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
        where: { id: productId },
        include: {
            colors: true,
            shopInfo: true,
        },
    });
    if (!product) {
        throw new AppError_1.default(404, "Product not found");
    }
    if (product.shopInfo.ownerId !== userId) {
        throw new AppError_1.default(403, "You are not authorized to duplicate this product");
    }
    const newProduct = yield prisma_1.default.product.create({
        data: {
            name: product.name,
            price: product.price,
            discount: product.discount,
            tag: product.tag,
            description: product.description,
            images: product.images,
            categoryId: product.categoryId,
            shopId: product.shopId,
            colors: {
                create: product.colors.map((color) => ({
                    color: color.color,
                    sizes: {
                        create: color.sizes.map((size) => ({
                            size: size.size,
                            quantity: size.quantity,
                        })),
                    },
                })),
            },
        },
    });
    return newProduct;
});
const updateProduct = (payload, productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
        where: { id: productId },
        include: {
            colors: true,
            shopInfo: true,
        },
    });
    if (!product) {
        throw new AppError_1.default(404, "Product not found");
    }
    if (product.shopInfo.ownerId !== userId) {
        throw new AppError_1.default(403, "You are not authorized to update this product");
    }
    // Construct the data to update
    const updateData = {
        name: payload.name,
        price: payload.price,
        stock: payload.stock,
        discount: payload.discount,
        tag: payload.tag,
        description: payload.description,
        images: payload.images,
        categoryId: payload.categoryId,
        isSale: payload.isSale,
        colors: {
            upsert: payload.colors.map((color) => ({
                where: { id: color.id },
                update: {
                    color: color.color,
                    sizes: {
                        upsert: color.sizes.map((size) => ({
                            where: { id: size.id },
                            update: { quantity: size.quantity },
                            create: {
                                size: size.size,
                                quantity: size.quantity,
                            },
                        })),
                    },
                },
                create: {
                    color: color.color,
                    sizes: {
                        create: color.sizes.map((size) => ({
                            size: size.size,
                            quantity: size.quantity,
                        })),
                    },
                },
            })),
        },
    };
    // Update the product in the database
    const updatedProduct = yield prisma_1.default.product.update({
        where: { id: productId },
        data: updateData,
    });
    return updatedProduct;
});
const removeColor = (colorId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const color = yield prisma_1.default.color.findUnique({
        where: { id: colorId },
        include: { product: { include: { shopInfo: true } } },
    });
    if (!color) {
        throw new AppError_1.default(404, "Color not found");
    }
    // Check authorization
    if (color.product.shopInfo.ownerId !== userId) {
        throw new AppError_1.default(404, "You are not authorized to remove this color");
    }
    // Delete the color (and cascade delete associated sizes)
    yield prisma_1.default.color.delete({
        where: { id: colorId },
    });
    return { message: "Color deleted successfully" };
});
const removeSize = (sizeId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const size = yield prisma_1.default.size.findUnique({
        where: { id: sizeId },
        include: {
            color: { include: { product: { include: { shopInfo: true } } } },
        },
    });
    if (!size) {
        throw new AppError_1.default(404, "Size not found");
    }
    // Check authorization
    if (size.color.product.shopInfo.ownerId !== userId) {
        throw new AppError_1.default(404, "You are not authorized to remove this size");
    }
    // Delete the size
    yield prisma_1.default.size.delete({
        where: { id: sizeId },
    });
    return { message: "Size deleted successfully" };
});
const deleteProductById = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
        where: { id: productId },
        include: { shopInfo: true },
    });
    if (!product) {
        throw new AppError_1.default(404, "Product not found");
    }
    if (product.shopInfo.ownerId !== userId) {
        throw new AppError_1.default(403, "You are not authorized to delete this product");
    }
    yield prisma_1.default.product.update({
        where: { id: productId },
        data: { isDeleted: true },
    });
    return null;
});
const getAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
    const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    const categories = query.categories ? query.categories.split(",") : undefined;
    const explodedQueryParams = ["minPrice", "maxPrice", "categories"];
    explodedQueryParams.forEach((key) => delete query[key]);
    let findQuery = {
        isDeleted: false,
    };
    if (maxPrice) {
        findQuery = Object.assign(Object.assign({}, findQuery), { price: { lte: maxPrice } });
    }
    if (minPrice) {
        findQuery = Object.assign(Object.assign({}, findQuery), { price: { gte: minPrice } });
    }
    if (categories) {
        findQuery = Object.assign(Object.assign({}, findQuery), { categoryId: { in: categories } });
    }
    const queryBuilder = new QueryBuilder_1.default(query)
        .paginate()
        .filter()
        .sort()
        .search(["name", "description"]);
    const queryResult = queryBuilder.getPrismaQuery(findQuery);
    const metaQuery = queryBuilder.getMetaQuery();
    const products = yield prisma_1.default.product.findMany(Object.assign(Object.assign({}, queryResult), { include: {
            shopInfo: true,
            categoryInfo: true,
            colors: {
                include: {
                    sizes: true,
                },
            },
        } }));
    const totalCount = yield prisma_1.default.product.count({
        where: queryResult.where || {},
    });
    return { products, metaQuery, totalCount };
});
const getProductDetailsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            colors: {
                include: {
                    sizes: true,
                },
            },
            shopInfo: true,
        },
    });
    return product;
});
const getRelatedProductsByCategoryId = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = 10;
    const relatedProducts = yield prisma_1.default.product.findMany({
        where: {
            categoryId,
            isDeleted: false,
        },
        include: {
            colors: {
                include: {
                    sizes: true,
                },
            },
            shopInfo: true,
        },
    });
    if (relatedProducts.length < limit) {
        const randomProducts = yield prisma_1.default.product.findMany({
            take: limit - relatedProducts.length,
            where: {
                isDeleted: false,
            },
            include: {
                colors: {
                    include: {
                        sizes: true,
                    },
                },
                shopInfo: true,
            },
        });
        return [...relatedProducts, ...randomProducts];
    }
    return relatedProducts;
});
const getFollowedShopProducts = (userId, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const followedShops = yield prisma_1.default.shopFollower.findMany({
        where: {
            userId: userId,
        },
        select: {
            shopId: true,
        },
    });
    const shopIds = followedShops.map((shopFollower) => shopFollower.shopId);
    if (shopIds.length === 0) {
        return [];
    }
    const products = yield prisma_1.default.product.findMany({
        where: {
            shopId: { in: shopIds },
            isDeleted: false,
        },
        skip: 0,
        take: limit,
    });
    const shuffledProducts = products.sort(() => 0.5 - Math.random());
    return shuffledProducts;
});
const productService = {
    createProduct,
    getAllProducts,
    getProductDetailsById,
    updateProduct,
    removeColor,
    removeSize,
    deleteProductById,
    getRelatedProductsByCategoryId,
    getFollowedShopProducts,
    duplicateProduct,
};
exports.default = productService;
