import pg from "pg";
import { Users } from "../models/user-model.js";
import { connectionString } from "../constants.js";

const { Pool } = pg;

export const pool = new Pool({ connectionString });

export const db = {
  Models: {
    Users: new Users(pool),
  },
};
