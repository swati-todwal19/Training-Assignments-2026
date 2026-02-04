import { STORAGE_KEYS, MESSAGES } from "../../../constant.js";
import { getFromStorage, saveSession, getSession, saveToStorage } from "../../utils/storage.js";
import { hashPassword } from "../../utils/hash.js";
import { User } from "../../models/types.js";

const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;
const goToRegister = document.getElementById("goToRegister") as HTMLAnchorElement | null;

const MAX_LOGIN_ATTEMPTS = 3;

const currentUser = getSession<User>(STORAGE_KEYS.TOKEN);
if (currentUser) {
  window.location.href = "../../../index.html";
}

loginForm?.addEventListener("submit", async (event: Event) => {
  event.preventDefault();

  const emailInput = document.getElementById("email") as HTMLInputElement | null;
  const passwordInput = document.getElementById("password") as HTMLInputElement | null;

  if (!emailInput || !passwordInput) {
    alert("Form inputs not found!");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) return alert(MESSAGES.FILL_ALL);
  if (!email.includes("@")) return alert(MESSAGES.INVALID_EMAIL);
  if (password.length < 6) return alert(MESSAGES.PASSWORD_SHORT);

  const users: User[] = getFromStorage<User[]>(STORAGE_KEYS.USER) || [];
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    alert(MESSAGES.LOGIN_FAIL);
    return;
  }

  const user = users[userIndex];

  user.loginAttempts ??= 0;
  user.isLocked ??= false;

  if (user.isLocked) {
    alert("Account locked! Please reset your password.");
    return;
  }

  if (!user.isVerified) {
    alert("Please verify your email before login.");
    return;
  }

  const hashedPassword = await hashPassword(password);

  if (user.passwordHash === hashedPassword) {
    user.loginAttempts = 0;
    user.isLocked = false;

    users[userIndex] = user;
    saveToStorage(STORAGE_KEYS.USER, users);
    saveSession(STORAGE_KEYS.TOKEN, user);

    alert(MESSAGES.LOGIN_SUCCESS);
    window.location.href = "../../../index.html";
    loginForm.reset();
    return;
  }

  user.loginAttempts += 1;

  if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    user.isLocked = true;
    alert("Account locked due to 3 failed attempts.\nPlease reset your password.");
  } else {
    alert(`Invalid password! Attempts left: ${MAX_LOGIN_ATTEMPTS - user.loginAttempts}`);
  }

  users[userIndex] = user;
  saveToStorage(STORAGE_KEYS.USER, users);
});

goToRegister?.addEventListener("click", (event: Event) => {
  event.preventDefault();
  window.location.href = "../register/register.html";
});
