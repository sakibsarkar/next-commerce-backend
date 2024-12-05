"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWere_1 = __importDefault(require("../../middlewares/authMiddleWere"));
const validator_1 = require("../../middlewares/validator");
const review_controller_1 = __importDefault(require("./review.controller"));
const review_validation_1 = __importDefault(require("./review.validation"));
const router = (0, express_1.Router)();
router.post("/create", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("CUSTOMER"), (0, validator_1.validSchema)(review_validation_1.default.create), review_controller_1.default.createReview);
router.post("/reply", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), (0, validator_1.validSchema)(review_validation_1.default.createReply), review_controller_1.default.createReply);
router.get("/get/:productId", review_controller_1.default.getAllReviewByProductId);
router.get("/my-shop", authMiddleWere_1.default.isAuthenticateUser, authMiddleWere_1.default.authorizeRoles("VENDOR"), review_controller_1.default.getUsersShopReview);
router.get("/get-reply/:reviewId", review_controller_1.default.getReplyByReviewId);
const reviewRoute = router;
exports.default = reviewRoute;
