"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const uploadSingleFile = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        return (0, sendResponse_1.default)(res, {
            message: "file not found",
            success: false,
            data: null,
            statusCode: 404,
        });
    }
    const url = file.path;
    if (!url) {
        return (0, sendResponse_1.default)(res, {
            message: "failed to upload image",
            success: false,
            data: null,
            statusCode: 400,
        });
    }
    (0, sendResponse_1.default)(res, {
        message: "Image uploaded successfully",
        success: true,
        data: url,
        statusCode: 200,
    });
}));
const uploadMutilpleFile = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files) {
        (0, sendResponse_1.default)(res, {
            data: null,
            success: false,
            message: "File not found",
        });
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const urls = files.map((file) => file.path);
    (0, sendResponse_1.default)(res, {
        data: urls,
        success: true,
        message: "File uploaded successfully",
        statusCode: 200,
    });
}));
const UploadController = {
    uploadSingleFile,
    uploadMutilpleFile,
};
exports.default = UploadController;
