import { NextFunction, Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
interface IUserInfoRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

type THandelerFunc = (
  req: IUserInfoRequest,
  res: Response,
  next: NextFunction
) => void;

const catchAsyncError = (fn: THandelerFunc) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as IUserInfoRequest, res, next)).catch((err) =>
      next(err)
    );
  };
};

export default catchAsyncError;
