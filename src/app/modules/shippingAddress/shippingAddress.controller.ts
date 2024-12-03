import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import shippingAddressService from "./shippingAddress.service";

const createShippingAddress = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { body } = req;
  const shippingAddress = await shippingAddressService.createShippingAddress(
    body,
    user.id
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Shipping address created successfully",
    data: shippingAddress,
  });
});

const getShippingAddressByUser = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const shippingAddress = await shippingAddressService.getShippingAddressByUser(
    user.id
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shipping address fetched successfully",
    data: shippingAddress,
  });
});

const shippingAddressController = {
  createShippingAddress,
  getShippingAddressByUser,
};

export default shippingAddressController;
