import { STORAGE_KEYS } from "../../../constant.js";
import { getFromStorage } from "../../utils/storage.js";
import { hashPassword } from "../../utils/hash.js";
import { validateRequired, validateEmail, validatePassword } from "../../utils/validation.js";
const resetForm = document.getElementById("resetForm");
if (!resetForm) {
    console.error("Reset form not found!");
}
else {
    resetForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const emailInput = document.getElementById("email");
        const newPasswordInput = document.getElementById("newPassword");
        const confirmPasswordInput = document.getElementById("confirmPassword");
        if (!emailInput || !newPasswordInput || !confirmPasswordInput)
            return;
        const email = emailInput.value.trim();
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const requiredCheck = validateRequired(email, newPassword, confirmPassword);
        if (!requiredCheck.valid) {
            alert(requiredCheck.message);
            return;
        }
        const emailCheck = validateEmail(email);
        if (!emailCheck.valid) {
            alert(emailCheck.message);
            return;
        }
        const passwordCheck = validatePassword(newPassword);
        if (!passwordCheck.valid) {
            alert(passwordCheck.message);
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const users = getFromStorage(STORAGE_KEYS.USER) || [];
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex === -1) {
            alert("Email not found! Please register first.");
            return;
        }
        const user = users[userIndex];
        if (user.isLocked === undefined)
            user.isLocked = false;
        if (user.loginAttempts === undefined)
            user.loginAttempts = 0;
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
