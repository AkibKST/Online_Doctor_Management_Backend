import { UserRole } from "../../../../generated/prisma";
import bcrypt from "bcrypt";
import prisma from "../../../sharedUtils/prisma";

// Function to create an admin user
const createAdmin = async (data: any) => {
  //hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);
  //   console.log({ hashedPassword });

  //create user data
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
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

    return createdAdminData;
  });
  //-------------------------------------------------

  return result;
};

export const UserServices = {
  createAdmin,
};
