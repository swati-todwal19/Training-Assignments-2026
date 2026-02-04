import { MESSAGES } from "../../constant.js";

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateEmail(email: string): ValidationResult {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !regex.test(email)) {
    return { valid: false, message: MESSAGES.INVALID_EMAIL };
  }
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password || password.length < 6) {
    return { valid: false, message: MESSAGES.PASSWORD_SHORT };
  }
  return { valid: true };
}

export function validateRequired(...fields: string[]): ValidationResult {
  if (fields.some(f => !f || !f.trim())) {
    return { valid: false, message: MESSAGES.FILL_ALL };
  }
  return { valid: true };
}
