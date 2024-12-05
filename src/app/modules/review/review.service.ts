import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import { IReview } from "./review.interface";

const createReview = async (payload: IReview, userId: string) => {
  const isOrderExist = await prisma.order.findUnique({
    where: {
      id: payload.orderId,
    },
  });
  if (!isOrderExist) {
    throw new AppError(404, "Order not found");
  }
  const isReviewExist = await prisma.review.findFirst({
    where: {
      orderId: payload.orderId,
      userId: userId,
    },
  });
  if (isReviewExist) {
    throw new AppError(400, "Review already exists for this order");
  }
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        images: payload.images,
        description: payload.description,
        orderId: payload.orderId,
        userId: userId,
        productId: isOrderExist.productId,
      },
    });

    const avgRating = await tx.review.aggregate({
      where: { productId: isOrderExist.productId },
      _avg: {
        rating: true,
      },
    });

    await tx.product.update({
      where: {
        id: isOrderExist.productId,
      },
      data: {
        avgRating: avgRating._avg.rating || 0,
      },
    });

    await tx.order.update({
      where: {
        id: payload.orderId,
      },
      data: {
        hasReviewGiven: true,
      },
    });

    return review;
  });

  return result;
};

const getAllReviewByProductId = async (
  productId: string,
  query: Record<string, unknown>
) => {
  const isProductExist = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!isProductExist) {
    throw new AppError(404, "Product not found");
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const reviews = await prisma.review.findMany({
    where: {
      productId: productId,
    },
    skip,
    take: limit,
    include: {
      userInfo: true,
    },
  });

  const totalCount = await prisma.review.count({
    where: {
      productId: productId,
    },
  });

  const metaQuery = {
    currentPage: page,
    limit: limit,
    totalCount: totalCount,
  };

  return {
    reviews,
    totalCount,
    metaQuery,
  };
};

const getReplyByReviewId = async (reviewId: string) => {
  const reply = await prisma.reviewResponse.findMany({
    where: {
      reviewId: reviewId,
    },
    include: {
      shopInfo: true,
    },
  });
  return reply;
};

const createReply = async (
  payload: { reviewId: string; description: string },
  userId: string
) => {
  const shop = await prisma.shop.findUnique({
    where: {
      ownerId: userId,
    },
  });
  if (!shop) {
    throw new AppError(404, "Shop not found");
  }
  const result = await prisma.$transaction(async (tx) => {
    const isReviewExist = await tx.review.findUnique({
      where: {
        id: payload.reviewId,
      },
    });
    if (!isReviewExist) {
      throw new AppError(404, "Review not found");
    }

    const reply = await tx.reviewResponse.create({
      data: {
        reviewId: payload.reviewId,
        description: payload.description,
        shopId: shop.id,
      },
    });

    await tx.review.update({
      where: {
        id: payload.reviewId,
      },
      data: {
        hasReply: true,
      },
    });
    return reply;
  });
  return result;
};

const reviewService = {
  createReview,
  getAllReviewByProductId,
  getReplyByReviewId,
  createReply,
};

export default reviewService;
