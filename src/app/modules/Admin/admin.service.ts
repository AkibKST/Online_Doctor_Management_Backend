import { Admin, Prisma, UserStatus } from "../../../../generated/prisma";
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

  //for filtering soft deleted admins
  andCondition.push({
    isDeleted: false,
  });

  //generate where condition{} from andCondition[]
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
const getAdminById = async (id: string): Promise<Admin | null> => {
  // console.log(id, "id");
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};
//--------------------------------------------------

// update the admin by id in db
const updateAdminById = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};
//---------------------------------------------------

// delete the admin by id in db
const deletedAdminById = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });

  return result;
};
//---------------------------------------------------

// soft delete the admin by id in db
const softDeletedAdminById = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });

  return result;
};
//---------------------------------------------------

export const AdminServices = {
  getAllFromDB,
  getAdminById,
  updateAdminById,
  deletedAdminById,
  softDeletedAdminById,
};

/**
 * data = 1 2 3 4 5 6 7 8
 * page = 2
 * limit = 2
 * skip
 * formula = (page - 1) * limit
 */
