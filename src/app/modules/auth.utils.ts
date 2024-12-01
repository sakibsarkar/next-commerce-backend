import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Config from "../config";
interface ITokenPayload {
  id: string;
  email: string;
  role: string;
}

const generateAccessToken = (payload: ITokenPayload) => {
  const { EXPIRY, SECRET = "" } = Config.ACCESS_TOKEN;
  const token = jwt.sign(payload, SECRET, { expiresIn: EXPIRY });
  return token;
};

const generateRefreshToken = (id: string) => {
  const { EXPIRY, SECRET = "" } = Config.REFRESH_TOKEN;
  const token = jwt.sign({ id: id }, SECRET, { expiresIn: EXPIRY });
  return token;
};

const generateOTP = (length = 6) => {
  const otp = crypto
    .randomInt(0, Math.pow(10, length))
    .toString()
    .padStart(length, "0");
  return otp;
};

const verifyAccessToken = (token: string) => {
  const { SECRET = "" } = Config.ACCESS_TOKEN;
  const payload = jwt.verify(token, SECRET);
  return payload;
};
const hashPassword = (password: string) => {
  const hash = bcrypt.hash(password, 10);
  return hash;
};

const authUtils = {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  verifyAccessToken,
  generateOTP,
};

export default authUtils;
