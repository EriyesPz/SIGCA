import express, { Request, Response } from "express";
import { router } from "./routes";
import { meRouter } from "./me";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));
app.use(cookieParser());
app.use(router);
app.use(meRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on 3000");
})