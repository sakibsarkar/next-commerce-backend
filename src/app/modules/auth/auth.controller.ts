import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import catchAsyncError from "../../../utils/catchAsyncError";
import sendMessage from "../../../utils/sendMessage";
import sendResponse from "../../../utils/sendResponse";
import Config from "../../config";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import authUtils from "./auth.utils";
const signUp = catchAsyncError(async (req, res) => {
  const { body } = req;
  const isExist = await prisma.user.findFirst({
    where: { email: body.email as string },
  });
  if (isExist) {
    return sendResponse(res, {
      success: false,
      data: null,
      statusCode: 400,
      message: `User already exist with email ${body.email}`,
    });
  }
  const password = await authUtils.hashPassword(body.password);
  const result = await prisma.user.create({
    data: {
      ...body,
      password,
    },
  });

  const tokenPayload = {
    id: result.id,
    email: result.email,
    role: result.role || "",
  };

  const accessToken = authUtils.generateAccessToken(tokenPayload);
  const refreshToken = authUtils.generateRefreshToken(result.id);

  res
    .cookie("accessToken", accessToken, {
      sameSite: Config.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1000 * 60 * 60, // 1 hour
      httpOnly: true,
      secure: Config.NODE_ENV === "production",
    })
    .cookie("refreshToken", refreshToken, {
      sameSite: Config.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1000 * 24 * 60 * 60 * 30, // 30 days
      httpOnly: true,
      secure: Config.NODE_ENV === "production",
    });
  res.json({
    data: {
      result: {
        ...result,
        password: undefined,
        passwordResetToken: undefined,
        passwordResetExpiry: undefined,
        otp: undefined,
        otpExpiry: undefined,
      },
      accessToken,
    },
    success: true,
    statusCode: 201,
    message: "User created successfully",
  });
});

