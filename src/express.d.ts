import type { User } from "./models/user-model.ts"; // Replace with the actual user type

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; name: string; email: string }; // Replace `any` with the actual user type
    }
  }
}
