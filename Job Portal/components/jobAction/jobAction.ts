import { getSession } from "../utils/storage.js";
import { STORAGE_KEYS } from "../../constant.js";
import { refreshProfileCounts } from "../userProfile/userProfile.js";

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  appliedJobs: string[];
  savedJobs: string[];
  bookmarkedJobs: string[];
}

function getAllUsers(): Record<string, User> {
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveAllUsers(users: Record<string, User>) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  const sessionUser = getSession<{ email: string }>(STORAGE_KEYS.TOKEN);
  if (!sessionUser) return null;

  const users = getAllUsers();
  return users[sessionUser.email] || null;
}

function saveUser(user: User) {
  const users = getAllUsers();
  users[user.email] = user;
  saveAllUsers(users);
}

export function applyJob(jobId: string) {
  const user = getCurrentUser();
  if (!user) return;

  if (!user.appliedJobs.includes(jobId)) {
    user.appliedJobs.push(jobId);
    saveUser(user);
    refreshProfileCounts(user);
  }
}

export function bookmarkJob(jobId: string) {
  const user = getCurrentUser();
  if (!user) return;

  if (!user.bookmarkedJobs.includes(jobId)) {
    user.bookmarkedJobs.push(jobId);
    saveUser(user);
    refreshProfileCounts(user);
  }
}

export function removeBookmarkForUser(jobId: string) {
  const user = getCurrentUser();
  if (!user) return;

  user.bookmarkedJobs = user.bookmarkedJobs.filter(id => id !== jobId);
  saveUser(user);

  refreshProfileCounts(user);
}

export function saveJob(jobId: string) {
  const user = getCurrentUser();
  if (!user) return;

  if (!user.savedJobs.includes(jobId)) {
    user.savedJobs.push(jobId);
    saveUser(user);
    refreshProfileCounts(user);
  }
}
