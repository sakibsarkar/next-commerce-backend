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
const createNewsLatter = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.newsLatter.findUnique({
        where: {
            email: email,
        },
    });
    if (isExist) {
        throw new AppError_1.default(409, `This email is already registered`);
    }
    const result = yield prisma_1.default.newsLatter.create({
        data: {
            email: email,
        },
    });
    return result;
});
const getNewsLatters = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(query)
        .sort()
        .paginate()
        .search(["email"]);
    const queryResult = queryBuilder.getPrismaQuery();
    const metaQuery = queryBuilder.getMetaQuery();
    const result = yield prisma_1.default.newsLatter.findMany(queryResult);
    console.log(result);
    const totalCount = yield prisma_1.default.newsLatter.count({
        where: queryResult.where || {},
    });
    return { result, totalCount, metaQuery };
});
const newsLatterService = { createNewsLatter, getNewsLatters };
exports.default = newsLatterService;
