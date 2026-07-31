// script.js
import { CONFIG } from './config.js';
import { saveMessages, loadMessages, clearMessages } from './storage.js';
import { renderMarkdown } from './markdown.js';

// --- DOM refs ---
const messagesEl = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');
const typingIndicator = document.getElementById('typingIndicator');

// --- State ---
let messages = loadMessages();
let isWaiting = false;

// --- Render semua pesan ---
function renderMessages() {
    messagesEl.innerHTML = '';
    messages.forEach((msg, index) => {
        const messageDiv = createMessageElement(msg, index);
        messagesEl.appendChild(messageDiv);
    });
    scrollToBottom();
}

// --- Buat elemen pesan ---
function createMessageElement(msg, index) {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${msg.role}`;
    wrapper.dataset.index = index;

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    const img = document.createElement('img');
    img.src = msg.role === 'user' 
        ? 'assets/avatar-user.svg' 
        : 'assets/avatar-ai.svg';
    img.alt = msg.role === 'user' ? 'User' : 'AI';
    avatar.appendChild(img);

    // Bubble
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    if (msg.role === 'user') {
        bubble.textContent = msg.content;
    } else {
        // Render markdown untuk AI
        bubble.innerHTML = renderMarkdown(msg.content);
    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    return wrapper;
}

// --- Scroll ke bawah ---
function scrollToBottom() {
    const container = document.getElementById('chatContainer');
    container.scrollTop = container.scrollHeight;
}

// --- Kirim pesan ke AI ---
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text || isWaiting) return;

    // Tambah pesan user
    addMessage('user', text);
    userInput.value = '';
    userInput.style.height = 'auto';

    // Tampilkan indikator mengetik
    typingIndicator.classList.remove('hidden');
    isWaiting = true;
    sendBtn.disabled = true;

    try {
        const aiResponse = await callGeminiAPI(text);
        addMessage('assistant', aiResponse);
    } catch (error) {
        console.error('Error:', error);
        addMessage('assistant', '⚠️ Maaf, terjadi kesalahan: ' + error.message);
    } finally {
        typingIndicator.classList.add('hidden');
        isWaiting = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// --- Tambah pesan ke state & render ---
function addMessage(role, content) {
    messages.push({ role, content });
    saveMessages(messages);
    renderMessages();
}

// --- Panggil Google Gemini API ---
async function callGeminiAPI(prompt) {
    const { API_KEY, MODEL, SAFETY_SETTINGS, TEMPERATURE, MAX_TOKENS } = CONFIG;

    if (!API_KEY || API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
        throw new Error('API Key belum diatur. Edit config.js!');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const payload = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ],
        safetySettings: SAFETY_SETTINGS,
        generationConfig: {
            temperature: TEMPERATURE,
            maxOutputTokens: MAX_TOKENS,
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP ${response.status}`;
        throw new Error(errMsg);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Respons kosong dari AI.');
    return text;
}

// --- Hapus semua chat ---
function clearChat() {
    if (messages.length === 0) return;
    if (confirm('Hapus semua percakapan?')) {
        messages = [];
        clearMessages();
        renderMessages();
    }
}

// --- Ekspor chat ke file .txt ---
function exportChat() {
    if (messages.length === 0) {
        alert('Belum ada percakapan untuk diekspor.');
        return;
    }
    const lines = messages.map(m => 
        `[${m.role === 'user' ? 'User' : 'AI'}]: ${m.content}`
    );
    const content = lines.join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JECKGPT-chat-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// --- Auto-resize textarea ---
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
});

// --- Event listeners ---
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
clearBtn.addEventListener('click', clearChat);
exportBtn.addEventListener('click', exportChat);

// --- Inisialisasi ---
renderMessages();
userInput.focus();