import { Router } from "express";
import { db } from "../db/db.js";
import type { Request, Response } from "express";
import { ensureAuthenticated } from "../middleware/auth.js";
import bcrypt from "bcrypt";

const userRouter = Router();

userRouter.post("/", createWav);
userRouter.put("/", ensureAuthenticated, updateWav);
userRouter.delete("/", ensureAuthenticated, deleteWav);

async function createWav(req: Request, res: Response) {
  const { wavId, fileName, duration, format, metadata } = req.body;
}

// TODO start with imports, then write validator functions, then routes.
