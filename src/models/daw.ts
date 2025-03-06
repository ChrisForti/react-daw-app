import type pg from "pg";
import assert from "assert";

export class Daws {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(!!pool, "Database connection is required");
    this.pool = pool;
  }
}
