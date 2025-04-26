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
    "secretKey",
    {
      algorithm: "HS256",
      expiresIn: "15m",
    }
  );

  console.log(accessToken);
};

export const AuthServices = {
  loginUser,
};
