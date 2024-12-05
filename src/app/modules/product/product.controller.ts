import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import AppError from "../../errors/AppError";
import productService from "./product.service";

const createProduct = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const body = req.body || {};
  const product = await productService.createProduct(body, user);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Product created successfully",
    data: product,
  });
});

const duplicateProduct = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { productId } = req.params;
  const product = await productService.duplicateProduct(productId, user.id);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Product duplicated successfully",
    data: product,
  });
});

const updateProduct = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const body = req.body || {};
  const { productId } = req.params;

  const product = await productService.updateProduct(body, productId, user.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product updated successfully",
    data: product,
  });
});

const removeSize = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const sizeId = req.params.sizeId;

  const product = await productService.removeSize(sizeId, user.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Size deleted successfully",
    data: product,
  });
});

const removeColor = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const colorId = req.params.colorId;

  const product = await productService.removeColor(colorId, user.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Color deleted successfully",
    data: product,
  });
});

const deleteProductById = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { productId } = req.params;
  const product = await productService.deleteProductById(productId, user.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product deleted successfully",
    data: product,
  });
});

const getProducts = catchAsyncError(async (req, res) => {
  const query = req.query;
  const { metaQuery, products, totalCount } =
    await productService.getAllProducts(query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Products retrieved successfully",
    data: products,
    meta: {
      ...metaQuery,
      totalDoc: totalCount,
    },
  });
});

const getUsersShopProducts = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { metaQuery, result } = await productService.getUsersShopProducts(
    user.id,
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Products retrieved successfully",
    data: result,
    meta: {
      limit: metaQuery.limit,
      currentPage: metaQuery.page,
      totalDoc: metaQuery.totalCount,
    },
  });
});

const getProductDetailsById = catchAsyncError(async (req, res) => {
  const { id } = req.params;

  const product = await productService.getProductDetailsById(id as string);
  if (!product) {
    throw new AppError(404, "Product not found");
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product retrieved successfully",
    data: product,
  });
});

const getRelatedProductsByCategoryId = catchAsyncError(async (req, res) => {
  const { categoryId } = req.params;

  const products = await productService.getRelatedProductsByCategoryId(
    categoryId
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Products retrieved successfully",
    data: products,
  });
});

const getFollowedShopProducts = catchAsyncError(async (req, res) => {
  const user = req.user!;
  const { limit } = req.query;

  const products = await productService.getFollowedShopProducts(
    user.id,
    Number(limit || 10)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Products retrieved successfully",
    data: products,
  });
});

export const productController = {
  createProduct,
  duplicateProduct,
  updateProduct,
  getProducts,
  getProductDetailsById,
  removeColor,
  removeSize,
  deleteProductById,
  getRelatedProductsByCategoryId,
  getFollowedShopProducts,
  getUsersShopProducts,
};
