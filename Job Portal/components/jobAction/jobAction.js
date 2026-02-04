import { getSession, saveSession, getFromStorage, saveToStorage, } from "../utils/storage.js";
import { STORAGE_KEYS } from "../../constant.js";
function getAllUsers() {
    return getFromStorage(STORAGE_KEYS.USER) || [];
}
function saveAllUsers(users) {
    saveToStorage(STORAGE_KEYS.USER, users);
}
export function getCurrentUser() {
    return getSession(STORAGE_KEYS.TOKEN);
}
function dispatchUserUpdate(user) {
    document.dispatchEvent(new CustomEvent("userUpdated", { detail: user }));
}
function syncUser(user) {
    const users = getAllUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index !== -1) {
        users[index] = Object.assign({}, user);
    }
    else {
        users.push(Object.assign({}, user));
    }
    saveAllUsers(users);
    saveSession(STORAGE_KEYS.TOKEN, Object.assign({}, user));
    dispatchUserUpdate(user);
}
export function applyJob(jobId) {
    var _a;
    const user = getCurrentUser();
    if (!user)
        return;
    (_a = user.appliedJobs) !== null && _a !== void 0 ? _a : (user.appliedJobs = []);
    if (!user.appliedJobs.includes(jobId)) {
        user.appliedJobs.push(jobId);
        syncUser(user);
    }
}
export function bookmarkJob(jobId) {
    var _a;
    const user = getCurrentUser();
    if (!user)
        return;
    (_a = user.bookmarkedJobs) !== null && _a !== void 0 ? _a : (user.bookmarkedJobs = []);
    if (!user.bookmarkedJobs.includes(jobId)) {
        user.bookmarkedJobs.push(jobId);
        syncUser(user);
    }
}
export function removeBookmarkForUser(jobId) {
    var _a;
    const user = getCurrentUser();
    if (!user)
        return;
    (_a = user.bookmarkedJobs) !== null && _a !== void 0 ? _a : (user.bookmarkedJobs = []);
    user.bookmarkedJobs = user.bookmarkedJobs.filter(id => id !== jobId);
    syncUser(user);
}
export function saveJob(jobId) {
    var _a;
    const user = getCurrentUser();
    if (!user)
        return;
    (_a = user.savedJobs) !== null && _a !== void 0 ? _a : (user.savedJobs = []);
    if (!user.savedJobs.includes(jobId)) {
        user.savedJobs.push(jobId);
        syncUser(user);
    }
}
