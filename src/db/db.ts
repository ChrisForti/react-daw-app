import pg from "pg";
import { User } from "../models/user-model.js";
import { Tokens } from "../models/token-model.js";
import { connectionString } from "../constants.js";
import { WavFile } from "../models/wav-model.js";
import { WavMetadata } from "../models/wav-md-model.js";

const { Pool } = pg;

export const pool = new Pool({ connectionString });

export const db = {
  Models: {
    Tokens: new Tokens(pool),
    User: new User(pool),
    Wavs: new WavFile(pool),
    WavMd: new WavMetadata(pool),
  },
};
