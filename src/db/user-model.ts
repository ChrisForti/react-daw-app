import assert from "assert";
import pg from "pg";
import bcrypt from "bcrypt";

export class Users {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(!!pool, "Database connection is required");
    this.pool = pool;
  }
  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const emailRx =
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
    try {
      if (!firstName || !lastName) {
        throw new Error("First and last name are required");
      }
      if (firstName.length < 3 || lastName.length < 3) {
        throw new Error(
          "First and last shoud be a minimum of three characters"
        );
      }

      if (!email) {
        throw new Error("Email address is required");
      }
      if (!email.match(emailRx)) {
        throw new Error("Invalid email format");
      }

      if (!password) {
        throw new Error("password is missing");
      }
      if (password.length < 8 || password.length > 32) {
        throw new Error("password must be between 8, and 32 characters");
      }

      // hash password then check for a falsy password hash
      const passwordHash = await bcrypt.hash(password, 10);
      if (!passwordHash) {
        throw new Error("Error hashing the password");
      }

      const sql =
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, created_at";
      const params = [firstName, lastName, email, passwordHash];
      const client = await this.pool.query(sql, params);

      // create user to return
      return {
        id: client.rows[0].id,
        firstName,
        lastName,
        email,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }
}
