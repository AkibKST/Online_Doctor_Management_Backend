import prisma from "../../../sharedUtils/prisma";
import bcrypt from "bcrypt";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  // Check if the password is correct
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  //create access token with jwt
  const accessToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "secretKeyForAccessToken",
    {
      algorithm: "HS256",
      expiresIn: "5m",
    }
  );

  //create refresh token with jwt
  const refreshToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "secret_Key_For_Refresh_Token",
    {
      algorithm: "HS256",
      expiresIn: "7d",
    }
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
};
