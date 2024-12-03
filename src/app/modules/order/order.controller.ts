import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import orderService from "./order.service";

const createOrder = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { paymentIntentId, orderItems, shippingAddressId } = req.body;

  const transactionId = await orderService.createOrder(
    orderItems,
    user.id,
    paymentIntentId!,
    shippingAddressId
  );

  

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Order created successfully",
    data: {
      transactionId,
    },
  });
});

const getUserOrders = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { metaQuery, orders, totalCount } = await orderService.getUserOrders(
    user.id,
    req.query
  );

  sendResponse(res, {
    success: true,
    data: orders,
    message: "Orders retrieved successfully",
    meta: {
      ...metaQuery,
      totalDoc: totalCount,
    },
  });
});
const getVendorOrders = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { metaQuery, orders, totalCount } = await orderService.getVendorOders(
    user.id,
    req.query
  );

  sendResponse(res, {
    success: true,
    data: orders,
    message: "Orders retrieved successfully",
    meta: {
      ...metaQuery,
      totalDoc: totalCount,
    },
  });
});

const orderController = {
  createOrder,
  getUserOrders,
  getVendorOrders,
};

export default orderController;
