import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../sharedUtils/catchAsync";
import { AdminServices } from "./admin.service";
import sendResponse from "../../../sharedUtils/sendResponse";
import httpStatus from "http-status";
import pick from "../../../sharedUtils/pick";
import { adminSearchAbleFields } from "./admin.constant";

//get all admin data from DB
const getAllFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    //Selecting Valid Data Fields Using the pick Function
    const filters = pick(req.query, adminSearchAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    // console.log(options, "options");

    const result = await AdminServices.getAllFromDB(filters, options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched!",
      meta: result.meta,
      data: result.data,
    });
  }
);
//--------------------------------------

//Get single admin data by id from database
const getAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // console.log(req.params.id, "id");
    const result = await AdminServices.getAdminById(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched!",
      data: result,
    });
  }
);
//--------------------------------------

// update the admin by id in db
const updateAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id, "id", req.body, "body");
    // console.log(req.params.id, "id");
    const result = await AdminServices.updateAdminById(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Updated Admin data successfully!",
      data: result,
    });
  }
);
//--------------------------------------

export const AdminControllers = {
  getAllFromDB,
  getAdminById,
  updateAdminById,
};
