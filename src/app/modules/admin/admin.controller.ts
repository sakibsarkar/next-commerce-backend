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
  const { metaQuery, result, totalCount } =
    await adminService.getTransactionHistory(query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Transaction history retrieved successfully",
    data: result,
    meta: {
      totalDoc: totalCount,
      ...metaQuery,
    },
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

const getMonthlyTransactionOfCurrentYear = catchAsyncError(async (req, res) => {
  const result = await adminService.getMonthlyTransactionOfCurrentYear();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Monthly transaction retrieved successfully",
    data: result,
  });
});

const getUserAllUserList = catchAsyncError(async (req, res) => {
  const { query } = req;
  const { metaQuery, result, totalCount } =
    await adminService.getUserAllUserList(query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User list retrieved successfully",
    data: result,
    meta: {
      totalDoc: totalCount,
      ...metaQuery,
    },
  });
});

const adminController = {
  toggleUserSuspension,
  deleteUser,
  toggleShopBlackListStatus,
  getTransactionHistory,
  getSystemOverview,
  getMonthlyTransactionOfCurrentYear,
  getUserAllUserList,
};

export default adminController;
