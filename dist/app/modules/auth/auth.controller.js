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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendMessage_1 = __importDefault(require("../../../utils/sendMessage"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_utils_1 = __importDefault(require("./auth.utils"));
const signUp = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const isExist = yield prisma_1.default.user.findFirst({
        where: { email: body.email },
    });
    if (isExist) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            data: null,
            statusCode: 400,
            message: `User already exist with email ${body.email}`,
        });
    }
    const password = yield auth_utils_1.default.hashPassword(body.password);
    const result = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, body), { password }),
    });
    const tokenPayload = {
        id: result.id,
        email: result.email,
        role: result.role || "",
    };
    const accessToken = auth_utils_1.default.generateAccessToken(tokenPayload);
    const refreshToken = auth_utils_1.default.generateRefreshToken(result.id);
    res
        .cookie("accessToken", accessToken, {
        sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
    })
        .cookie("refreshToken", refreshToken, {
        sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 24 * 60 * 60 * 30, // 30 days
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
    });
    res.json({
        data: {
            result: Object.assign(Object.assign({}, result), { password: undefined, passwordResetToken: undefined, passwordResetExpiry: undefined, otp: undefined, otpExpiry: undefined }),
            accessToken,
        },
        success: true,
        statusCode: 201,
        message: "User created successfully",
    });
}));
const login = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const isExist = yield prisma_1.default.user.findUnique({
        where: { email: body.email, isDeleted: false },
    });
    if (!isExist) {
        throw new AppError_1.default(403, `User not found with email '${body.email}'`);
    }
    if (isExist.isSuspended) {
        throw new AppError_1.default(403, "Account is suspended");
    }
    const isMatch = bcrypt_1.default.compareSync(body.password, isExist.password);
    if (!isMatch) {
        throw new AppError_1.default(403, "Unauthorized. Password is incorrect");
    }
    // if (!isExist.isVerified) {
    //   await authUtils.sendVerificationEmail({
    //     id: isExist.id,
    //     email: isExist.email,
    //     first_name: isExist.first_name,
    //   });
    //   return sendResponse(res, {
    //     success: false,
    //     data: { isVerified: false },
    //     statusCode: 400,
    //     message: "Please check your email to verify your account",
    //   });
    // }
    const tokenPayload = {
        id: isExist.id,
        email: isExist.email,
        role: isExist.role || "",
    };
    const accessToken = auth_utils_1.default.generateAccessToken(tokenPayload);
    const refreshToken = auth_utils_1.default.generateRefreshToken(isExist.id);
    res
        .cookie("accessToken", accessToken, {
        sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
    })
        .cookie("refreshToken", refreshToken, {
        sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 24 * 60 * 60 * 30, // 30 days
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
    });
    res.json({
        data: Object.assign(Object.assign({}, isExist), { password: undefined, passwordResetToken: undefined, passwordResetExpiry: undefined, otp: undefined, otpExpiry: undefined }),
        accessToken,
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
    });
}));
// const verifyEmail = async (req: Request, res: Response) => {
//   try {
//     const token = req.params.token;
//     if (!token) {
//       throw new AppError(404, "Invalid token");
//     }
//     const decryptedJwt = jwt.verify(
//       token,
//       Config.EMAIL_VERIFICATION_TOKEN.SECRET as string
//     ) as { id: string; email: string };
//     const { id, email } = decryptedJwt;
//     const user = await prisma.user.findUnique({ where: { id, email } });
//     if (!user) {
//       throw new AppError(404, "User not found");
//     }
//     await prisma.user.update({
//       where: {
//         id: user.id,
//       },
//       data: {
//         isVerified: true,
//       },
//     });
//     const filePath = join(__dirname, "../templates/varification-success.html");
//     let file = readFileSync(filePath, "utf-8");
//     file = file.replace("{{link}}", Config.FRONTEND_URL!);
//     res.send(file);
//   } catch {
//     const filePath = join(__dirname, "../templates/varification-failed.html");
//     let file = readFileSync(filePath, "utf-8");
//     file = file.replace("{{link}}", Config.FRONTEND_URL!);
//     res.send(file);
//   }
// };
const author = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            image: true,
            isDeleted: true,
            isSuspended: true,
        },
    });
    (0, sendResponse_1.default)(res, {
        data: Object.assign(Object.assign({}, result), { password: undefined, passwordResetToken: undefined, passwordResetExpiry: undefined }),
        success: true,
        statusCode: 200,
        message: "Author infor retrieved successfully",
    });
}));
const updateProfile = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        throw new AppError_1.default(404, "User not found");
    const { id } = user;
    const existingUser = yield prisma_1.default.user.findUnique({ where: { id } });
    if (!existingUser)
        throw new AppError_1.default(404, "User not found");
    const result = yield prisma_1.default.user.update({
        where: { id },
        data: Object.assign({}, req.body),
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        data: Object.assign(Object.assign({}, result), { password: undefined, passwordResetToken: undefined, passwordResetExpiry: undefined, otp: undefined, otpExpiry: undefined }),
        message: "Profile updated successfully",
    });
}));
const updateUserProfileImage = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const user = req.user;
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
    const result = yield prisma_1.default.user.update({
        where: {
            id: user.id,
        },
        data: {
            image: url,
        },
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        message: "image updated successfully",
        statusCode: 200,
        success: true,
    });
}));
const logout = (0, catchAsyncError_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        path: "/",
        sameSite: "none",
        secure: config_1.default.NODE_ENV === "production" ? true : false,
    });
    res.clearCookie("refreshToken", {
        path: "/",
        sameSite: "none",
        secure: config_1.default.NODE_ENV === "production" ? true : false,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        data: null,
        message: "User logged out successfully",
    });
}));
const refreshToken = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cookies } = req;
    // const user = req.user
    const { refreshToken } = cookies;
    if (!refreshToken) {
        throw new AppError_1.default(40, "No refresh token provided");
    }
    let userId = null;
    try {
        const decryptedJwt = jsonwebtoken_1.default.verify(refreshToken, config_1.default.REFRESH_TOKEN.SECRET);
        userId = decryptedJwt.id;
    }
    catch (_a) {
        userId = null;
    }
    if (!userId) {
        throw new AppError_1.default(401, "Invalid refresh token");
    }
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new AppError_1.default(401, "User not found");
    }
    const accessToken = auth_utils_1.default.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role || "",
    });
    // Generate new Access Token
    res.cookie("accessToken", accessToken, {
        sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Token refreshed",
        data: { accessToken },
    });
}));
const forgotPassword = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const email = body.email;
    if (!email) {
        throw new AppError_1.default(400, "Email is required");
    }
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    const token = (0, uuid_1.v4)();
    const expiry = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now
    yield prisma_1.default.user.update({
        where: {
            email: email,
        },
        data: {
            passwordResetToken: token,
            passwordResetExpiry: expiry,
        },
    });
    const url = `${config_1.default.FRONTEND_URL}/recover-password/${token}`;
    const subject = "Account Password Reset Requested";
    const emailContent = `
      <p style="text-align: center;">
          Hey ${user === null || user === void 0 ? void 0 : user.first_name} ${user === null || user === void 0 ? void 0 : user.last_name}, please reset your account password by clicking on the link below.<br>
          This link will expire within 5 minutes.
      </p>
      <a href="${url}" style="text-align: center; display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
  `;
    yield (0, sendMessage_1.default)({
        html: emailContent,
        receiverMail: user.email,
        subject,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        data: null,
        message: "Password reset email sent successfully",
    });
}));
const resetPassword = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password: newPassword, token } = req.body;
    const user = yield prisma_1.default.user.findFirst({
        where: {
            passwordResetToken: token,
        },
    });
    if (!user || !user.passwordResetToken || !user.passwordResetExpiry) {
        throw new AppError_1.default(404, "User not found or invalid reset token");
    }
    const storedExpiry = new Date(user.passwordResetExpiry).getTime();
    const currentTimestamp = new Date().getTime();
    if (currentTimestamp > storedExpiry) {
        throw new AppError_1.default(400, "Link expired");
    }
    const hashedPassword = yield auth_utils_1.default.hashPassword(newPassword);
    yield prisma_1.default.user.update({
        where: {
            id: user.id,
        },
        data: {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpiry: null,
        },
    });
    const to = user.email;
    const subject = "Account Password Reset";
    yield (0, sendMessage_1.default)({
        html: `
    <p style="text-align: center;">Hey ${user.first_name} ${user === null || user === void 0 ? void 0 : user.last_name}, your account password has been reset successfully.</p>`,
        receiverMail: to,
        subject,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Password reset successfully",
        data: null,
    });
}));
const changePassword = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const userAuth = req.user;
    if (!userAuth) {
        throw new AppError_1.default(404, "User not found");
    }
    const { password: newPassword, oldPassword } = body;
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userAuth.id },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    const isPasswordMatching = bcrypt_1.default.compareSync(oldPassword, user.password);
    if (!isPasswordMatching) {
        throw new AppError_1.default(403, "Unauthorized. Password is incorrect");
    }
    if (newPassword === oldPassword) {
        throw new AppError_1.default(400, "New password cannot be the same as the old password");
    }
    const hashedPassword = yield auth_utils_1.default.hashPassword(newPassword);
    yield prisma_1.default.user.update({
        where: { id: userAuth.id },
        data: { password: hashedPassword },
    });
    const to = user.email;
    const subject = "Password Changed";
    const emailContent = `
      <p style="text-align: center;">Hey ${user.first_name} ${user.last_name}, your account password has been changed successfully.</p>`;
    yield (0, sendMessage_1.default)({
        html: emailContent,
        receiverMail: to,
        subject,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Password changed successfully",
        data: null,
    });
}));
const authController = {
    signUp,
    login,
    logout,
    author,
    updateProfile,
    updateUserProfileImage,
    refreshToken,
    forgotPassword,
    resetPassword,
    changePassword,
};
exports.default = authController;
