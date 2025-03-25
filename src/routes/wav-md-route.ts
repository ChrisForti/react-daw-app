// src/routes/wav-metadata-routes.ts
import express from "express";
import { Pool } from "pg";
import { WavMetadata } from "../models/wav-md-model.js";
import type { WavMetadataType } from "../models/wav-md-model.js";

const router = express.Router();
const pool = new Pool({
  user: "your_db_user",
  host: "your_db_host",
  database: "your_db_name",
  password: "your_db_password",
  port: 5432,
});

const wavMetadataModel = new WavMetadata(pool);

// Route to create new WAV metadata
router.post("/wav-metadata", async (req, res) => {
  try {
    const metadata: WavMetadataType = req.body;
    const result = await wavMetadataModel.createWavMetadata(metadata);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Route to update existing WAV metadata
router.put("/wav-metadata/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const metadata: WavMetadataType = { ...req.body, id };
    const result = await wavMetadataModel.updateWavMetadata(metadata);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
