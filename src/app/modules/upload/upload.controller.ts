import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";

const uploadSingleFile = catchAsyncError(async (req, res) => {
  const file = req.file;
  if (!file) {
    return sendResponse(res, {
      message: "file not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }
  const url = file.path as string;
  if (!url) {
    return sendResponse(res, {
      message: "failed to upload image",
      success: false,
      data: null,
      statusCode: 400,
    });
  }

  sendResponse(res, {
    message: "Image uploaded successfully",
    success: true,
    data: url,
    statusCode: 200,
  });
});

const UploadController = {
  uploadSingleFile,
};

export default UploadController;
