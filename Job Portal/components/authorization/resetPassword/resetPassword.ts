import { STORAGE_KEYS, MESSAGES } from "../../../constant.js";
import { getFromStorage, saveSession } from "../../utils/storage.js";
import { hashPassword } from "../../utils/hash.js";
import { User } from "../../models/types.js";

const resetForm = document.getElementById("resetForm") as HTMLFormElement | null;

if (!resetForm) {
  console.error("Reset form not found!");
} else {
  resetForm.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const newPasswordInput = document.getElementById("newPassword") as HTMLInputElement | null;
    const confirmPasswordInput = document.getElementById("confirmPassword") as HTMLInputElement | null;

    if (!emailInput || !newPasswordInput || !confirmPasswordInput) return;

    const email = emailInput.value.trim();
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!email || !newPassword || !confirmPassword) return alert(MESSAGES.FILL_ALL);
    if (!email.includes("@")) return alert(MESSAGES.INVALID_EMAIL);
    if (newPassword.length < 6) return alert(MESSAGES.PASSWORD_SHORT);
    if (newPassword !== confirmPassword) return alert("Passwords do not match!");

    const users: User[] = getFromStorage<User[]>(STORAGE_KEYS.USER) || [];
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      alert("Email not found! Please register first.");
      return;
    }

    const user = users[userIndex];

    if (user.isLocked === undefined) user.isLocked = false;
    if (user.loginAttempts === undefined) user.loginAttempts = 0;

    const newHashedPassword = await hashPassword(newPassword);
    user.passwordHash = newHashedPassword;

    user.loginAttempts = 0;
    user.isLocked = false;

    users[userIndex] = user;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(users));

    alert("Password reset successfully! Redirecting to login page...");

    window.location.href = "../login/login.html";

    resetForm.reset();
  });
}
