// import catchAsyncError from '../util/catchAsyncError'
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import catchAsyncError from "../../utils/catchAsyncError";
import { isTokenExpired } from "../../utils/jwtToken";
import Config from "../config";
import prisma from "../config/prisma";
import AppError from "../errors/AppError";
import authUtils from "../modules/auth/auth.utils";

const isAuthenticateUser = catchAsyncError(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new AppError(403, "Unauthorized");
  }

  if (!accessToken || isTokenExpired(accessToken)) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(404, "Refresh token is missing");
    }

    const decryptedJwt = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string };

    const result = await prisma.user.findUnique({
      where: {
        id: decryptedJwt.id,
      },
    });

    const newAccessToken = authUtils.generateAccessToken({
      id: result?.id || "",
      email: result?.email || "",
      role: result?.role || "",
    });

    const newRefreshToken = authUtils.generateRefreshToken(
      decryptedJwt?.id?.toString() || ""
    );

    res
      .cookie("accessToken", newAccessToken, {
        sameSite: "none",
        maxAge: 1000 * 24 * 60 * 60 * 30,
        httpOnly: true,
        secure: Config.NODE_ENV === "production" ? true : false,
      })
      .cookie("refreshToken", newRefreshToken, {
        sameSite: "none",
        maxAge: 1000 * 24 * 60 * 60 * 30,
        httpOnly: true,
        secure: Config.NODE_ENV === "production" ? true : false,
      });

    const isExistUsr = await prisma.user.findUnique({
      where: {
        id: decryptedJwt.id,
      },
    });
    if (!isExistUsr) {
      throw new AppError(403, "Unauthorized");
    }

    const pay = {
      id: isExistUsr.id,
      email: isExistUsr.email,
      role: isExistUsr.role,
    };

    req.user = pay;
  }

  if (accessToken && !isTokenExpired(accessToken)) {
    const payload = authUtils.verifyAccessToken(accessToken);
    if (!payload) {
      throw new AppError(403, "Unauthorized");
    }
    const { id } = payload as { id: string; email: string; role: string };
    const isExistUsr = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!isExistUsr) {
      throw new AppError(403, "Unauthorized");
    }

    const pay = {
      id: isExistUsr.id,
      email: isExistUsr.email,
      role: isExistUsr.role,
    };

    req.user = pay;
  }

  next();
});
const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new AppError(
          403,
          `User type: ${req.user?.role} is not allowed to access this resouce `
        )
      );
    }
    next();
  };
};
export default {
  isAuthenticateUser,
  authorizeRoles,
};
