import { Router } from "express";
import authMiddleWere from "../../middlewares/authMiddleWere";
import { validSchema } from "../../middlewares/validator";
import reviewController from "./review.controller";
import reviewValidationSchema from "./review.validation";
const router = Router();

router.post(
  "/crate",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("CUSTOMER"),
  validSchema(reviewValidationSchema.create),
  reviewController.createReview
);

router.post(
  "/reply",
  authMiddleWere.isAuthenticateUser,
  authMiddleWere.authorizeRoles("VENDOR"),
  validSchema(reviewValidationSchema.createReply),
  reviewController.createReply
);

router.get("/get/:productId", reviewController.getAllReviewByProductId);
router.get("/get-reply/:reviewId", reviewController.getReplyByReviewId);

const reviewRoute = router;

export default reviewRoute;
