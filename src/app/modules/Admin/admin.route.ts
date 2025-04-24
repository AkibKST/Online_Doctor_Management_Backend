import express from "express";
import { AdminControllers } from "./admin.controller";

const router = express.Router();

router.get("/", AdminControllers.getAllFromDB);

router.get("/:id", AdminControllers.getAdminById);

router.patch("/:id", AdminControllers.updateAdminById);

router.delete("/:id", AdminControllers.deleteAdminById);

router.delete("/soft/:id", AdminControllers.softDeleteAdminById);

export const AdminRoutes = router;
