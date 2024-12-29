import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import couponService from "./coupon.service";

const createCoupon = catchAsyncError(async (req, res) => {
  const { body } = req;
  const user = req.user!;
  const result = await couponService.createCoupon(body, user.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Coupon created successfully",
    data: result,
  });
});

const validCouponByCouponCodeByProductIds = catchAsyncError(
  async (req, res) => {
    const { couponCode, productIds } = req.body;
    const result = await couponService.validCouponByCouponCodeByProductIds(
      couponCode,
      productIds
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Coupon fetched successfully",
      data: result,
    });
  }
);

const getCouponList = catchAsyncError(async (req, res) => {
  const { result, metaQuery, totalCount } = await couponService.getCouponList(
    req.query
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Coupon fetched successfully",
    data: result,
    meta: {
      totalDoc: totalCount,
      ...metaQuery,
    },
  });
});

const getVendorCouponList = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const query = req.query;
  const { metaQuery, result, totalCount } =
    await couponService.getVendorCouponList(query, user.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Coupon fetched successfully",
    data: result,
    meta: {
      totalDoc: totalCount,
      ...metaQuery,
    },
  });
});

const deleteCouponCouponById = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { couponId } = req.params;
  const result = await couponService.deleteCouponCouponById(
    couponId,
    user.id,
    user.role
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Coupon deleted successfully",
    data: result,
  });
});

export const couponController = {
  validCouponByCouponCodeByProductIds,
  getCouponList,
  getVendorCouponList,
  deleteCouponCouponById,
  createCoupon,
};
