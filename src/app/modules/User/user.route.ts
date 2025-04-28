import express, { Request, Response } from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../../../generated/prisma";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserControllers.createAdmin
);

export const UserRoutes = router;
