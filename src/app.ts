import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/User/user.route";

const app: Application = express();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "PH Healthcare server...",
  });
});

app.use("/api/v1/user", UserRoutes);

export default app;
