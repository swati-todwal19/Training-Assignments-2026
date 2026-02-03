import { getSession } from "../utils/storage.js";
import { STORAGE_KEYS } from "../../constant.js";
import { refreshProfileCounts } from "../userProfile/userProfile.js";
function getAllUsers() {
    return JSON.parse(localStorage.getItem("users") || "{}");
}
function saveAllUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}
export function getCurrentUser() {
    const sessionUser = getSession(STORAGE_KEYS.TOKEN);
    if (!sessionUser)
        return null;
    const users = getAllUsers();
    return users[sessionUser.email] || null;
}
function saveUser(user) {
    const users = getAllUsers();
    users[user.email] = user;
    saveAllUsers(users);
}
export function applyJob(jobId) {
    const user = getCurrentUser();
    if (!user)
        return;
    if (!user.appliedJobs.includes(jobId)) {
        user.appliedJobs.push(jobId);
        saveUser(user);
        refreshProfileCounts(user);
    }
}
export function bookmarkJob(jobId) {
    const user = getCurrentUser();
    if (!user)
        return;
    if (!user.bookmarkedJobs.includes(jobId)) {
        user.bookmarkedJobs.push(jobId);
        saveUser(user);
        refreshProfileCounts(user);
    }
}
export function removeBookmarkForUser(jobId) {
    const user = getCurrentUser();
    if (!user)
        return;
    user.bookmarkedJobs = user.bookmarkedJobs.filter(id => id !== jobId);
    saveUser(user);
    refreshProfileCounts(user);
}
export function saveJob(jobId) {
    const user = getCurrentUser();
    if (!user)
        return;
    if (!user.savedJobs.includes(jobId)) {
        user.savedJobs.push(jobId);
        saveUser(user);
        refreshProfileCounts(user);
    }
}
