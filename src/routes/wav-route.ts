import { Router } from "express";
import { db } from "../db/db.js";
import type { Request, Response } from "express";
import { ensureAuthenticated } from "../middleware/auth.js";
import bcrypt from "bcrypt";

const userRouter = Router();

type wavControllerBodyParams = {
  wavId: string;
  fileName: string;
  duration: string;
  format: string;
  metaData: string;
};

userRouter.post("/", createWav);
userRouter.put("/", ensureAuthenticated, updateWav);
userRouter.delete("/", ensureAuthenticated, deleteWav);

async function createWav(req: Request, res: Response) {
  const { wavId, fileName, duration, format, metaData } =
    req.body as wavControllerBodyParams;
  if (!req.user) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const userId = req.user.id;

  try {
    validateTitle(title);

    validateContent(content);

    validateExperationDate(expirationDate);

    validateId(userId);

    const snippet = await db.Models.Snippets.createSnippet(
      title,
      content,
      expirationDate,
      userId
    );
    res.status(201).json({ snippet });
  } catch (error) {
    console.error("error creating snippet:", error);
    if (error instanceof Error) {
      if ("code" in error && error.code) {
        res.status(400).json({ message: "invalid user id" });
      } else {
        res.status(500).json({ message: "failed to create snippet" });
      }
    }
  }
}

// TODO start with imports, then write validator functions, then routes.
