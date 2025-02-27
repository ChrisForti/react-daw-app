import { Router } from "express";
import { db } from "./db/db.js";
import type { Request, Response } from "express";
// import bcrypt from "bcrypt";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateId,
} from "./models/validators.js";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.get("/", getUserById); // authenticate still

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

async function getUserById(req: Request, res: Response) {
  const userId = req.user!.id;

  try {
    validateId(userId);

    if (!req.params.userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    const user = await db.Models.Users.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to get user" });
    }
  }
}

export { userRouter };
