import { STORAGE_KEYS, MESSAGES } from "../../../constant.js";
import { User } from "../../models/types.js";
import { hashPassword } from "../../utils/hash.js";
import { generateOTP } from "../../otp/otpUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm") as HTMLFormElement | null;
  const goToLogin = document.getElementById("goToLogin") as HTMLAnchorElement | null;

  if (!registerForm) {
    console.error("Register form not found");
    return;
  }

  goToLogin?.addEventListener("click", (event: Event) => {
    event.preventDefault();
    window.location.href = "../login/login.html";
  });

  registerForm.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const nameInput = document.getElementById("name") as HTMLInputElement | null;
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;

    if (!nameInput || !emailInput || !passwordInput) {
      alert("Form elements missing!");
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!name || !email || !password) {
      alert(MESSAGES.FILL_ALL);
      return;
    }

    if (!email.includes("@")) {
      alert(MESSAGES.INVALID_EMAIL);
      return;
    }

    if (password.length < 6) {
      alert(MESSAGES.PASSWORD_SHORT);
      return;
    }

    const users: User[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.USER) || "[]"
    );

    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      alert("Email already registered. Please login.");
      return;
    }

    const passwordHash = await hashPassword(password);

    const otp = generateOTP();
    const otpExpiry = Date.now() + 2 * 60 * 1000;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      passwordHash,
      isVerified: false,
      loginAttempts: 0,
      isLocked: false,
      roles: "USER",
      otp,
      otpExpiry
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(users));

    alert(`${MESSAGES.REG_SUCCESS}\nYour OTP is: ${otp}`);

    window.location.href = "../../otp/otpVerify.html";

    registerForm.reset();
  });
});
