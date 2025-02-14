import { Router } from "express";
import { db } from "../db/db.js";
import type { Request, Response } from "express";
// import bcrypt from "bcrypt";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "./models/validators.js";

const userRouter = Router();

userRouter.post("/", createUser);

async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;

  try {
    validateName(firstName, lastName);

    validateEmail(email);

    validatePassword(password);

    const newUser = await db.Models.Users.createUser(
      email,
      firstName,
      lastName,
      password
    );
    res.status(201).json(newUser); // 201 = created newUser
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: "Bad request" }); // More specific pattern
    } else {
      res.status(500).json({ message: "Failed to create user" });
    }
  }
}

export { userRouter };
