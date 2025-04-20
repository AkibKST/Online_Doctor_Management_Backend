import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

const getAllFromDB = async (params: any) => {
  const result = await prisma.admin.findMany({
    //where searchTerm contains in name or email
    where: {
      OR: [
        {
          name: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return result;
};

export const AdminServices = {
  getAllFromDB,
};
