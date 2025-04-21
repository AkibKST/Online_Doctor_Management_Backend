import { NextFunction, Request, RequestHandler, Response } from "express";
import catchAsync from "../../../sharedUtils/catchAsync";
import { AdminServices } from "./admin.service";
import sendResponse from "../../../sharedUtils/sendResponse";
import httpStatus from "http-status";
import pick from "../../../sharedUtils/pick";

//get all admin data from DB
const getAllFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    //Selecting Valid Data Fields Using the pick Function
    pick(req.query, ["name", "email", "searchTerm", "contactNumber"]);
    // console.log(req.query);

    const result = await AdminServices.getAllFromDB(req.query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched!",
      data: result,
    });
  }
);
//--------------------------------------

export const AdminControllers = {
  getAllFromDB,
};
