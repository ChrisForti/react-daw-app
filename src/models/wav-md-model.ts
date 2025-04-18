import type pg from "pg";
import assert from "assert";

export class WavMetadata {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(!!pool, "Database connection required");
    this.pool = pool;
  }

  async createWavMetadata(
    id: number,
    fileName: string,
    title: string,
    artist: string,
    album: string,
    genre: string,
    duration: string,
    sampleRate: string,
    bitDepth: number,
    fileSize: string,
    creationDate: number,
    comments: string
  ) {
    const result = await this.pool.query(
      `INSERT INTO wav_metadata (file_name, title, artist, album, genre, duration, sample_rate, bit_depth, file_size, comments)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        fileName,
        title,
        artist,
        album,
        genre,
        duration,
        sampleRate,
        bitDepth,
        fileSize,
        creationDate,
        comments,
      ]
    );
    return result.rows[0];
  }

  async updateWavMetadata(
    id: number,
    fileName: string,
    title: string,
    artist: string,
    album: string,
    genre: string,
    duration: string,
    sampleRate: string,
    bitDepth: number,
    fileSize: string,
    creationDate: number,
    comments: string
  ) {
    const result = await this.pool.query(
      `UPDATE wav_metadata SET file_name = $1, title = $2, artist = $3, album = $4, genre = $5, duration = $6, sample_rate = $7, bit_depth = $8, file_size = $9, comments = $10
       WHERE id = $11 RETURNING *`,
      [
        id,
        fileName,
        title,
        artist,
        album,
        genre,
        duration,
        sampleRate,
        bitDepth,
        fileSize,
        creationDate,
        comments,
      ]
    );
    return result.rows[0];
  }

  async deleteWavMetadata(id: number) {
    await this.pool.query(`DELETE FROM wav_metadata WHERE id = $1`, [id]);
  }
}
