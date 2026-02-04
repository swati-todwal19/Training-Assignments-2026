import { STORAGE_KEYS } from "../../constant.js";
import { saveToStorage, getFromStorage } from "../utils/storage.js";
import { generateOTP } from "./otpUtils.js";
const otpForm = document.getElementById("otpForm");
const otpInput = document.getElementById("otpInput");
const resendBtn = document.getElementById("resendOtp");
const otpTimerDisplay = document.getElementById("otpTimer");
let timerInterval;
let currentUser;
const users = getFromStorage(STORAGE_KEYS.USER) || [];
currentUser = users[users.length - 1];
if (!currentUser) {
    alert("No user found. Please register first.");
    window.location.href = "../authorization/register/register.html";
}
function generateAndSendOtp(user) {
    user.otp = generateOTP();
    user.otpExpiry = Date.now() + 2 * 60 * 1000;
    const users = getFromStorage(STORAGE_KEYS.USER) || [];
    const index = users.findIndex(u => u.email === user.email);
    if (index !== -1)
        users[index] = user;
    saveToStorage(STORAGE_KEYS.USER, users);
    alert(`OTP sent: ${user.otp}`);
    startOtpTimer(user.otpExpiry);
}
function startOtpTimer(expiryTime) {
    clearInterval(timerInterval);
    function updateTimer() {
        const remaining = expiryTime - Date.now();
        if (remaining <= 0) {
            otpTimerDisplay.innerText = "00:00";
            clearInterval(timerInterval);
            alert("OTP expired! Please resend OTP.");
            return;
        }
        const minutes = Math.floor(remaining / 1000 / 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        otpTimerDisplay.innerText =
            `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}
if (currentUser) {
    if (!currentUser.otp || !currentUser.otpExpiry || Date.now() > currentUser.otpExpiry) {
        generateAndSendOtp(currentUser);
    }
    else {
        startOtpTimer(currentUser.otpExpiry);
    }
}
otpForm === null || otpForm === void 0 ? void 0 : otpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!otpInput || !currentUser)
        return;
    const enteredOtp = otpInput.value.trim();
    if (!enteredOtp) {
        alert("Please enter OTP");
        return;
    }
    if (enteredOtp === currentUser.otp &&
        currentUser.otpExpiry &&
        Date.now() < currentUser.otpExpiry) {
        alert("OTP verified successfully");
        currentUser.isVerified = true;
        delete currentUser.otp;
        delete currentUser.otpExpiry;
        const users = getFromStorage(STORAGE_KEYS.USER) || [];
        const index = users.findIndex(u => u.email === currentUser.email);
        if (index !== -1)
            users[index] = currentUser;
        saveToStorage(STORAGE_KEYS.USER, users);
        clearInterval(timerInterval);
        window.location.href = "../authorization/login/login.html";
    }
    else {
        alert("Invalid or expired OTP");
    }
});
resendBtn === null || resendBtn === void 0 ? void 0 : resendBtn.addEventListener("click", () => {
    if (!currentUser)
        return;
    generateAndSendOtp(currentUser);
});
