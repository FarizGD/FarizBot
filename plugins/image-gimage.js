import { googleImage } from '@bochilteam/scraper';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Use example ${usedPrefix}${command} Minecraft`;

    // Define the prohibited terms with spaces removed
    let prohibitedTerms = ['hentai', 'telanjang', 'fuck', 'naked', 'bokep', 'porn']; // Add more terms if needed

    // Remove all spaces from the search query
    let queryWithoutSpaces = text.replace(/\s/g, '').toLowerCase();

    // Check if any prohibited term is present in the search query
    if (prohibitedTerms.some(term => queryWithoutSpaces.includes(term))) {
        return conn.reply(m.chat, 'Forbidden search query 🔨', m);
    }

    const res = await googleImage(text);
    conn.sendFile(
        m.chat,
        res.getRandom(),
        'gimage.jpg',
        `*── 「 GOOGLE IMAGE 」 ──*\n\nResult from *${text}*`.trim(),
        m
    );
};

handler.help = ['gimage <query>', 'image <query>'];
handler.tags = ['internet', 'tools'];
handler.command = /^(gimage|image)$/i;

export default handler;
