import type pg from "pg";
import assert from "assert";

export class Wavs {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(!!pool, "Database connection is required");
    this.pool = pool;
  }

  async createWav(
    wavId: number,
    fileName: string,
    duration: number,
    format: string,
    metadata: string
  ) {
    const sql =
      "INSERT INTO snippets (title, expiration_date, user_id, content) VALUES ($1, $2, $3, $4) RETURNING id";
    const params = [wavId, fileName, duration, format, metadata];
    const newWav = await this.pool.query(sql, params);

    return {
      id: newWav.rows[0].id,
      wavId,
      fileName,
      duration,
      format,
      metadata,
    };
  }
  catch(error: unknown) {
    console.error(error);
    return null;
  }

  async deleteWavByWavId(wavId: number, userId: number) {
    const sql = "DELETE FROM snippets WHERE id = $1 and user_id = $2";

    try {
      const result = await this.pool.query(sql, [wavId, userId]);
      if (result.rowCount === 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
