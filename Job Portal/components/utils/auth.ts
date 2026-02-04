import { hashPassword } from "./hash.js";
import { IUser } from "../models/types.js";

export async function verifyPassword(user: IUser, password: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return user.passwordHash === hashed;
}
