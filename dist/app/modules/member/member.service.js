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
exports.memberService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createMember = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.member.findUnique({
        where: {
            email: data.email,
        },
    });
    if (isExist) {
        throw new AppError_1.default(409, `Member with email '${data.email}' already exist`);
    }
    const result = yield prisma_1.default.member.create({ data: data });
    return result;
});
const getMembers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.member.findMany();
    return result;
});
const getMemberByMemberId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.member.findUnique({
        where: {
            memberId: id,
        },
    });
    return result;
});
const updateMember = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.member.findUnique({
        where: {
            memberId: id,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(404, `Member with id '${id}' not found`);
    }
    const result = yield prisma_1.default.member.update({
        where: {
            memberId: id,
        },
        data: data,
    });
    return result;
});
const deleteMember = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.member.findUnique({
        where: {
            memberId: id,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(404, `Member with id '${id}' not found`);
    }
    const result = prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.borrow.deleteMany({
            where: {
                memberId: id,
            },
        });
        const res = yield tx.member.delete({
            where: {
                memberId: id,
            },
        });
        return res;
    }));
    return result;
});
exports.memberService = {
    createMember,
    getMembers,
    getMemberByMemberId,
    updateMember,
    deleteMember,
};
