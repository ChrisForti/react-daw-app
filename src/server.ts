import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use("/users", userRouter);

app.get("/hello", (req, res) => {
  console.log(req.user, "This is the user");
  res.json({ serverMessage: "Hello world!" });
});

import { rootRouter } from "./routes/root.js";
import { userRouter } from "./routes/user.js";

app.use("/", rootRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`server running at http://localhost:${PORT}`);
  }
});
