import { Router } from "express";
import { db } from "../db/db.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateId,
} from "../models/validators.js";
import { scope } from "../models/token-model.js";
import { ensureAuthenticate } from "../middleware/auth.js";
import { nodemailerUser } from "../constants.js";
import { transporter } from "../mailer/mailer.js";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", ensureAuthenticate, getUserById); // authenticate still
userRouter.put("/", ensureAuthenticate, updateUser);
userRouter.delete("/", ensureAuthenticate, deleteUser);
userRouter.post("/reset", sendResetEmail);
userRouter.put("/reset", updatePassword);

async function createUser(req: Request, res: Response) {
  console.log("Request body:", req.body);
  if (!req.body) {
    // check to ensure req.body is not undefined
    res.status(400).json({ message: "Request body is missing" });
    return;
  }
  const { email, firstName, lastName, password } = req.body;

  try {
    validateEmail(email);

    validateName(firstName, lastName);

    validatePassword(password);

    const newUser = await db.Models.User.createUser(
      firstName,
      lastName,
      email,
      password
    );
    res.status(201).json(newUser); // 201 = created newUser
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: "Bad request" }); // More specific pattern
    } else {
      res.status(500).json({ message: "Failed to create user" });
    }
  }
}

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  console.log("Request body:", req.body);

  try {
    validateEmail(email);

    validatePassword(password);

    const user = await db.Models.User.getUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    // Debugging: Log retrieved user
    console.log("Retrieved user:", user);

    const verifiedPassword = await bcrypt.compare(password, user.passwordHash);

    if (!verifiedPassword) {
      res.status(401).json({ message: "Credentials invalid" });
      return;
    }

    const plaintext = await db.Models.Tokens.generateAuthenticationToken(
      user.id
    );

    res
      .status(200)
      .json({ message: "User retrieved successfully", token: plaintext });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getUserById(req: Request, res: Response) {
  console.log("Request body:", req.body);
  const userId = req.user!.id;

  try {
    validateId(userId);

    if (!req.params.userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    const user = await db.Models.User.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to get user" });
    }
  }
}

async function updateUser(req: Request, res: Response) {
  console.log("Request body:", req.body);
  const userId = req.user!.id;
  const { email, firstName, lastName, password } = req.body;

  try {
    validateId(userId);

    if (email) validateEmail(email);

    if (password) validatePassword(password);

    if (firstName || lastName) {
      validateName(email!, firstName!);
    }

    const updatedUser = db.Models.User.updateUser(
      userId,
      email,
      firstName,
      lastName,
      password
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to update user" });
    }
  }
}

async function deleteUser(req: Request, res: Response) {
  console.log("Request body:", req.body);
  const userId = req.user!.id;

  try {
    validateId(userId);
    const deletedUserId = db.Models.User.deleteUser(userId);
    res.status(200).json(deletedUserId);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to delete user" }); //
    }
  }
}

async function sendResetEmail(req: Request, res: Response) {
  console.log("Request body:", req.body);
  const email = req.body.email;
  try {
    validateEmail(email);

    const user = await db.Models.User.getUserByEmail(email);

    const resetToken = await db.Models.Tokens.generatePasswordResetToken(
      user.id
    );

    const emailTemplate = {
      from: `"Snippet Box - No Reply" <${nodemailerUser}>`, // sender address
      to: email, // recipient
      subject: "Password Reset - Daw app", // subject line
      text: `We have recieved a request to reset your password.\n\nTo reset your password send a PUT request with your token and new password to /users/reset\n\nYour token is: ${resetToken}\n\nIf you did not make this request, you can safely ignore this email.\n\nSincerely,\nSnippet Box Team`,
      // html:
    };

    const result = await transporter.sendMail(emailTemplate);
    if (!result) {
      res.status(500).json({ message: "Server failed to process request" });
      return;
    }
    res.status(202).json({ message: "Email sent successfully" });
    return;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      res.status(400).json({ message: "Request could not be processed" });
    } else {
      res.status(500).json({ message: "Server failed to process request" });
    }
  }
}

async function updatePassword(req: Request, res: Response) {
  console.log("Request body:", req.body);
  const { token, password } = req.body;

  // checks for presence of user id, and reset token
  if (!token || !password) {
    res
      .status(400)
      .json({ message: "Reset token and new password are required" });
  }
  try {
    // Verify the token and retrieve userId
    const user = await db.Models.Tokens.getUserForToken(
      token,
      scope.PASSWORD_RESET
    );

    // checks if the user Id matches the id, and token sent.
    if (!user) {
      res.status(400).json({ message: "Invalid reset token or user" });
      return;
    }

    // hashes new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password in the database
    await db.Models.User.updatePassword(user.id, hashedPassword);

    res.status(200).json({ message: "Password updated successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update password" });
    return;
  }
}

export default userRouter;
