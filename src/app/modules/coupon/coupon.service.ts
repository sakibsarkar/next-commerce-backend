import prisma from "../../config/prisma";

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

const couponService = {
  validCouponByCouponCodeByProductIds,
};

export default couponService;
