import type pg from "pg";
import assert from "assert";

export class WavFile {
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
    creationDate: number
    // need a file for data TODO
  ) {
    const sql =
      "INSERT INTO Wav-file (wav_id, file_name, duration, format, creation_date) VALUES ($1, $2, $3, $4, 5$) RETURNING id";
    const params = [wavId, fileName, duration, format, creationDate];
    const newWav = await this.pool.query(sql, params);

    return {
      id: newWav.rows[0].id,
      wavId,
      fileName,
      duration,
      format,
      creationDate,
    };
  }
  catch(error: unknown) {
    console.error(error);
    return null;
  }

  async getWavById(wavId: number) {
    try {
      const sql = "SELECT * FROM wavs WHERE wav_id = $1";

      const result = await this.pool.query(sql, [wavId]);

      return result.rows[0];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async updateWav(
    id: number,
    fileName: string,
    duration: number,
    format: string
  ) {
    try {
      // Retrieve the existing wav to get default field values if needed
      const wavQuery = `
      SELECT file_name, duration, format
      FROM wavs 
      WHERE wav_id = $1`;

      // Then process the query plus any default field values
      const wav = (await this.pool.query(wavQuery, [id])).rows[0];
      const sql = `
      UPDATE wavs
      SET file_name = $1, duration = $2, format = $3
      WHERE wav_id = $4`;

      const args = [
        id,
        fileName ?? wav.fileName,
        duration ?? wav.duration,
        format ?? wav.format,
      ];

      const updateResult = await this.pool.query(sql, args);
      if (updateResult.rows.length === 0) {
        console.error("wav not found");
      } else {
        return updateResult.rows[0];
      }
    } catch (error) {
      console.error(error);
      return "Wav updated successfully.";
    }
  }

  async deleteWavByWavId(wavId: number, userId: number) {
    const sql = "DELETE FROM wavs WHERE wav_id = $1 and user_id = $2";

    try {
      const result = await this.pool.query(sql, [wavId, userId]);
      if (result.rowCount === 0) {
        return null;
      } else {
        return "Wav deleted successfully.";
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
