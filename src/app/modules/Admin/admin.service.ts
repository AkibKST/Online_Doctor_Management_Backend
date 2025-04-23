import { Admin, Prisma } from "../../../../generated/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import prisma from "../../../sharedUtils/prisma";
import { adminSearchAbleFields } from "./admin.constant";

//get all admin from db with sorting , pagination and filtering
const getAllFromDB = async (params: any, options: any) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  //if searchTerm is present in query params, then add it to the where condition
  // console.log(params);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.AdminWhereInput[] = [];

  // console.log(searchTerm, "searchTerm");
  if (params.searchTerm) {
    andCondition.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //Implementing Filtering on Specific Fields and Values
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  //genarate where condition{} from andCondition[]
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    //where searchTerm contains in name or email
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.admin.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
//--------------------------------------------------

//get single admin by id from db
const getAdminById = async (id: string) => {
  // console.log(id, "id");
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  return result;
};
//--------------------------------------------------

// update the admin by id in db
const updateAdminById = async (id: string, data: Partial<Admin>) => {
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};
//---------------------------------------------------

export const AdminServices = {
  getAllFromDB,
  getAdminById,
  updateAdminById,
};

/**
 * data = 1 2 3 4 5 6 7 8
 * page = 2
 * limit = 2
 * skip
 * formula = (page - 1) * limit
 */
