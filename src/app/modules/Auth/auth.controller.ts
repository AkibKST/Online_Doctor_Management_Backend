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

//refresh token controller
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generated successfully!",
    data: result,
    // data: {
    //     accessToken: result.accessToken,
    //     needPasswordChange: result.needPasswordChange
    // }
  });
});
//-----------------------------------------------------

//change password controller
const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    const result = await AuthServices.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Changed successfully",
      data: result,
    });
  }
);
//---------------------------------------------------

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
};
