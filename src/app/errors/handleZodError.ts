import { ZodError } from "zod";
import { IErrorSources, IGenericErrorRes } from "../interface/error";

const handleZodError = (err: ZodError): IGenericErrorRes => {
  const errorSources: IErrorSources = err.errors.map((error) => {
    return { path: error.path.join("."), message: error.message };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Data format validation Error",
    errorSources,
  };
};

export default handleZodError;
