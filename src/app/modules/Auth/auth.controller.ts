import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../sharedUtils/sendResponse";
import catchAsync from "../../../sharedUtils/catchAsync";
import { AuthServices } from "./auth.service";

//login the user in db
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: result,
  });
});
//----------------------------------------------------

export const AuthController = {
  loginUser,
};
