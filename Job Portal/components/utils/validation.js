import { MESSAGES } from "../../constant.js";
export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regex.test(email)) {
        return { valid: false, message: MESSAGES.INVALID_EMAIL };
    }
    return { valid: true };
}
export function validatePassword(password) {
    if (!password || password.length < 6) {
        return { valid: false, message: MESSAGES.PASSWORD_SHORT };
    }
    return { valid: true };
}
export function validateRequired(...fields) {
    if (fields.some(f => !f || !f.trim())) {
        return { valid: false, message: MESSAGES.FILL_ALL };
    }
    return { valid: true };
}
