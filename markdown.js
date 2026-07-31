// markdown.js
/**
 * Mengubah teks Markdown sederhana menjadi HTML.
 * Mendukung: bold, italic, code, pre, list, link, header, blockquote.
 */
export function renderMarkdown(text) {
    if (!text) return '';

    // Escape HTML entities
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Header
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Blockquote
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Code block (``` ... ```)
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Bold & Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Link [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // List (unordered) - sederhana, per baris
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    // List (ordered)
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

    // Bungkus list items dengan ul/ol (sangat sederhana)
    // Karena kita tidak punya parser state, kita hanya wrap semua li yang berurutan
    // Ini pendekatan basic, cukup untuk penggunaan umum.
    html = html.replace(/(<li>.*<\/li>)/g, (match) => {
        // cek apakah ada ordered? kita asumsikan unordered
        return `<ul>${match}</ul>`;
    });

    // Baris baru menjadi <br> atau <p>
    html = html.replace(/\n/g, '<br>');

    // Hapus <br> berlebih di dalam header, blockquote, pre
    html = html.replace(/<(h[1-3]|blockquote|pre)><br>/g, '<$1>');

    return html;
}