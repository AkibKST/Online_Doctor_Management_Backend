import prisma from "../../../sharedUtils/prisma";
import bcrypt from "bcrypt";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../../helpers/jwtHelpers";

//Login user service
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
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "secret_Key_For_Access_Token",
    "5m"
  );

  //create refresh token with jwt
  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "secret_Key_For_refresh_Token",
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};
//----------------------------------------------------

//refresh token service
const refreshToken = async (token: string) => {
  console.log(token);
};
//-----------------------------------------------------

export const AuthServices = {
  loginUser,
  refreshToken,
};
