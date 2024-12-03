import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import categoryService from "./category.service";

const createCategory = catchAsyncError(async (req, res) => {
  const { body } = req;

  if (!body.label) {
    throw new Error("Category label is required");
  }

  const category = await categoryService.createCategory(body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Category created successfully",
    data: category,
  });
});

const getAllCategories = catchAsyncError(async (req, res) => {
  const { query } = req;
  const { result, totalCount, metaQuery } =
    await categoryService.getAllCategories(query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Category fetched successfully",
    meta: {
      totalDoc: totalCount,
      ...metaQuery,
    },
    data: result,
  });
});

const categoryController = { createCategory, getAllCategories };
export default categoryController;
