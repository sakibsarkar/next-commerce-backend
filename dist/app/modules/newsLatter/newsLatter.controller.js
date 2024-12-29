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
const newsLatter_service_1 = __importDefault(require("./newsLatter.service"));
const createNewsLatter = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const newsLatter = yield newsLatter_service_1.default.createNewsLatter(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "News Latter created successfully",
        data: newsLatter,
    });
}));
const getNewsLatters = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { metaQuery, result, totalCount } = yield newsLatter_service_1.default.getNewsLatters(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "News Latter fetched successfully",
        data: result,
        meta: Object.assign({ totalDoc: totalCount }, metaQuery)
    });
}));
const newsLatterController = {
    createNewsLatter,
    getNewsLatters,
};
exports.default = newsLatterController;
