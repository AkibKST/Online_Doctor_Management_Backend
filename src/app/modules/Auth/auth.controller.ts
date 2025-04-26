import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../sharedUtils/sendResponse";
import catchAsync from "../../../sharedUtils/catchAsync";
import { AuthServices } from "./auth.service";

//login the user in db
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  // set refresh token in cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Logged in successfully!",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});
//----------------------------------------------------

export const AuthController = {
  loginUser,
};
