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
const getAllCategories = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(query)
        .paginate()
        .sort()
        .filter()
        .search(["label"]);
    const queryResult = queryBuilder.getPrismaQuery();
    const metaQuery = queryBuilder.getMetaQuery();
    const totalCount = yield prisma_1.default.category.count({
        where: queryResult.where || {},
    });
    const result = yield prisma_1.default.category.findMany(Object.assign({}, queryResult));
    return { result, totalCount, metaQuery };
});
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.create({ data });
    return result;
});
const categoryService = { getAllCategories, createCategory };
exports.default = categoryService;
