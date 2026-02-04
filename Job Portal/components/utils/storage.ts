export function saveToStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getFromStorage<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
}

export function saveSession(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data));
}

export function getSession<T>(key: string): T | null {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
}
