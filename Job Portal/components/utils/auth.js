import { hashPassword } from "./hash.js";
export async function verifyPassword(user, password) {
    const hashed = await hashPassword(password);
    return user.passwordHash === hashed;
}
