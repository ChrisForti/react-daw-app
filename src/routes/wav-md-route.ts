import { Router } from "express";
import { db } from "../db/db.js";
import type { Request, Response } from "express";
import { ensureAuthenticate } from "../middleware/auth.js";

const wavMdRouter = Router();

export type WavMetadataType = {
  id: number;
  fileName: string;
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  duration?: number;
  sampleRate?: number;
  bitDepth?: number;
  fileSize?: number;
  creationDate?: Date;
  lastModifiedDate?: Date;
  comments?: string;
};
