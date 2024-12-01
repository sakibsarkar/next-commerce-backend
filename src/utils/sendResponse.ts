import { Response } from "express";

type IResponse<T> = {
  statusCode?: number;
  success: boolean;
  message: string;
  data: T;
  error?: unknown;
  meta?: {
    totalDoc?: number;
    currentPage?: number;
    limit?: number;
  };
};

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode || 200).json({
    success: data.success,
    statusCode: data.statusCode || 200,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};

export default sendResponse;
