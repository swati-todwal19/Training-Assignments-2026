export function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
export function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
export function saveSession(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data));
}
export function getSession(key) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
