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
const toggleUserSuspension = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
            isDeleted: false,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            isSuspended: !user.isSuspended,
        },
    });
    return result;
});
const getVendorAndUserData = () => __awaiter(void 0, void 0, void 0, function* () {
    const userCounts = yield prisma_1.default.user.groupBy({
        by: ["role"],
        where: {
            role: {
                in: ["VENDOR", "CUSTOMER"],
            },
        },
        _count: {
            role: true,
        },
    });
    // Calculate the total number of users
    const totalUsers = userCounts.reduce((sum, user) => sum + user._count.role, 0);
    // Map to percentage data
    const pieChartData = userCounts.map((user) => ({
        role: user.role,
        percentage: ((user._count.role / totalUsers) * 100).toFixed(2), // Convert to percentage
    }));
    return pieChartData;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
const toggleShopBlackListStatus = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUnique({
        where: {
            id: shopId,
        },
    });
    if (!shop) {
        throw new Error("Shop not found");
    }
    const result = yield prisma_1.default.shop.update({
        where: {
            id: shopId,
        },
        data: {
            isBlackListed: !shop.isBlackListed,
        },
    });
    return result;
});
const getTransactionHistory = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(query).paginate().sort().filter();
    const queryResult = queryBuilder.getPrismaQuery();
    const metaQuery = queryBuilder.getMetaQuery();
    const result = yield prisma_1.default.payment.findMany(queryResult);
    const totalCount = yield prisma_1.default.payment.count({
        where: queryResult.where || {},
    });
    return { result, totalCount, metaQuery };
});
const getSystemOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalActiveUser = yield prisma_1.default.user.count({
        where: {
            isDeleted: false,
            isSuspended: false,
            role: "CUSTOMER",
        },
    });
    const totalActiveVendor = yield prisma_1.default.user.count({
        where: {
            isDeleted: false,
            isSuspended: false,
            role: "VENDOR",
        },
    });
    const totalActiveShop = yield prisma_1.default.shop.count({
        where: {
            isBlackListed: false,
        },
    });
    const totalPayment = yield prisma_1.default.payment.count({
        where: {
            status: "SUCCESS",
        },
    });
    return {
        totalActiveUser,
        totalActiveVendor,
        totalActiveShop,
        totalPayment,
    };
});
const getMonthlyTransactionOfCurrentYear = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentYear = new Date().getFullYear();
    // Fetch successful transactions grouped by month
    const transactions = yield prisma_1.default.payment.groupBy({
        by: ["status", "createdAt"],
        where: {
            status: "SUCCESS",
            createdAt: {
                gte: new Date(`${currentYear}-01-01`),
                lt: new Date(`${currentYear + 1}-01-01`),
            },
        },
        _sum: {
            amount: true,
        },
    });
    // Prepare data grouped by month
    const monthlyData = Array(12).fill(0); // 12 months initialized to 0
    transactions.forEach((transaction) => {
        const month = new Date(transaction.createdAt).getMonth(); // 0-indexed
        monthlyData[month] += transaction._sum.amount || 0;
    });
    return monthlyData;
});
const getAllUserList = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(query)
        .paginate()
        .sort()
        .filter()
        .search(["first_name", "last_name", "email"]);
    const queryResult = queryBuilder.getPrismaQuery({
        isDeleted: false,
    });
    const metaQuery = queryBuilder.getMetaQuery();
    const result = yield prisma_1.default.user.findMany(queryResult);
    const totalCount = yield prisma_1.default.user.count({
        where: queryResult.where || {},
    });
    return { result, totalCount, metaQuery };
});
const getAllShopList = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(query)
        .paginate()
        .sort()
        .filter()
        .search(["name"]);
    const defaultQuery = {};
    const isBlackListed = query.isBlackListed;
    if (isBlackListed) {
        if (isBlackListed == "1") {
            defaultQuery.isBlackListed = true;
        }
        else {
            defaultQuery.isBlackListed = false;
        }
    }
    delete query.isBlackListed;
    const queryResult = queryBuilder.getPrismaQuery(defaultQuery);
    const metaQuery = queryBuilder.getMetaQuery();
    const result = yield prisma_1.default.shop.findMany(queryResult);
    const totalCount = yield prisma_1.default.shop.count({
        where: queryResult.where || {},
    });
    return { result, totalCount, metaQuery };
});
const adminService = {
    toggleUserSuspension,
    deleteUser,
    toggleShopBlackListStatus,
    getTransactionHistory,
    getSystemOverview,
    getMonthlyTransactionOfCurrentYear,
    getVendorAndUserData,
    getAllUserList,
    getAllShopList,
};
exports.default = adminService;
