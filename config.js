// config.js
export const CONFIG = {
    // Ganti dengan API Key Anda dari Google AI Studio
    API_KEY: 'AQ.Ab8RN6LnAlAbR7igBR1frhaDcTpy2j0UlOQULwzZFxG88vb0-w',

    // Model yang digunakan (gemini-pro atau gemini-1.5-pro)
    MODEL: 'gemini-pro',

    // Pengaturan keamanan – semua diset ke BLOCK_NONE agar "uncensored"
    SAFETY_SETTINGS: [
        { category: 'HARM_CATEGORY_HARASSMENT',     threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',     threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ],

    // Suhu (kreativitas) 0–1
    TEMPERATURE: 0.9,

    // Maksimum token respons
    MAX_TOKENS: 2048
};