const login = catchAsyncError(async (req, res) => {
  const { body } = req;
  const isExist = await prisma.user.findUnique({
    where: { email: body.email, isDeleted: false },
  });

  if (!isExist) {
    throw new AppError(403, `User not found with email '${body.email}'`);
  }

  if (isExist.isSuspended) {
    throw new AppError(403, "Account is suspended");
  }

  const isMatch = bcrypt.compareSync(body.password, isExist.password);
  if (!isMatch) {
    throw new AppError(403, "Unauthorized. Password is incorrect");
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

  const accessToken = authUtils.generateAccessToken(tokenPayload);
  const refreshToken = authUtils.generateRefreshToken(isExist.id);
  res
    .cookie("accessToken", accessToken, {
      sameSite: Config.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1000 * 60 * 60, // 1 hour
      httpOnly: true,
      secure: Config.NODE_ENV === "production",
    })
    .cookie("refreshToken", refreshToken, {
      sameSite: Config.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1000 * 24 * 60 * 60 * 30, // 30 days
      httpOnly: true,
      secure: Config.NODE_ENV === "production",
    });
  res.json({
    data: {
      ...isExist,
      password: undefined,
      passwordResetToken: undefined,
      passwordResetExpiry: undefined,
      otp: undefined,
      otpExpiry: undefined,
    },
    accessToken,
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
  });
});

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

const author = catchAsyncError(async (req, res) => {
  const user = req.user;

  const result = await prisma.user.findUnique({
    where: {
      id: user!.id,
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

  sendResponse(res, {
    data: {
      ...result,
      password: undefined,
      passwordResetToken: undefined,
      passwordResetExpiry: undefined,
    },
    success: true,
    statusCode: 200,
    message: "Author infor retrieved successfully",
  });
});

const updateProfile = catchAsyncError(async (req, res) => {
  const user = req.user;

  if (!user) throw new AppError(404, "User not found");

  const { id } = user;
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) throw new AppError(404, "User not found");

  const result = await prisma.user.update({
    where: { id },
    data: {
      ...req.body,
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: {
      ...result,
      password: undefined,
      passwordResetToken: undefined,
      passwordResetExpiry: undefined,
      otp: undefined,
      otpExpiry: undefined,
    },
    message: "Profile updated successfully",
  });
});

const updateUserProfileImage = catchAsyncError(async (req, res) => {
  const file = req.file;
  const user = req.user!;
  if (!file) {
    return sendResponse(res, {
      message: "file not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }
  const url = file.path;
  if (!url) {
    return sendResponse(res, {
      message: "failed to upload image",
      success: false,
      data: null,
      statusCode: 400,
    });
  }

  const result = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      image: url,
    },
  });

  sendResponse(res, {
    data: result,
    message: "image updated successfully",
    statusCode: 200,
    success: true,
  });
});

const logout = catchAsyncError(async (_req, res) => {
  res.clearCookie("accessToken", {
    path: "/",
    sameSite: "none",
    secure: Config.NODE_ENV === "production" ? true : false,
  });
  res.clearCookie("refreshToken", {
    path: "/",
    sameSite: "none",
    secure: Config.NODE_ENV === "production" ? true : false,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: null,
    message: "User logged out successfully",
  });
});

const refreshToken = catchAsyncError(async (req, res) => {
  const { cookies } = req;
  // const user = req.user

  const { refreshToken } = cookies as {
    refreshToken: string | undefined;
    accessToken: string | undefined;
  };

  if (!refreshToken) {
    throw new AppError(40, "No refresh token provided");
  }

  let userId: null | string = null;

  try {
    const decryptedJwt = jwt.verify(
      refreshToken,
      Config.REFRESH_TOKEN.SECRET as string
    ) as { id: string };
    userId = decryptedJwt.id;
  } catch {
    userId = null;
  }

  if (!userId) {
    throw new AppError(401, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(401, "User not found");
  }

  const accessToken = authUtils.generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role || "",
  });

  // Generate new Access Token
  res.cookie("accessToken", accessToken, {
    sameSite: Config.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: Config.NODE_ENV === "production",
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Token refreshed",
    data: { accessToken },
  });
});

const forgotPassword = catchAsyncError(async (req, res) => {
  const { body } = req;
  const email = body.email;

  if (!email) {
    throw new AppError(400, "Email is required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const token = v4();
  const expiry = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      passwordResetToken: token,
      passwordResetExpiry: expiry,
    },
  });

  const url = `${Config.FRONTEND_URL}/reset-password/${token}`;
  const subject = "Account Password Reset Requested";
  const emailContent = `
      <p style="text-align: center;">
          Hey ${user?.first_name} ${user?.last_name}, please reset your account password by clicking on the link below.<br>
          This link will expire within 5 minutes.
      </p>
      <a href="${url}" style="text-align: center; display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
  `;

  try {
    await sendMessage({
      html: emailContent,
      receiverMail: user.email,
      subject,
    });

    sendResponse(res, {
      success: true,
      statusCode: 200,
      data: null,
      message: "Password reset email sent successfully",
    });
  } catch {
    throw new AppError(500, "Error sending password reset email");
  }
});

const resetPassword = catchAsyncError(async (req, res) => {
  const { password: newPassword, token } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
    },
  });

  if (!user || !user.passwordResetToken || !user.passwordResetExpiry) {
    throw new AppError(404, "User not found or invalid reset token");
  }

  const storedExpiry = new Date(user.passwordResetExpiry).getTime();
  const currentTimestamp = new Date().getTime();

  if (currentTimestamp > storedExpiry) {
    throw new AppError(400, "Link expired");
  }

  const hashedPassword = await authUtils.hashPassword(newPassword);

  await prisma.user.update({
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

  await sendMessage({
    html: `
    <p style="text-align: center;">Hey ${user.first_name} ${user?.last_name}, your account password has been reset successfully.</p>`,
    receiverMail: to,
    subject,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password reset successfully",
    data: null,
  });
});

const changePassword = catchAsyncError(async (req, res) => {
  const body = req.body;
  const userAuth = req.user;
  if (!userAuth) {
    throw new AppError(404, "User not found");
  }
  const { password: newPassword, oldPassword } = body;

  const user = await prisma.user.findUnique({
    where: { id: userAuth.id },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isPasswordMatching = bcrypt.compareSync(oldPassword, user.password!);
  if (!isPasswordMatching) {
    throw new AppError(403, "Unauthorized. Password is incorrect");
  }

  if (newPassword === oldPassword) {
    throw new AppError(
      400,
      "New password cannot be the same as the old password"
    );
  }

  const hashedPassword = await authUtils.hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userAuth.id },
    data: { password: hashedPassword },
  });

  const to = user.email;
  const subject = "Password Changed";
  const emailContent = `
      <p style="text-align: center;">Hey ${user.first_name} ${user.last_name}, your account password has been changed successfully.</p>`;

  await sendMessage({
    html: emailContent,
    receiverMail: to,
    subject,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password changed successfully",
    data: null,
  });
});

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

export default authController;
