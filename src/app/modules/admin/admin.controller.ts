import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import adminService from "./admin.service";

const toggleUserSuspension = catchAsyncError(async (req, res) => {
  const { userId } = req.params;
  const result = await adminService.toggleUserSuspension(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User suspension toggled successfully",
    data: result,
  });
});

const deleteUser = catchAsyncError(async (req, res) => {
  const { userId } = req.params;
  const result = await adminService.deleteUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: result,
  });
});

const toggleShopBlackListStatus = catchAsyncError(async (req, res) => {
  const { shopId } = req.params;
  const result = await adminService.toggleShopBlackListStatus(shopId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop blacklisted successfully",
    data: result,
  });
});

const getTransactionHistory = catchAsyncError(async (req, res) => {
  const { query } = req;
  const result = await adminService.getTransactionHistory(query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Transaction history retrieved successfully",
    data: result,
  });
});

const getSystemOverview = catchAsyncError(async (req, res) => {
  const result = await adminService.getSystemOverview();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "System overview retrieved successfully",
    data: result,
  });
});

const adminController = {
  toggleUserSuspension,
  deleteUser,
  toggleShopBlackListStatus,
  getTransactionHistory,
  getSystemOverview,
};

export default adminController;
