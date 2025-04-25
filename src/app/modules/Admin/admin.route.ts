import express from "express";
import { AdminControllers } from "./admin.controller";
import validateRequest from "../../middleware/validateRequest";
import { adminValidationSchemas } from "./admin.validation";

const router = express.Router();

router.get("/", AdminControllers.getAllFromDB);

router.get("/:id", AdminControllers.getAdminById);

router.patch(
  "/:id",
  validateRequest(adminValidationSchemas.update),
  AdminControllers.updateAdminById
);

router.delete("/:id", AdminControllers.deleteAdminById);

router.delete("/soft/:id", AdminControllers.softDeleteAdminById);

export const AdminRoutes = router;
