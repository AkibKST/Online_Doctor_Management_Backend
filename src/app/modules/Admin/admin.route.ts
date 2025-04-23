import express from "express";
import { AdminControllers } from "./admin.controller";

const router = express.Router();

router.get("/", AdminControllers.getAllFromDB);

router.get("/:id", AdminControllers.getAdminById);

router.patch("/:id", AdminControllers.updateAdminById);

export const AdminRoutes = router;
