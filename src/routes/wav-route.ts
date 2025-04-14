import { Router } from "express";
import { db } from "../db/db.js";
import type { Request, Response } from "express";
import { ensureAuthenticate } from "../middleware/auth.js";
// import { WavFile } from "../models/wav-model.js";
import {
  validateDuration,
  validateFileName,
  validateFormat,
  validateWavId,
  validateId,
} from "../models/validators.js";
import { WavFile } from "../models/wav-model.js";

const wavRouter = Router();

type wavControllerBodyParams = {
  userId: number;
  wavId: number;
  fileName: string;
  duration: number;
  format: string;
  creationDate: number;
  wavFile: string;
};

wavRouter.post("/", ensureAuthenticate, createWav);
wavRouter.get("/", ensureAuthenticate, getWavById); // probably dont need ensure TODO think about endpoints.
wavRouter.get("/", ensureAuthenticate, getAllWavFilesByUserId);
wavRouter.put("/", ensureAuthenticate, updateWav); // do the conditionals in the model
wavRouter.delete("/", ensureAuthenticate, deleteWav); // do the conditionals in the model

async function createWav(req: Request, res: Response): Promise<any> {
  const { wavId, fileName, duration, format, creationDate, wavFile } =
    req.body as wavControllerBodyParams;
  if (!req.user) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    validateWavId(wavId);

    validateFileName(fileName);

    validateDuration(duration);

    validateFormat(format);

    const newWav = await db.Models.Wavs.createWav(
      wavId,
      fileName,
      duration,
      format,
      creationDate,
      wavFile
    );
    res.status(201).json({ newWav });
  } catch (error) {
    console.error("error creating wav file:", error);
    if (error instanceof Error) {
      if ("code" in error && error.code) {
        res.status(400).json({ message: "invalid wav id" });
      } else {
        res.status(500).json({ message: "failed to create wav file" });
      }
    }
  }
}

async function getWavById(req: Request, res: Response): Promise<void> {
  const wavId = req.params.wavId;

  try {
    validateWavId(Number(wavId));

    if (!req.params.wavId) {
      res.status(400).json({ message: "wav id is required" });
      return;
    }
    const user = await db.Models.Wavs.getWavById(Number(wavId));
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to get wav" });
    }
  }
}

async function getAllWavFilesByUserId(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user!.id;

  try {
    validateId(userId);

    const wavs = await db.Models.Wavs.getAllWavFilesByUserId(userId);
    if (!wavs || wavs.length === 0) {
      res.status(404).json({ message: "No wav files found for this user" });
      return;
    }

    res.json(wavs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to retrieve wavs" });
    if (error instanceof Error && error.message === "wavs not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to retrieve wavs" });
    }
  }
}

async function updateWav(req: Request, res: Response) {
  const { wavId, fileName, duration, format, wavFile } =
    req.body as wavControllerBodyParams;

  try {
    validateWavId(wavId);

    validateFileName(fileName);

    validateDuration(duration);

    validateFormat(format);

    const updateWav = await db.Models.Wavs.updateWav(
      wavId,
      fileName,
      duration,
      format,
      wavFile
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

// TODO finish CRUD operations.
