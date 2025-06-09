import express, { Request, Response } from "express";
import { router } from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(cookieParser());
app.use(router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on 3000");
})