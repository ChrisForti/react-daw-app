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
      "INSERT INTO Wavs (wav_id, file_name, duration, format, meta_data) VALUES ($1, $2, $3, $4) RETURNING id";
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

  async getWavById(wavId: number) {
    try {
      const sql = "SELECT * FROM snippets WHERE wav_id = $1";

      const result = await this.pool.query(sql, [wavId]);

      return result.rows[0];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async updateWav(
    // need to
    wavId: string,
    title: string,
    content: string,
    expirationDate: string
  ) {
    try {
      // Retrieve the existing wav to get default field values if needed
      const wavQuery = `
      SELECT title, content, expiration_date 
      FROM wavs 
      WHERE wav_id = $1`;

      // Then process the query plus any default field values
      const wav = (await this.pool.query(wavQuery, [wavId])).rows[0];
      const sql = `
      UPDATE wavs
      SET title = $1, content = $2, expiration_date = $3
      WHERE wav_id = $4`;

      const args = [
        wavId,
        title ?? wav.title,
        content ?? wav.content,
        expirationDate ?? wav.expiration_date,
      ];

      const updateResult = await this.pool.query(sql, args);
      if (updateResult.rows.length === 0) {
        console.error("wav not found");
      } else {
        return updateResult.rows[0];
      }
    } catch (error) {
      console.error(error);
      return "wav updated successfully";
    }
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
