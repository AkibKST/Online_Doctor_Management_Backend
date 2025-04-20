import { create } from "domain";

const createAdmin = async () => {
  return {
    message: "Admin created successfully",
  };
};

export const UserServices = {
  createAdmin,
};
