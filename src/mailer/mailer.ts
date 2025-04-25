import { createTransport } from "nodemailer";
import { nodemailerPassword, nodemailerUser } from "../constants.js";

export const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: nodemailerUser,
    pass: nodemailerPassword,
  },
});

// This is for logging, due to my node mailer issue.
await transporter.sendMail({
  from: '"Your App" <.com>',
  to: "user@example.com",
  subject: "Password Reset",
  text: "Here is your password reset link...",
});
