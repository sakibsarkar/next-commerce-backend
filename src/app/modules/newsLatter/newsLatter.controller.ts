import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import newsLatterService from "./newsLatter.service";

const createNewsLatter = catchAsyncError(async (req, res) => {
  const { email } = req.body;
  const newsLatter = await newsLatterService.createNewsLatter(email);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "News Latter created successfully",
    data: newsLatter,
  });
});

const getNewsLatters = catchAsyncError(async (req, res) => {
  const {metaQuery, result, totalCount} = await newsLatterService.getNewsLatters(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "News Latter fetched successfully",
    data: result,
    meta: {
      totalDoc: totalCount,
      ...metaQuery
    }
  });
});

const newsLatterController = {
  createNewsLatter,
  getNewsLatters,
};
export default newsLatterController;
