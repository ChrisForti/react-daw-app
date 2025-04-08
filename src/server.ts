import express from "express";
import "dotenv/config";
import userRouter from "./routes/user-route.js";
import { rootRouter } from "./root.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use("/", rootRouter);
app.use("/users", userRouter);

app.get("/hello", (req, res) => {
  console.log(req.user, "This is the user");
  res.json({ serverMessage: "Hello world!" });
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`server running at http://localhost:${PORT}`);
  }
});
