import { Response, CookieOptions } from "express";

interface ExtendedCookieOptions extends CookieOptions {
  sameSite?: "strict" | "lax" | "none" | boolean;
}

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: ExtendedCookieOptions = {}
): void => {
  const isProduction = process.env.NODE_ENV === "production";

  const defaultOptions: ExtendedCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: isProduction ? "none" : "lax",
  };

  if (isProduction) {
    defaultOptions.secure = true;
  }

  const cookieOptions: ExtendedCookieOptions = {
    ...defaultOptions,
    ...options,
  };

  res.cookie(name, value, cookieOptions);
};

export default setCookie;
