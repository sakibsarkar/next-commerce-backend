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
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const review_service_1 = __importDefault(require("./review.service"));
const createReview = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body || {};
    const review = yield review_service_1.default.createReview(body, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Review created successfully",
        data: review,
    });
}));
const getAllReviewByProductId = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const query = req.query;
    const { reviews, totalCount, metaQuery } = yield review_service_1.default.getAllReviewByProductId(productId, query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Review fetched successfully",
        data: reviews,
        meta: Object.assign({ totalDoc: totalCount }, metaQuery),
    });
}));
const getReplyByReviewId = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const reply = yield review_service_1.default.getReplyByReviewId(reviewId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Reply fetched successfully",
        data: reply,
    });
}));
const createReply = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body || {};
    const user = req.user;
    const result = yield review_service_1.default.createReply(body, user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Reply created successfully",
        data: result,
    });
}));
const reviewController = {
    createReview,
    getAllReviewByProductId,
    getReplyByReviewId,
    createReply,
};
exports.default = reviewController;
