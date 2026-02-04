import {
  getSession,
  saveSession,
  getFromStorage,
  saveToStorage,
} from "../utils/storage.js";
import { STORAGE_KEYS } from "../../constant.js";

export interface IUser {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  appliedJobs: string[];
  savedJobs: string[];
  bookmarkedJobs: string[];
}

function getAllUsers(): IUser[] {
  return getFromStorage<IUser[]>(STORAGE_KEYS.USER) || [];
}

function saveAllUsers(users: IUser[]) {
  saveToStorage(STORAGE_KEYS.USER, users);
}

export function getCurrentUser(): IUser | null {
  return getSession<IUser>(STORAGE_KEYS.TOKEN);
}

function dispatchUserUpdate(user: IUser) {
  document.dispatchEvent(
    new CustomEvent("userUpdated", { detail: user })
  );
}

function syncUser(user: IUser) {
  const users = getAllUsers();
  const index = users.findIndex(u => u.email === user.email);

  if (index !== -1) {
    users[index] = { ...user };
  } else {
    users.push({ ...user });
  }

  saveAllUsers(users);
  saveSession(STORAGE_KEYS.TOKEN, { ...user });

  dispatchUserUpdate(user);
}

export function applyJob(jobId: string) {
  const user = getCurrentUser();
  if (!user) return;

  user.appliedJobs ??= [];

  if (!user.appliedJobs.includes(jobId)) {
    user.appliedJobs.push(jobId);
    syncUser(user);
  }
}

export function bookmarkJob(jobId: string) {
  const user = getCurrentUser();
  if (!user) return;

  user.bookmarkedJobs ??= [];

  if (!user.bookmarkedJobs.includes(jobId)) {
    user.bookmarkedJobs.push(jobId);
    syncUser(user);
  }
}

export function removeBookmarkForUser(jobId: string) {
  const user = getCurrentUser();
  if (!user) return;

  user.bookmarkedJobs ??= [];
  user.bookmarkedJobs = user.bookmarkedJobs.filter(id => id !== jobId);

  syncUser(user);
}

export function saveJob(jobId: string) {
  const user = getCurrentUser();
  if (!user) return;

  user.savedJobs ??= [];

  if (!user.savedJobs.includes(jobId)) {
    user.savedJobs.push(jobId);
    syncUser(user);
  }
}

