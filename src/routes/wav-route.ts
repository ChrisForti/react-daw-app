import { Router } from "express";
import { db } from "../db/db.js";
import type { Request, Response } from "express";
import { ensureAuthenticate } from "../middleware/auth.js";
import { WavFile } from "../models/wav-model.js";
// import bcrypt from "bcrypt";

const wavRouter = Router();

type wavControllerBodyParams = {
  id: number;
  fileName: string;
  duration: number;
  format: string;
};

wavRouter.post("/", ensureAuthenticate, createWav);
wavRouter.put("/", ensureAuthenticate, updateWav); // do the conditionals in the model
wavRouter.delete("/", ensureAuthenticate, deleteWav); // do the conditionals in the model

async function createWav(req: Request, res: Response): Promise<any> {
  const { id, fileName, duration, format } =
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

    const snippet = await db.Models.Wavs.createWav(
      id,
      fileName,
      duration,
      format
    );
    res.status(201).json({ snippet });
  } catch (error) {
    console.error("error creating wav file:", error);
    if (error instanceof Error) {
      if ("code" in error && error.code) {
        res.status(400).json({ message: "invalid user id" });
      } else {
        res.status(500).json({ message: "failed to create wav file" });
      }
    }
  }
}

async function updateWav(req: Request, res: Response) {
  const { id, fileName, duration, format } =
    req.body as wavControllerBodyParams;

  try {
    // validations

    const updateWav = await db.Models.Wavs.updateWav(
      id,
      fileName,
      duration as number,
      format
    );

    res.json(updateWav.rows);
    res.status(200).send("wav file updated successfully");
  } catch (error) {
    console.error("error updating wav file:", error);
    res.status(500).send("failed to update wav file");
  }
}

async function deleteWav(req: Request, res: Response) {
  const { wavId } = req.body;
  const userId = req.user!.id;

  try {
    //   validations
    const deleteWav = await db.Models.Wavs.deleteWavByWavId(wavId, userId);

    if (!deleteWav) {
      res.status(404).json({ message: "wav file not found" });
    } else {
      res.json({ message: "wav file successfully deleted" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to delete wav file" });
  }
}

export { wavRouter };

// TODO start with imports, then write validator functions, then routes.
