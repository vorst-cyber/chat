// storage.js
const STORAGE_KEY = 'jeckgpt_chat_history';

export function saveMessages(messages) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
        console.warn('Gagal menyimpan chat:', e);
    }
}

export function loadMessages() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.warn('Gagal memuat chat:', e);
        return [];
    }
}

export function clearMessages() {
    localStorage.removeItem(STORAGE_KEY);
}