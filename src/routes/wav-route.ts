import { Router } from "express";
import { db } from "../db/db.js";
import type { Request, Response } from "express";
import { ensureAuthenticate } from "../middleware/auth.js";
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
userRouter.put("/", ensureAuthenticate, updateWav); // do the conditionals in the model
userRouter.delete("/", ensureAuthenticate, deleteWav); // do the conditionals in the model

async function createWav(req: Request, res: Response) {
  const { wavId, fileName, duration, format, metaData } =
    req.body as wavControllerBodyParams;
  if (!req.user) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const userId = req.user.id;

  try {
    // validateTitle(title);

    // validateContent(content);

    // validateExperationDate(expirationDate);

    // validateId(userId);

    const snippet = await db.Models.Wavs.createSnippet(
      wavId,
      fileName,
      duration,
      format,
      metaData
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

    async function updateWav(req: Request, res: Response) {
      const { snippetId } = req.params;

      const { wavId, fileName, duration, format, metaData } =
        req.body as wavControllerBodyParams;

      try {
        // validateSnippetId(snippetId);

        const updateSnippet = await db.Models.Wavs.updateSnippet(
          wavId,
          fileName,
          duration,
          format,
          metaData
        );

        res.json(updateSnippet.rows);
        res.status(200).send("snippet updated successfully");
      } catch (error) {
        console.error("error updating snippet:", error);
        res.status(500).send("failed to update snippet");
      }
    }
  }
}

// TODO start with imports, then write validator functions, then routes.
