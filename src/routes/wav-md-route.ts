// src/routes/wav-metadata-routes.ts
import express, { Router } from "express";
import { db } from "../db/db.js";
import type { Request, Response } from "express";

const wavMdRouter = Router();

wavMdRouter.post("/", createWavMetadata);

async function createWavMetadata(req: Request, res: Response): Promise<void> {
  const {
    id,
    fileName,
    title,
    artist,
    album,
    genre,
    duration,
    sampleRate,
    bitdepth,
    fileSize,
    creationDate,
    comments,
  } = req.body;

  try {
    // validations

    const newWavMetadata = await db.Models.WavMd.createWavMetadata(
      id,
      fileName,
      title,
      artist,
      album,
      genre,
      duration,
      sampleRate,
      bitdepth,
      fileSize,
      creationDate,
      comments
    );
    res.status(201).json(newWavMetadata); // 201 = created new data
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: "Bad request" }); // More specific pattern
    } else {
      res.status(500).json({ message: "Failed to create new data" });
    }
  }
}

// // Route to update existing WAV metadata
// router.put("/wav-metadata/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id, 10);
//     const metadata: WavMetadataType = { ...req.body, id };
//     const result = await wavMetadataModel.updateWavMetadata(metadata);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });

export default wavMdRouter;
