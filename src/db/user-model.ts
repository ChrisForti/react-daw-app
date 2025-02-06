import assert from "assert";
import { Pool } from "pg";

export class Users {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(!!pool, "Database connection is required");
    this.pool = pool;
  }
}
