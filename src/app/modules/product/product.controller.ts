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

export const productController = {
  createProduct,
  getProducts,
  getProductDetailsById,
};
