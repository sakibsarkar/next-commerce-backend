import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import reviewService from "./review.service";

const createReview = catchAsyncError(async (req, res) => {
  const user = req.user!;

  const body = req.body || {};
  
  const review = await reviewService.createReview(body, user.id);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review created successfully",
    data: review,
  });
});

const getAllReviewByProductId = catchAsyncError(async (req, res) => {
  const { productId } = req.params;
  const query = req.query;

  const { reviews, totalCount, metaQuery } =
    await reviewService.getAllReviewByProductId(productId, query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review fetched successfully",
    data: reviews,
    meta: {
      totalDoc: totalCount,
      ...metaQuery,
    },
  });
});

const getUsersShopReview = catchAsyncError(async (req, res) => {
  const user = req.user!;

  const { meta, reviews } = await reviewService.getUsersShopReviews(
    user.id,
    req.query
  );

  sendResponse(res, {
    success: true,
    data: reviews,
    meta: meta,
    statusCode: 200,
    message: "Reviews fetched successfully",
  });
});

const getReplyByReviewId = catchAsyncError(async (req, res) => {
  const { reviewId } = req.params;

  const reply = await reviewService.getReplyByReviewId(reviewId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reply fetched successfully",
    data: reply,
  });
});

const createReply = catchAsyncError(async (req, res) => {
  const body = req.body || {};
  const user = req.user!;
  const result = await reviewService.createReply(body, user.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reply created successfully",
    data: result,
  });
});
const reviewController = {
  createReview,
  getAllReviewByProductId,
  getReplyByReviewId,
  createReply,
  getUsersShopReview,
};

export default reviewController;
