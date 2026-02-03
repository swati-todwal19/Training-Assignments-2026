import { STORAGE_KEYS, MESSAGES } from "../../../constant.js";
import { getFromStorage, saveSession, getSession } from "../../utils/storage.js";
import { hashPassword } from "../../utils/hash.js";
const loginForm = document.getElementById("loginForm");
const goToRegister = document.getElementById("goToRegister");
const MAX_LOGIN_ATTEMPTS = 3;
const currentUser = getSession(STORAGE_KEYS.TOKEN);
if (currentUser) {
    alert(`Welcome back, ${currentUser.name}! Redirecting to home page...`);
    window.location.href = "../../../index.html";
}
if (!loginForm) {
    console.error("Login form not found!");
}
else {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        if (!emailInput || !passwordInput)
            return alert("Form inputs not found!");
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        if (!email || !password)
            return alert(MESSAGES.FILL_ALL);
        if (!email.includes("@"))
            return alert(MESSAGES.INVALID_EMAIL);
        if (password.length < 6)
            return alert(MESSAGES.PASSWORD_SHORT);
        const users = getFromStorage(STORAGE_KEYS.USER) || [];
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex === -1) {
            alert(MESSAGES.LOGIN_FAIL);
            return;
        }
        const user = users[userIndex];
        if (user.loginAttempts === undefined)
            user.loginAttempts = 0;
        if (user.isLocked === undefined)
            user.isLocked = false;
        if (user.isLocked) {
            alert("Account locked! Please reset your password.");
            const submitBtn = loginForm.querySelector("button[type='submit']");
            if (submitBtn)
                submitBtn.disabled = true;
            return;
        }
        const hashedPassword = await hashPassword(password);
        if (user.passwordHash === hashedPassword) {
            user.loginAttempts = 0;
            user.isLocked = false;
            users[userIndex] = user;
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(users));
            saveSession(STORAGE_KEYS.TOKEN, user);
            alert(MESSAGES.LOGIN_SUCCESS);
            window.location.href = "../../../index.html";
            loginForm.reset();
            return;
        }
        user.loginAttempts += 1;
        if (user.loginAttempts < MAX_LOGIN_ATTEMPTS) {
            const attemptsLeft = MAX_LOGIN_ATTEMPTS - user.loginAttempts;
            alert(`Invalid password! Attempts left: ${attemptsLeft}`);
        }
        else {
            user.isLocked = true;
            alert("Account locked due to 3 failed attempts.\nPlease reset your password.");
            const submitBtn = loginForm.querySelector("button[type='submit']");
            if (submitBtn)
                submitBtn.disabled = true;
        }
        users[userIndex] = user;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(users));
    });
    goToRegister === null || goToRegister === void 0 ? void 0 : goToRegister.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "../register/register.html";
    });
}
