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
exports.memberController = void 0;
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const member_service_1 = require("./member.service");
const createMember = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const result = yield member_service_1.memberService.createMember(body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Member created successfully",
        data: result,
    });
}));
const getMembers = (0, catchAsyncError_1.catchAsyncError)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield member_service_1.memberService.getMembers();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Members retrieved successfully",
        data: result,
    });
}));
const getMemberByMemberId = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const memberId = req.params.memberId;
    const result = yield member_service_1.memberService.getMemberByMemberId(memberId);
    (0, sendResponse_1.default)(res, {
        success: Boolean(result),
        statusCode: result ? 200 : 404,
        message: result
            ? "Member retrieved successfully"
            : `Member with id ${memberId} not found`,
        data: result || undefined,
    });
}));
const deleteMember = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const memberId = req.params.memberId;
    yield member_service_1.memberService.deleteMember(memberId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Member deleted successfully",
        data: undefined,
    });
}));
const updateMember = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const memberId = req.params.memberId;
    const { body } = req;
    const result = yield member_service_1.memberService.updateMember(memberId, body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Member updated successfully",
        data: result,
    });
}));
exports.memberController = {
    createMember,
    getMembers,
    getMemberByMemberId,
    deleteMember,
    updateMember,
};
