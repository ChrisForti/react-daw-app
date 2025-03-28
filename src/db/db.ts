import pg from "pg";
import { Users } from "../models/user-model.js";
import { Tokens } from "../models/token-model.js";
import { connectionString } from "../constants.js";
import { WavFile } from "../models/wav-model.js";

const { Pool } = pg;

export const pool = new Pool({ connectionString });

export const db = {
  Models: {
    Tokens: new Tokens(pool),
    Users: new Users(pool),
    Wavs: new WavFile(pool),
  },
};
