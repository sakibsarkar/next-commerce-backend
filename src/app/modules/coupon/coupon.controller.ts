import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import couponService from "./coupon.service";

const validCouponByCouponCodeByProductIds = catchAsyncError(async (req, res) => {
    const { couponCode, productIds } = req.body;
    const result = await couponService.validCouponByCouponCodeByProductIds(couponCode, productIds);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Coupon fetched successfully",
        data: result
    })
})

export const couponController = {
    validCouponByCouponCodeByProductIds
}