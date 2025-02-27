import { assert } from "console";
import { createHash, randomBytes } from "crypto";
import type pg from "pg";

export enum scope {
  AUTHENTICATION = "authentication",
  PASSWORD_RESET = "password",
}

export class Tokens {
  pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(pool, "pool is required");
    this.pool = pool;
  }

  async generateAuthenticationToken(userId: number) {
    const plaintext = randomBytes(32).toString("base64url");
    const hash = createHash("sha256").update(plaintext).digest("hex");
    const expiry = Math.trunc(Date.now() / 1000) + 60 * 60 * 24 * 30;

    const sql =
      "INSERT into tokens (hash, expiry, user_id, scope)VALUES ($1, $2, $3, $4)";
    const params = [hash, expiry, userId, scope.AUTHENTICATION];
    await this.pool.query(sql, params);

    return plaintext;
  }

  async generatePasswordResetToken(userId: number) {
    const plaintext = randomBytes(32).toString("base64url");
    const hash = createHash("sha256").update(plaintext).digest("hex");
    const expiry = Math.trunc(Date.now() / 1000) + 60 * 60;

    const sql =
      "INSERT into tokens (hash, expiry, user_id, scope)VALUES ($1, $2, $3, $4)";
    const params = [hash, expiry, userId, scope.PASSWORD_RESET];
    await this.pool.query(sql, params);

    return plaintext;
  }

  async getUserForToken(token: string, scope: string) {
    // Hash the provided token
    const hash = createHash("sha256").update(token).digest("hex");

    const sql = `
        SELECT users.id, users.first_name, users.last_name, users.email, users.email_verified 
        FROM users
        INNER JOIN tokens ON users.id = tokens.user_id
        WHERE tokens.hash = $1 AND tokens.expiry > $2 
        AND tokens.scope = $3
      `;

    // Use current timestamp to ensure token is not expired
    const expiry = Math.trunc(Date.now() / 1000);
    const params = [hash, expiry, scope];

    // Execute the query
    const result = await this.pool.query(sql, params);

    // Return user data if found, otherwise return null
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }
}
