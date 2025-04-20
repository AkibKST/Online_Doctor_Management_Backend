import { PrismaClient, UserRole } from "../../../../generated/prisma";

const prisma = new PrismaClient();

// Function to create an admin user
const createAdmin = async (data: any) => {
  const userData = {
    email: data.admin.email,
    password: data.password,
    role: UserRole.ADMIN,
  };

  //create user and admin in a transaction
  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: data.admin,
    });

    return console.log(createdAdminData);
  });
  //-------------------------------------------------

  return result;
};

export const UserServices = {
  createAdmin,
};
