export const STORAGE_KEYS = {
  TOKEN: "auth_token" as const,
  USER: "user" as const,
  LOGIN_PAGE_PATH: "./components/authorization/login/login.html" as const,
  REGISTER_PAGE_PATH: "./components/authorization/register/register.html" as const,
} as const;

export const MESSAGES = {
  REG_SUCCESS: "Registration successful!",
  FILL_ALL: "Please fill all fields!",
  INVALID_EMAIL: "Please enter a valid email.",
  PASSWORD_SHORT: "Password must be at least 6 characters.",

  LOGIN_SUCCESS: "Login successful!",
  LOGIN_FAIL: "Invalid email or password.",
} as const;

export const USER_PROFILE_IDS = {
  wrapper: "userProfileWrapper",
  verifyBtn: "verifyEmailBtn",
  logoutBtn: "logoutBtn",
  navName: "navUserName",
} as const;

export const CLASS_NAMES = {
  profileHeader: "profile-header",
  profileStatus: "profile-status",
  verifyBtn: "verify-btn",
  jobCounts: "job-counts",
  logoutBtn: "logout-btn",
} as const;

