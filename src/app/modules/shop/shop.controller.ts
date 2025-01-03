import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import shopService from "./shop.service";

const createShop = catchAsyncError(async (req, res) => {
  const { body } = req;
  const user = req.user!;
  const shop = await shopService.createShop(body, user.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Shop created successfully",
    data: shop,
  });
});

const updateShop = catchAsyncError(async (req, res) => {
  const { body } = req;
  const user = req.user!;
  const shop = await shopService.updateShop(user.id, body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop updated successfully",
    data: shop,
  });
});

const getShopByUser = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const shop = await shopService.getShopByUser(user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop retrieved successfully",
    data: shop,
  });
});

const toggleFollowAShop = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { shopId } = req.params;
  const shop = await shopService.toggleFollowAShop(shopId, user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop followed successfully",
    data: shop,
  });
});

const isShopFollowedByUser = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { shopId } = req.params;
  const shop = await shopService.isShopFollowedByUser(shopId, user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop folow status updated successfully",
    data: {
      isFollowing: Boolean(shop),
    },
  });
});

const getShopFollowerCount = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { shopId } = req.params;
  const followerCount = await shopService.getShopFollowerCount(shopId, user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop follower count retrieved successfully",
    data: followerCount,
  });
});

const getSopInformationByShopId = catchAsyncError(async (req, res) => {
  const { shopId } = req.params;
  const user = req.user!;
  const shop = await shopService.getSopInformationByShopId(shopId, user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop information retrieved successfully",
    data: shop,
  });
});

const getAllShopsController = catchAsyncError(async (req, res) => {
  const { query } = req;
  const { metaQuery, result, totalCount } = await shopService.getAllShops(
    query
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shops retrieved successfully",
    data: result,
    meta: Object.assign({ totalDoc: totalCount }, metaQuery),
  });
});

const shopController = {
  createShop,
  getShopByUser,
  updateShop,
  toggleFollowAShop,
  isShopFollowedByUser,
  getShopFollowerCount,
  getSopInformationByShopId,
  getAllShopsController,
};

export default shopController;
