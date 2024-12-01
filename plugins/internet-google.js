import { googleIt } from '@bochilteam/scraper';

let handler = async (m, { conn, command, args }) => {
    const fetch = (await import('node-fetch')).default;
    let full = /f$/i.test(command);
    let text = args.join(' ');

    if (!text) return conn.reply(m.chat, 'No text to search', m);

    // Define the prohibited terms with spaces removed
    let prohibitedTerms = ['hentai', 'telanjang', 'fuck', 'naked', 'bokep', 'porn']; // Add more terms if needed

    // Remove all spaces from the search query
    let queryWithoutSpaces = text.replace(/\s/g, '').toLowerCase();

    // Check if any prohibited term is present in the search query
    if (prohibitedTerms.some(term => queryWithoutSpaces.includes(term))) {
        return conn.reply(m.chat, 'Forbidden search query 🔨', m);
    }

    let url = 'https://google.com/search?q=' + encodeURIComponent(text);
    let search = await googleIt(text);
    let msg = search.articles
        .map(({ title, url, description }) => {
            return `*${title}*\n_${url}_\n_${description}_`;
        })
        .join('\n\n');

    try {
        let ss = await (
            await fetch(
                global.API('nrtm', '/api/ssweb', { delay: 1000, url, full })
            )
        ).arrayBuffer();

        if (/<!DOCTYPE html>/i.test(ss.toBuffer().toString())) throw '';
        await conn.sendFile(m.chat, ss, 'screenshot.png', url + '\n\n' + msg, m);
    } catch (e) {
        m.reply(msg);
    }
};

handler.help = ['google', 'googlef'].map(v => v + ' <search>');
handler.tags = ['internet'];
handler.command = /^googlef?$/i;

export default handler;
