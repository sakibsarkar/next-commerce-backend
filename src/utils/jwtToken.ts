import jwt from "jsonwebtoken";

export interface ITokenPayload {
  email: string;
  role: string;
  id: string;
}
export const createAcessToken = (user: ITokenPayload, expires: string) => {
  console.log(process.env.JWT_REFRESH_SECRET);

  return jwt.sign({ user }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: expires,
  });
};
export const createRefreshToken = (user: object) => {
  return jwt.sign({ user }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "30 days",
  });
};
export const isTokenExpired = (token: string) => {
  if (!token) {
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decodedToken: any = jwt.decode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};
