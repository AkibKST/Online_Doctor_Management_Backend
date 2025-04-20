import { Request, Response } from "express";
import { UserServices } from "./user.service";
import catchAsync from "../../../sharedUtils/catchAsync";
import sendResponse from "../../../sharedUtils/sendResponse";
import httpStatus from "http-status";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Created successfully!",
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
};
