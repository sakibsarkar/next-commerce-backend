"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
class QueryBuilder {
    constructor(query) {
        this.query = query;
        this.prismaQuery = {};
    }
    search(searchableFields) {
        const searchTerm = this.query.searchTerm;
        if (searchTerm) {
            this.prismaQuery = Object.assign(Object.assign({}, this.prismaQuery), { where: {
                    OR: searchableFields.map((field) => ({
                        [field]: { contains: searchTerm, mode: "insensitive" }, // Case-insensitive search
                    })),
                } });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        this.prismaQuery = Object.assign(Object.assign({}, this.prismaQuery), { where: Object.assign(Object.assign({}, this.prismaQuery.where), queryObj) });
        return this;
    }
    sort() {
        var _a, _b;
        const sort = ((_b = (_a = this.query.sort) === null || _a === void 0 ? void 0 : _a.split(",")) === null || _b === void 0 ? void 0 : _b.join(" ")) || "-createdAt";
        this.prismaQuery = Object.assign(Object.assign({}, this.prismaQuery), { orderBy: sort.split(" ").map((field) => {
                const direction = field.startsWith("-") ? "desc" : "asc";
                return { [field.replace("-", "")]: direction };
            }) });
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.prismaQuery = Object.assign(Object.assign({}, this.prismaQuery), { skip, take: limit });
        return this;
    }
    fields() {
        var _a;
        const fields = ((_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(",")) || [];
        if (fields.length > 0) {
            this.prismaQuery = Object.assign(Object.assign({}, this.prismaQuery), { select: fields.reduce((acc, field) => (Object.assign(Object.assign({}, acc), { [field]: true })), {}) });
        }
        return this;
    }
    getPrismaQuery(whereQuery) {
        if (!whereQuery)
            return this.prismaQuery;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return Object.assign(Object.assign({}, this.prismaQuery), { where: Object.assign(Object.assign({}, this.prismaQuery.where), whereQuery) });
    }
    getMetaQuery() {
        return {
            currentPage: Number(this.query.page) || 1,
            limit: Number(this.query.limit) || 10,
        };
    }
}
exports.default = QueryBuilder;
