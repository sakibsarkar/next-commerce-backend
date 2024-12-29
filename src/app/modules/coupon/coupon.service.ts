import QueryBuilder from "../../builder/QueryBuilder";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import { ICoupon } from "./coupon.interface";

const validCouponByCouponCodeByProductIds = async (
  couponCode: string,
  productIds: string[]
) => {
  const coupon = await prisma.coupon.findFirst({
    where: {
      code: couponCode,
      productId: {
        in: productIds,
      },
    },
  });

  return coupon;
};

const getCouponList = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .search(["code", "id"])
    .paginate()
    .sort();

  const queryResult = queryBuilder.getPrismaQuery();

  const metaQuery = queryBuilder.getMetaQuery();

  const result = await prisma.coupon.findMany({
    ...queryResult,
    include: {
      productInfo: {
        include: {
          shopInfo: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
      },
    },
  });

  const totalCount = await prisma.coupon.count({
    where: queryResult.where || {},
  });

  return { result, totalCount, metaQuery };
};

const getVendorCouponList = async (
  query: Record<string, unknown>,
  vendorId: string
) => {
  const shop = await prisma.shop.findUnique({
    where: { ownerId: vendorId },
  });

  if (!shop) {
    throw new AppError(404, "Shop not found");
  }

  const queryBuilder = new QueryBuilder(query)
    .search(["code", "id"])
    .paginate()
    .sort();

  const queryResult = queryBuilder.getPrismaQuery({
    shopId: shop.id,
  });

  const metaQuery = queryBuilder.getMetaQuery();

  const result = await prisma.coupon.findMany({
    ...queryResult,
    include: {
      productInfo: true,
    },
  });

  const totalCount = await prisma.coupon.count({
    where: queryResult.where || {},
  });

  return { result, totalCount, metaQuery };
};

const deleteCouponCouponById = async (
  couponId: string,
  userId: string,
  userRole: string
) => {
  const coupon = await prisma.coupon.findUnique({
    where: {
      id: couponId,
    },
    include: {
      productInfo: {
        include: {
          shopInfo: {
            select: {
              ownerId: true,
            },
          },
        },
      },
    },
  });

  if (!coupon) {
    throw new AppError(404, "Coupon not found");
  }

  if (userRole !== "ADMIN" && userId !== coupon.productInfo.shopInfo.ownerId) {
    throw new AppError(403, "You are not authorized to delete this coupon");
  }

  const result = await prisma.coupon.delete({
    where: {
      id: couponId,
    },
  });

  return result;
};

const createCoupon = async (coupon: ICoupon, userId: string) => {
  const shop = await prisma.shop.findUnique({
    where: { ownerId: userId },
  });

  if (!shop) {
    throw new AppError(404, "Shop not found");
  }
  const isProductExits = await prisma.product.findUnique({
    where: {
      id: coupon.productId,
    },
  });
  if (!isProductExits) {
    throw new AppError(404, "Product not found");
  }
  const result = await prisma.coupon.create({
    data: {
      ...coupon,
      shopId: shop.id,
    },
  });
  return result;
};

const couponService = {
  validCouponByCouponCodeByProductIds,
  getCouponList,
  getVendorCouponList,
  deleteCouponCouponById,
  createCoupon,
};

export default couponService;
