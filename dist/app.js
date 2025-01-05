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
exports.auth = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const googleapis_1 = require("googleapis");
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("../src/app/routes/index"));
const config_1 = __importDefault(require("./app/config"));
const error_1 = __importDefault(require("./app/middlewares/error"));
const not_found_1 = require("./app/middlewares/not-found");
const googleSheet_utils_1 = require("./utils/googleSheet.utils");
const app = (0, express_1.default)();
exports.auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});
// Middlewares
app.use((0, cors_1.default)({
    origin: [config_1.default.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", index_1.default);
// 404 Handler
app.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, googleSheet_utils_1.appendDataInSheet)({
        tnxId: "sakib test korteche",
        orderId: "123",
        userId: "123",
        date: "123",
        amount: 123,
    });
    res.send({
        success: true,
        statusCode: 200,
        data: null,
        message: "Hello from server",
    });
}));
app.use(not_found_1.notFound);
app.use(error_1.default);
exports.default = app;
