import { Prisma, PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

const getAllFromDB = async (params: any) => {
  //if searchTerm is present in query params, then add it to the where condition
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.AdminWhereInput[] = [];
  const adminSearchAbleFields = ["name", "email"];

  // console.log(filterData, "filterData");
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
          equals: filterData[key],
        },
      })),
    });
  }

  //genarate where condition{} from andCondition[]
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    //where searchTerm contains in name or email
    where: whereCondition,
  });
  return result;
};

export const AdminServices = {
  getAllFromDB,
};
